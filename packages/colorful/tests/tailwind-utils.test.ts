import { describe, expect, test } from "vite-plus/test";
import Color from "colorjs.io";
import { closestTailwindPalette, normalizedTailwindPalettes } from "../src/tailwind-utils";
import {
  TAILWIND_COLORS,
  NEUTRAL_TAILWIND_COLORS,
  ERROR_TAILWIND_COLORS,
} from "../src/tailwind-palettes";
import { TailwindColorNames } from "../src/types";

describe("tailwind-utils", () => {
  describe("normalizedTailwindPalettes", () => {
    test("convierte las constantes en paletas con objetos Color", () => {
      const palettes = normalizedTailwindPalettes(TAILWIND_COLORS);
      const bluePalette = palettes.find((palette) => palette.name === TailwindColorNames.Blue);
      expect(bluePalette).toBeDefined();
      expect(bluePalette?.shades).toHaveLength(11);
      expect(bluePalette?.shades[0].number).toBe(50);
      expect(bluePalette?.shades[0].color).toBeInstanceOf(Color);
    });
  });

  describe("closestTailwindPalette", () => {
    test("identifica la paleta completa más cercana", () => {
      const inputColor = new Color(TAILWIND_COLORS.blue[500]);
      const palette = closestTailwindPalette(inputColor);
      expect(palette.name).toBe(TailwindColorNames.Blue);
      expect(palette.closestShade.number).toBe(500);
    });

    test("acepta modo neutral para filtrar la búsqueda", () => {
      const neutralColor = new Color(NEUTRAL_TAILWIND_COLORS.gray[600]);
      const palette = closestTailwindPalette(neutralColor, "neutral");
      expect(palette.name).toBe(TailwindColorNames.Gray);
      expect(palette.closestShade.number).toBe(600);
    });

    test("acepta modo error para paletas de error", () => {
      const errorColor = new Color(ERROR_TAILWIND_COLORS.red[400]);
      const palette = closestTailwindPalette(errorColor, "error");
      expect(palette.name).toBe(TailwindColorNames.Red);
      expect(palette.closestShade.number).toBe(400);
    });
  });
});
