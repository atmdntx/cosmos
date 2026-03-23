import { describe, expect, test } from "vite-plus/test";
import { clamp, getElementByKey, lerp, pickColors } from "../src/utils";
import { TAILWIND_COLORS } from "../src/tailwind-palettes";
import { TailwindColorNames } from "../src/types";

describe("Utils", () => {
  describe("clamp", () => {
    test("limita valores por arriba y por abajo", () => {
      expect(clamp(150, 0, 100)).toBe(100);
      expect(clamp(-20, 0, 100)).toBe(0);
    });

    test("usa 0 y 100 como rango por defecto", () => {
      expect(clamp(50)).toBe(50);
      expect(clamp(150)).toBe(100);
      expect(clamp(-1)).toBe(0);
    });
  });

  describe("lerp", () => {
    test("interpolates linealmente dentro del rango", () => {
      expect(lerp(0, 10, 20)).toBe(10);
      expect(lerp(0.5, 10, 20)).toBe(15);
      expect(lerp(1, 10, 20)).toBe(20);
    });

    test("normaliza `n` antes de interpolar", () => {
      expect(lerp(-10, 0, 100)).toBe(0);
      expect(lerp(10, 0, 100)).toBe(100);
    });
  });

  describe("pickColors", () => {
    test("should return the selected color from our TAILWIND_COLORS", () => {
      const pickedColor = pickColors(TAILWIND_COLORS, [TailwindColorNames.Slate]);
      expect(pickedColor).toEqual({
        slate: {
          50: "oklch(98.4% 0.003 247.858)",
          100: "oklch(96.8% 0.007 247.896)",
          200: "oklch(92.9% 0.013 255.508)",
          300: "oklch(86.9% 0.022 252.894)",
          400: "oklch(70.4% 0.04 256.788)",
          500: "oklch(55.4% 0.046 257.417)",
          600: "oklch(44.6% 0.043 257.281)",
          700: "oklch(37.2% 0.044 257.287)",
          800: "oklch(27.9% 0.041 260.031)",
          900: "oklch(20.8% 0.042 265.755)",
          950: "oklch(12.9% 0.042 264.695)",
        },
      });
    });
  });

  describe("getElementByKey", () => {
    test("devuelve el valor cuando la llave existe", () => {
      const obj = { foo: 1, bar: 2 };
      expect(getElementByKey("foo", obj)).toBe(1);
    });

    test("retorna undefined cuando la llave falta", () => {
      expect(getElementByKey("baz", { foo: 1 })).toBeUndefined();
    });
  });
});
