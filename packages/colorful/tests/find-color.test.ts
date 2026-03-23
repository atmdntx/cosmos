import { describe, expect, test } from "vite-plus/test";
import Color from "colorjs.io";
import { findColorName } from "../src/find-color";

describe("find-color", () => {
  test("devuelve nombres CSS conocidos para hex comunes", () => {
    expect(findColorName(new Color("#ff0000"))).toBe("red");
    expect(findColorName(new Color("#000000"))).toBe("black");
  });

  test("acepta objetos Color arbitrarios", () => {
    const teal = new Color("oklch", [0.65, 0.08, 190]);
    const name = findColorName(teal);
    expect(typeof name).toBe("string");
    expect(name?.length).toBeGreaterThan(0);
  });
});
