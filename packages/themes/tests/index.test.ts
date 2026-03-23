import { expect, test } from "vite-plus/test";
import { ThemeGenerator } from "../src/theme-generator";
import type { ThemeConfig } from "../src/types";
import { getValue } from "../src/core";

const BASE_COLOR = "#ff6b6b";
const TOKENS: ThemeConfig<"primary">[] = [
  {
    key: "primary",
    light: getValue("primary", 50),
    dark: getValue("primary", 900),
  },
];

test("produces light-dark declarations inside :root by default", () => {
  const generator = new ThemeGenerator(BASE_COLOR, {
    tokens: TOKENS,
    colorFormat: "hex",
  });

  const css = generator.cssString;

  expect(css.startsWith(":root")).toBe(true);
  expect(css).toContain("--primary: light-dark(");
  expect(css).not.toContain(".dark {");
});

test("wraps dark-only tokens in .dark when useLightDark is false for Tailwind", () => {
  const lightDarkGenerator = new ThemeGenerator(BASE_COLOR, {
    tokens: TOKENS,
    colorFormat: "hex",
  });
  const lightDarkCss = lightDarkGenerator.cssString;
  const colorMatch = lightDarkCss.match(/light-dark\(([^,]+),\s*([^)]+)\)/);
  expect(colorMatch).not.toBeNull();
  const lightValue = colorMatch![1].trim();
  const darkValue = colorMatch![2].trim();

  const generator = new ThemeGenerator(BASE_COLOR, {
    tokens: TOKENS,
    colorFormat: "hex",
    useLightDark: false,
  });

  const css = generator.tailwindString;
  const [lightBlock, darkBlock] = css.split("\n\n").filter(Boolean);

  expect(lightBlock.startsWith("@theme")).toBe(true);
  expect(lightBlock).toContain(`--color-primary: ${lightValue};`);
  expect(darkBlock.startsWith(".dark")).toBe(true);
  expect(darkBlock).toContain(`--color-primary: ${darkValue};`);
  expect(css).not.toContain("light-dark(");
});
