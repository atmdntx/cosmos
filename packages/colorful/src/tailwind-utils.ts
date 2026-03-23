import Color from "colorjs.io";
import type {
  ExtendedTailwindPalette,
  Mode,
  TailwindColors,
  TailwindColorScale,
  TailwindErrorColors,
  TailwindNeutralColors,
  TailwindPalette,
} from "./types";
import {
  ERROR_TAILWIND_COLORS,
  NEUTRAL_TAILWIND_COLORS,
  TAILWIND_COLORS,
} from "./tailwind-palettes";

/**
 * Normaliza cualquier paleta de Tailwind y la convierte en una lista homogénea
 * de tonos con su nombre, número de shade y objeto `Color` listo para cálculos.
 */
export function normalizedTailwindPalettes(
  palette: TailwindColors | TailwindNeutralColors | TailwindErrorColors,
): TailwindPalette[] {
  return Array.from(
    Object.entries(palette).map(([color, values]) => {
      return {
        name: color,
        shades: Object.entries(values).map(([shade, value]) => ({
          number: Number(shade) as TailwindColorScale,
          color: new Color(value),
        })),
      };
    }),
  );
}

/**
 * Busca la paleta de Tailwind más cercana al color de entrada. Permite limitar
 * la búsqueda a paletas neutrales o de error usando `mode`.
 */
export function closestTailwindPalette(inputColor: Color, mode?: Mode) {
  const tailwindPalettes = (
    mode === "error"
      ? normalizedTailwindPalettes(ERROR_TAILWIND_COLORS)
      : mode === "neutral"
        ? normalizedTailwindPalettes(NEUTRAL_TAILWIND_COLORS)
        : normalizedTailwindPalettes(TAILWIND_COLORS)
  ) as ExtendedTailwindPalette[];
  tailwindPalettes.map((palette) => {
    palette.shades = palette.shades.map((shade) => ({
      ...shade,
      delta: Color.deltaE2000(inputColor, shade.color),
    }));
  });

  tailwindPalettes.map(
    (palette) =>
      (palette.closestShade = palette.shades.reduce((closestShade, currentShade) =>
        (closestShade.delta ?? Infinity) < (currentShade.delta ?? Infinity)
          ? closestShade
          : currentShade,
      )),
  );

  return tailwindPalettes.reduce((bestPalette, currentPalette) =>
    (bestPalette.closestShade.delta ?? Infinity) < (currentPalette.closestShade.delta ?? Infinity)
      ? bestPalette
      : currentPalette,
  );
}

export function closestTailwindShadeNumber(inputColor: Color): TailwindColorScale {
  const closestShade = closestTailwindPalette(inputColor);
  return closestShade.closestShade.number;
}
