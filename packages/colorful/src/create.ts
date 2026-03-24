import Color from "colorjs.io";
import type {
  ColorfulShade,
  ContrastType,
  Mode,
  TailwindColorScale,
  TailwindPalette,
} from "./types";
import { clamp } from "./utils";
import { BLACK, MIN_APCA_CONTRAST, MIN_WCAG_CONTRAST, WHITE } from "./constants";

/**
 * Ajusta un tono a partir de un color objetivo y uno de referencia, respetando
 * máximos de croma/luminancia y permitiendo forzar el matiz en modo error.
 */
export function createShade(inputColor: Color, baseColor: Color, mode?: Mode) {
  const { c: baseChroma = 0, h: baseHue = 0 } = baseColor.oklch;
  const { c: shadeChroma = 0, l: shadeLightness = 0, h: shadeHue = 0 } = inputColor.oklch;

  const chroma = Math.min(baseChroma ?? 0, shadeChroma ?? 0);
  const lightness = clamp(shadeLightness ?? 1, 0, 1);
  const hue = mode === "error" ? shadeHue : baseHue;

  return new Color("oklch", [lightness, chroma, hue]);
}

/**
 * Convierte un color generado en la representación completa (`ColorfulShade`)
 * calculando contrastes, formatos (hex/rgb/p3, etc.) y metadatos asociados.
 */
export function createShadeObject(
  inputColor: Color,
  number: TailwindColorScale,
  candidates: Color[],
  contrastMode: ContrastType = "WCAG21",
): ColorfulShade {
  const MIN_CONTRAST = contrastMode === "APCA" ? MIN_APCA_CONTRAST : MIN_WCAG_CONTRAST;

  let bestContrastColor: Color | undefined,
    bestContrastValue = Infinity,
    usesFallbackContrast = false;

  for (const color of candidates) {
    const contrast = Math.abs(inputColor.contrast(color, contrastMode));
    if (contrast >= MIN_CONTRAST && contrast < bestContrastValue) {
      bestContrastValue = contrast;
      bestContrastColor = color;
    }
  }

  if (!bestContrastColor) {
    const contrastWhite = Math.abs(inputColor.contrast(WHITE, contrastMode));
    const contrastBlack = Math.abs(inputColor.contrast(BLACK, contrastMode));

    bestContrastColor = contrastWhite > contrastBlack ? WHITE : BLACK;
    usesFallbackContrast = true;
    bestContrastValue = Math.max(contrastWhite, contrastBlack);
  }
  const contrastValue = bestContrastValue;
  const meetsContrast = contrastValue >= MIN_CONTRAST;

  const colorClone = inputColor.clone();
  const srgb = inputColor.clone().to("srgb");
  const oklch = inputColor.clone().to("oklch");
  const hsl = inputColor.clone().to("hsl");
  const p3 = inputColor.clone().to("p3");

  return {
    number,
    color: colorClone,
    contrast: {
      color: bestContrastColor.clone(),
      contrastRatio: contrastValue,
      meetsContrast,
      usesFallbackContrast,
    },
    exports: {
      hex: srgb.toString({ format: "hex" }),
      srgb: srgb.toString({ format: "srgb" }),
      oklch: oklch.toString({ format: "oklch" }),
      hsl: hsl.toString({ format: "hsl" }),
      p3: p3.toString({ format: "p3" }),
    },
  };
}

/** Opciones adicionales al generar la paleta base. */
interface CreatePaletteOptions {
  mode?: Mode;
  contrastMode?: ContrastType;
}

/**
 * Genera una paleta completa tomando una paleta Tailwind de referencia,
 * adaptando cada tono al color de entrada y enriqueciendo la salida con
 * información de contraste en el formato `ColorfulShade`.
 */
export function createBasePalette(
  inputColor: Color,
  referencePalette: TailwindPalette,
  options: CreatePaletteOptions = {},
): ColorfulShade[] {
  const { mode, contrastMode = "WCAG21" } = options;
  const numbers: TailwindColorScale[] = [];
  const colors: Color[] = [];

  for (const shade of referencePalette.shades) {
    const shadeColor = new Color(shade.color);
    const createdShadeColor = createShade(shadeColor, inputColor, mode) as Color;
    numbers.push(shade.number);
    colors.push(createdShadeColor);
  }

  const output: ColorfulShade[] = [];
  for (let i = 0; i < colors.length; i++) {
    output.push(createShadeObject(colors[i], numbers[i], colors, contrastMode));
  }
  return output;
}
