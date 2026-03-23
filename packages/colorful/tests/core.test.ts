import { beforeEach, describe, expect, test } from "vite-plus/test";
import { ColorfulPaletteCreator } from "../src/core";

describe("ColorfulPaletteCreator", () => {
  let creator: ColorfulPaletteCreator;

  beforeEach(() => {
    creator = new ColorfulPaletteCreator("#ff0000", "default");
  });

  test("genera la paleta primaria con 11 shades y nombre descriptivo", () => {
    const primary = creator.primaryPalette;
    expect(primary.name).toBe("red");
    expect(primary.shades).toHaveLength(11);
    primary.shades.forEach((shade) => {
      expect(shade.color).toBeDefined();
      expect(shade.contrast.color).toBeDefined();
    });
  });

  test("aplica transformaciones de rol para secundario y terciario", () => {
    const primary = creator.primaryPalette;
    const secondary = creator.secondaryPalette;
    const tertiary = creator.tertiaryPalette;

    expect(secondary.shades[0].exports.hex).not.toEqual(primary.shades[0].exports.hex);
    expect(tertiary.shades[0].exports.hex).not.toEqual(primary.shades[0].exports.hex);
  });

  test("paletas neutrales y grises conservan los números y reducen croma", () => {
    const neutral = creator.neutralPalette;
    const gray = creator.grayPalette;

    expect(neutral.shades).toHaveLength(11);
    expect(gray.shades).toHaveLength(11);

    neutral.shades.forEach((shade, index) => {
      const grayShade = gray.shades[index];
      expect(grayShade.number).toBe(shade.number);
      const neutralChroma = shade.color.oklch.c ?? 0;
      const grayChroma = grayShade.color.oklch.c ?? 0;
      expect(grayChroma).toBeLessThanOrEqual(neutralChroma + 1e-6);
    });
  });

  test("la paleta de error se diferencia de la primaria y mantiene 11 tonos", () => {
    const errorPalette = creator.errorPalette;
    expect(errorPalette.shades).toHaveLength(11);
    expect(errorPalette.shades[0].exports.hex).not.toEqual(
      creator.primaryPalette.shades[0].exports.hex,
    );
  });
});
