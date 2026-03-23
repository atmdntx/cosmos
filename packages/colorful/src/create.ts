import Color from "colorjs.io";
import type {
  ColorfulShade,
  ContrastType,
  ExtendedTailwindPalette,
  Mode,
  TailwindColorScale,
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

interface ContrastCandidate {
  color: Color;
  contrast: number;
}

/**
 * Convierte un color generado en la representación completa (`ColorfulShade`)
 * calculando contrastes, formatos (hex/rgb/p3, etc.) y metadatos asociados.
 */
export function createShadeObject(
  inputColor: Color,
  number: TailwindColorScale,
  candidates: Color[],
  contrastMode: ContrastType = "APCA",
): ColorfulShade {
  const MIN_CONTRAST = contrastMode === "APCA" ? MIN_APCA_CONTRAST : MIN_WCAG_CONTRAST;
  const sortedCandidates: ContrastCandidate[] = candidates
    .map((color) => ({ color, contrast: Math.abs(inputColor.contrast(color, contrastMode)) }))
    .sort((a, b) => a.contrast - b.contrast);

  let bestContrastColor: Color | undefined;
  let usesFallbackContrast = false;

  for (const { color, contrast } of sortedCandidates) {
    if (contrast >= MIN_CONTRAST) {
      bestContrastColor = color;
      break;
    }
  }

  if (!bestContrastColor) {
    const contrastWhite = Math.abs(inputColor.contrast(WHITE, contrastMode));
    const contrastBlack = Math.abs(inputColor.contrast(BLACK, contrastMode));

    bestContrastColor = contrastWhite > contrastBlack ? WHITE : BLACK;
    usesFallbackContrast = true;
  }
  const contrastValue = Math.abs(inputColor.contrast(bestContrastColor, contrastMode));
  const contrast = bestContrastColor.to("oklch").toString({ format: "oklch" });
  const meetsContrast = contrastValue >= MIN_CONTRAST;

  return {
    number,
    color: inputColor.clone(),
    contrast: {
      color: new Color(contrast),
      contrastRatio: contrastValue,
      meetsContrast,
      usesFallbackContrast,
    },
    exports: {
      hex: inputColor.clone().to("srgb").toString({ format: "hex" }),
      oklch: inputColor.clone().to("oklch").toString({ format: "oklch" }),
      hsl: inputColor.clone().to("hsl").toString({ format: "hsl" }),
      p3: inputColor.clone().to("p3").toString({ format: "p3" }),
      srgb: inputColor.clone().to("srgb").toString({ format: "srgb" }),
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
  referencePalette: ExtendedTailwindPalette,
  options: CreatePaletteOptions = {},
): ColorfulShade[] {
  const { mode, contrastMode = "APCA" } = options;

  const generatedShades = referencePalette.shades.map((shade) => {
    const shadeColor = new Color(shade.color);
    const createdShadeColor = createShade(shadeColor, inputColor, mode) as Color;
    return { number: shade.number, color: createdShadeColor };
  });

  const allShades = generatedShades.map((s) => s.color);

  return generatedShades.map((item) => {
    return createShadeObject(item.color, item.number, allShades, contrastMode);
  });
}
