import { describe, expect, test } from "vite-plus/test";
import Color from "colorjs.io";
import { applyRoleTransform, solvePropertyTransform } from "../src/role-transforms";
import type { RoleTransform } from "../src/types";

describe("role-transforms", () => {
  test("applyRoleTransform modifica hue/lightness/chroma con los límites adecuados", () => {
    const base = new Color("oklch", [0.4, 0.2, 350]);
    const transformed = applyRoleTransform(base, {
      hue: { type: "shift", value: 30 },
      lightness: { type: "shift", value: 0.7 },
      chroma: { type: "factor", value: 0.5 },
    });

    const { l, c, h } = transformed.oklch;
    expect(l).toBeCloseTo(1, 5); // se satura en 1
    expect(c).toBeCloseTo(0.1, 5); // 0.2 * 0.5
    expect(h).toBeCloseTo(20, 5); // (350 + 30) % 360
  });

  test("solvePropertyTransform respalda los modos set/shift/factor", () => {
    const hueRole: RoleTransform = { hue: { type: "shift", value: 20 } };
    expect(solvePropertyTransform(350, hueRole, "hue")).toBeCloseTo(10, 5);

    const lightRole: RoleTransform = { lightness: { type: "set", value: 3 } };
    expect(solvePropertyTransform(0.25, lightRole, "lightness")).toBe(1);

    const chromaRole: RoleTransform = { chroma: { type: "factor", value: -1 } };
    expect(solvePropertyTransform(0.3, chromaRole, "chroma")).toBe(0);
  });
});
