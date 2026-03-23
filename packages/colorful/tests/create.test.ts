import { describe, expect, test } from "vite-plus/test";
import Color from "colorjs.io";
import { createBasePalette, createShade, createShadeObject } from "../src/create";
import type { ExtendedTailwindPalette } from "../src/types";
import { BLACK, WHITE } from "../src/constants";

describe("create helpers", () => {
  test("createShade respeta croma compartida y modo error", () => {
    const base = new Color("oklch", [0.8, 0.2, 40]);
    const sample = new Color("oklch", [0.5, 0.4, 120]);

    const shade = createShade(sample, base);
    expect(shade.oklch.l).toBeCloseTo(sample.oklch.l ?? 0, 5);
    expect(shade.oklch.c).toBeCloseTo(0.2, 5); // usa el mínimo de ambas cromas
    expect(shade.oklch.h).toBeCloseTo(40, 5); // hereda el matiz base

    const errorShade = createShade(sample, base, "error");
    expect(errorShade.oklch.h).toBeCloseTo(sample.oklch.h ?? 0, 5); // en modo error conserva su matiz original
  });

  test("createShadeObject genera metadatos y usa el fallback de contraste", () => {
    const input = new Color("oklch", [0.55, 0.12, 200]);
    const candidate = new Color("oklch", [0.56, 0.12, 200]);
    const result = createShadeObject(input, 500, [candidate], "APCA");

    expect(result.color).toBeInstanceOf(Color);
    expect(result.contrast.usesFallbackContrast).toBe(true);
    expect(result.contrast.meetsContrast).toBe(false); // ningún candidato supera el umbral APCA
    const fallbackStrings = [
      WHITE.to("oklch").toString({ format: "oklch" }),
      BLACK.to("oklch").toString({ format: "oklch" }),
    ];
    expect(fallbackStrings).toContain(result.contrast.color);
    expect(result.exports.hex).toBe(input.clone().to("srgb").toString({ format: "hex" }));
  });

  test("createBasePalette adapta una paleta completa y respeta el modo/contraste", () => {
    const referencePalette: ExtendedTailwindPalette = {
      name: "demo",
      closestShade: { number: 500, color: "oklch(0.5 0.2 210)", delta: 0 },
      shades: [
        { number: 100, color: "oklch(0.9 0.1 210)", delta: 5 },
        { number: 500, color: "oklch(0.5 0.2 210)", delta: 0 },
      ],
    };

    const base = new Color("oklch", [0.7, 0.22, 40]);
    const palette = createBasePalette(base, referencePalette);
    expect(palette).toHaveLength(2);
    expect(palette[0].color).toBeInstanceOf(Color);
    expect(palette[0].color.oklch.h).toBeCloseTo(40, 5); // sin modo error, fuerza el matiz base

    const errorPalette = createBasePalette(base, referencePalette, {
      mode: "error",
      contrastMode: "WCAG21",
    });
    expect(errorPalette[0].color.oklch.h).toBeCloseTo(210, 5); // modo error mantiene el matiz de la muestra
    const contrastColor = new Color(errorPalette[0].contrast.color);
    const recomputedContrast = Math.abs(errorPalette[0].color.contrast(contrastColor, "WCAG21"));
    expect(recomputedContrast).toBeCloseTo(errorPalette[0].contrast.contrastRatio, 5);
  });
});
