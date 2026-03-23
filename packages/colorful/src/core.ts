import Color from "colorjs.io";
import type { ColorfulColorScheme, ColorfulPalette, ColorfulShade, ColorScheme } from "./types";
import type { ColorTypes } from "colorjs.io";
import { clamp, getElementByKey } from "./utils";
import { COLORFUL_COLOR_SCHEMES } from "./color-schemes";
import { applyRoleTransform } from "./role-transforms";
import { closestTailwindPalette } from "./tailwind-utils";
import { findColorName } from "./find-color";
import { createBasePalette, createShadeObject } from "./create";

/**
 * Genera paletas de color coherentes a partir de un color base utilizando los
 * esquemas predefinidos de Colorful. Expone getters para cada rol cromático
 * (primario, secundario, etc.) y memoriza los cálculos costosos cuando es
 * necesario.
 */
export class ColorfulPaletteCreator {
  #inputColor: Color;
  #colorScheme: ColorfulColorScheme;
  #neutralCache?: { baseColor: Color; shades: ColorfulShade[] };
  #grayCache?: { baseColor: Color; shades: ColorfulShade[] };
  constructor(inputColor: ColorTypes, colorScheme: ColorScheme = "default") {
    this.#inputColor = this.#normalizeColor(inputColor) as Color;
    this.#colorScheme = getElementByKey(
      colorScheme.trim(),
      COLORFUL_COLOR_SCHEMES,
    ) as ColorfulColorScheme;
  }

  /**
   * Paleta principal derivada del color de entrada y transformaciones del esquema.
   */
  get primaryPalette() {
    const baseColor = applyRoleTransform(this.#inputColor.clone(), this.#colorScheme.roles.primary);
    const closestPalette = this.#getClosestPalette(baseColor);
    const basePalette = createBasePalette(baseColor, closestPalette);
    return this.#assemblePalette(baseColor, basePalette);
  }

  /**
   * Variante secundaria que ajusta tono/croma antes de generar los tonos base.
   */
  get secondaryPalette() {
    const baseColor = applyRoleTransform(
      this.#inputColor.clone(),
      this.#colorScheme.roles.secondary,
    );
    const closestPalette = this.#getClosestPalette(baseColor);
    const basePalette = createBasePalette(baseColor, closestPalette);
    return this.#assemblePalette(baseColor, basePalette);
  }

  /**
   * Variante terciaria que aplica una transformación adicional para contrastes.
   */
  get tertiaryPalette() {
    const baseColor = applyRoleTransform(
      this.#inputColor.clone(),
      this.#colorScheme.roles.tertiary,
    );
    const closestPalette = this.#getClosestPalette(baseColor);
    const basePalette = createBasePalette(baseColor, closestPalette);
    return this.#assemblePalette(baseColor, basePalette);
  }

  /**
   * Paleta neutra; se cachea porque suele reutilizarse para cálculos posteriores.
   */
  get neutralPalette() {
    if (!this.#neutralCache) {
      const baseColor = applyRoleTransform(
        this.#inputColor.clone(),
        this.#colorScheme.roles.neutral,
      );
      const closestPalette = this.#getClosestNeutralPalette(baseColor);
      const basePalette = createBasePalette(baseColor, closestPalette);
      this.#neutralCache = { baseColor, shades: basePalette };
    }
    const { baseColor, shades } = this.#neutralCache;
    return this.#assemblePalette(baseColor, shades);
  }

  /**
   * Paleta gris derivada a partir de la neutra, con saturación reducida.
   */
  get grayPalette() {
    if (!this.#grayCache) {
      const neutralCache =
        this.#neutralCache ??
        (() => {
          void this.neutralPalette;
          return this.#neutralCache!;
        })();
      const baseColor = applyRoleTransform(this.#inputColor.clone(), this.#colorScheme.roles.gray);
      const shades = this.#deriveGrayPalette(neutralCache.shades);
      this.#grayCache = { baseColor, shades };
    }
    const { baseColor, shades } = this.#grayCache;
    return this.#assemblePalette(baseColor, shades);
  }

  /**
   * Paleta de error; enfatiza el rojo respetando el esquema activo.
   */
  get errorPalette() {
    const baseColor = applyRoleTransform(this.#inputColor.clone(), this.#colorScheme.roles.error);
    const closestPalette = this.#getClosestErrorPalette(baseColor);
    const basePalette = createBasePalette(baseColor, closestPalette, { mode: "error" });
    return this.#assemblePalette(baseColor, basePalette);
  }

  /**
   * Normaliza cualquier valor aceptado por colorjs.io en una instancia consistente.
   */
  #normalizeColor(value: ColorTypes): Color | null {
    try {
      if (value instanceof Color) return new Color(value);
      return new Color(value);
    } catch (error) {
      console.warn(error);
      return null;
    }
  }

  /**
   * Busca la paleta Tailwind más similar para colores de rol primario/secundario.
   */
  #getClosestPalette(inputColor: Color) {
    return closestTailwindPalette(inputColor);
  }

  /**
   * Variante del cálculo de similitud enfocada en tonos neutros.
   */
  #getClosestNeutralPalette(inputColor: Color) {
    return closestTailwindPalette(inputColor, "neutral");
  }

  /**
   * Encuentra la paleta de referencia ideal para estados de error.
   */
  #getClosestErrorPalette(inputColor: Color) {
    return closestTailwindPalette(inputColor, "error");
  }

  /**
   * Deriva la paleta gris suavizando croma y elevando ligeramente la luminancia.
   */
  #deriveGrayPalette(neutralShades: ColorfulShade[]): ColorfulShade[] {
    const derivedShades = neutralShades.map((shade) => {
      const { l, c, h } = shade.color.oklch;
      const baseL = l ?? 0;
      const baseC = c ?? 0;
      const baseH = h ?? 0;
      const derivedL = clamp(baseL + (1 - baseL) * 0.02, 0, 1);
      const derivedColor = new Color("oklch", [derivedL, Math.min(baseC * 0.15, 0.04), baseH]);
      return { color: derivedColor, number: shade.number };
    });
    const candidates = derivedShades.map((entry) => entry.color);
    return derivedShades.map((entry) => createShadeObject(entry.color, entry.number, candidates));
  }

  /**
   * Empaqueta el color base y los tonos generados en la estructura pública.
   */
  #assemblePalette(baseColor: Color, basePalette: ColorfulShade[]): ColorfulPalette {
    return {
      name: String(findColorName(baseColor)),
      shades: basePalette,
    };
  }
}
