import Color from "colorjs.io";
import type {
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

let _cachedDefault: TailwindPalette[] | null = null,
  _cachedNeutral: TailwindPalette[] | null = null,
  _cachedError: TailwindPalette[] | null = null;

function getCachedPalette(mode?: Mode) {
  if (mode === "error") return (_cachedError ??= normalizedTailwindPalettes(ERROR_TAILWIND_COLORS));
  if (mode === "neutral")
    return (_cachedNeutral ??= normalizedTailwindPalettes(NEUTRAL_TAILWIND_COLORS));
  return (_cachedDefault ??= normalizedTailwindPalettes(TAILWIND_COLORS));
}

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
  const palettes = getCachedPalette(mode);
  let bestPalette: TailwindPalette | null = null,
    bestShadeIndex = -1,
    bestMinDelta = Infinity;

  for (const palette of palettes) {
    let minDelta = Infinity,
      minIndex = -1;

    for (let i = 0; i < palette.shades.length; i++) {
      const shade = palette.shades[i];
      const delta = Color.deltaE2000(inputColor, shade.color);
      if (delta < minDelta) {
        minDelta = delta;
        minIndex = i;
      }
    }
    if (minDelta < bestMinDelta) {
      bestMinDelta = minDelta;
      bestPalette = palette;
      bestShadeIndex = minIndex;
    }
  }

  if (!bestPalette || bestShadeIndex < 0) {
    return {
      name: "unknown",
      shades: [],
      closestShade: {
        number: 500 as TailwindColorScale,
        color: new Color("oklch(50% 0 0)"),
        delta: Infinity,
      },
    };
  }

  const extendedShades = bestPalette.shades.map((shade) => ({
    ...shade,
    delta: Color.deltaE2000(inputColor, shade.color),
  }));
  const closestShade =
    extendedShades[bestShadeIndex] ?? extendedShades.reduce((a, b) => (a.delta < b.delta ? a : b));
  return {
    name: bestPalette.name,
    shades: extendedShades,
    closestShade,
  };
}

export function closestTailwindShadeNumber(inputColor: Color): TailwindColorScale {
  const closestShade = closestTailwindPalette(inputColor);
  return closestShade.closestShade.number;
}
