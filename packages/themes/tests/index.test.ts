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

test("baseString uses light-dark declarations by default", () => {
  const generator = new ThemeGenerator(BASE_COLOR, { colorFormat: "hex" });
  const baseString = generator.baseString;

  expect(baseString.startsWith(":root")).toBe(true);
  expect(baseString).toMatch(/--color-primary-50:\s*light-dark\(/);
  expect(baseString).toMatch(/--color-primary-50-contrast:\s*light-dark\(/);
  expect(baseString).not.toContain(".dark {");
});

test("baseString emits .dark block when light-dark is disabled", () => {
  const generator = new ThemeGenerator(BASE_COLOR, {
    colorFormat: "hex",
    useLightDark: false,
  });

  const baseString = generator.baseString;
  const blocks = baseString.split("\n\n").filter(Boolean);

  expect(blocks).toHaveLength(2);
  const [rootBlock, darkBlock] = blocks;
  expect(rootBlock.startsWith(":root")).toBe(true);
  expect(darkBlock.startsWith(".dark")).toBe(true);
  expect(rootBlock).toContain("--color-neutral-500:");
  expect(darkBlock).toContain("--color-neutral-500-contrast:");
  expect(baseString).not.toContain("light-dark(");
});
