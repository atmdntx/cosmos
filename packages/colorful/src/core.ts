import Color from "colorjs.io";
import type {
  ColorfulColorScheme,
  ColorfulPalette,
  ColorfulShade,
  ColorScheme,
  ContrastType,
} from "./types";
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

interface ColorfulPaletteCreatorOptions {
  contrastMode?: ContrastType;
}

export class ColorfulPaletteCreator {
  #inputColor: Color;
  #colorScheme: ColorfulColorScheme;
  #contrastMode: ContrastType;
  #primaryCache?: ColorfulPalette;
  #secondaryCache?: ColorfulPalette;
  #tertiaryCache?: ColorfulPalette;
  #errorCache?: ColorfulPalette;
  #neutralCache?: { baseColor: Color; shades: ColorfulShade[]; palette: ColorfulPalette };
  #grayCache?: { baseColor: Color; shades: ColorfulShade[]; palette: ColorfulPalette };
  constructor(
    inputColor: ColorTypes,
    colorScheme: ColorScheme = "default",
    options: ColorfulPaletteCreatorOptions = {},
  ) {
    this.#inputColor = this.#normalizeColor(inputColor) as Color;
    this.#contrastMode = options.contrastMode ?? "WCAG21";
    this.#colorScheme = getElementByKey(
      colorScheme.trim(),
      COLORFUL_COLOR_SCHEMES,
    ) as ColorfulColorScheme;
  }

  /**
   * Paleta principal derivada del color de entrada y transformaciones del esquema.
   */
  get primaryPalette() {
    if (this.#primaryCache) return this.#primaryCache;
    const baseColor = applyRoleTransform(this.#inputColor.clone(), this.#colorScheme.roles.primary);
    const closestPalette = this.#getClosestPalette(baseColor);
    const basePalette = createBasePalette(baseColor, closestPalette, {
      contrastMode: this.#contrastMode,
    });
    const palette = this.#assemblePalette(baseColor, basePalette);
    this.#primaryCache = palette;
    return palette;
  }

  /**
   * Variante secundaria que ajusta tono/croma antes de generar los tonos base.
   */
  get secondaryPalette() {
    if (this.#secondaryCache) return this.#secondaryCache;
    const baseColor = applyRoleTransform(
      this.#inputColor.clone(),
      this.#colorScheme.roles.secondary,
    );
    const closestPalette = this.#getClosestPalette(baseColor);
    const basePalette = createBasePalette(baseColor, closestPalette, {
      contrastMode: this.#contrastMode,
    });
    const palette = this.#assemblePalette(baseColor, basePalette);
    this.#secondaryCache = palette;
    return palette;
  }

  /**
   * Variante terciaria que aplica una transformación adicional para contrastes.
   */
  get tertiaryPalette() {
    if (this.#tertiaryCache) return this.#tertiaryCache;
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
      const basePalette = createBasePalette(baseColor, closestPalette, {
        contrastMode: this.#contrastMode,
      });
      const palette = this.#assemblePalette(baseColor, basePalette);
      this.#neutralCache = { baseColor, shades: basePalette, palette };
    }

    return this.#neutralCache.palette;
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
      const shades = this.#deriveGrayPalette(neutralCache.shades, this.#contrastMode);
      const palette = this.#assemblePalette(baseColor, shades);
      this.#grayCache = { baseColor, shades, palette };
    }
    return this.#grayCache.palette;
  }

  /**
   * Paleta de error; enfatiza el rojo respetando el esquema activo.
   */
  get errorPalette() {
    if (this.#errorCache) return this.#errorCache;
    const baseColor = applyRoleTransform(this.#inputColor.clone(), this.#colorScheme.roles.error);
    const closestPalette = this.#getClosestErrorPalette(baseColor);
    const basePalette = createBasePalette(baseColor, closestPalette, {
      mode: "error",
      contrastMode: this.#contrastMode,
    });
    const palette = this.#assemblePalette(baseColor, basePalette);
    this.#errorCache = palette;
    return palette;
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
  #deriveGrayPalette(neutralShades: ColorfulShade[], contrastMode: ContrastType): ColorfulShade[] {
    const numbers = neutralShades.map((s) => s.number);
    const colors: Color[] = [];
    for (const shade of neutralShades) {
      const { l, c, h } = shade.color.oklch;
      const baseL = l ?? 0;
      const baseC = c ?? 0;
      const baseH = h ?? 0;
      const derivedL = clamp(baseL + (1 - baseL) * 0.02, 0, 1);
      colors.push(new Color("oklch", [derivedL, Math.min(baseC * 0.15, 0.04), baseH]));
    }
    return colors.map((color, i) => createShadeObject(color, numbers[i]!, colors, contrastMode));
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
