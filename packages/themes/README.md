# @cosmos/themes

Theme token generator for Cosmos applications. Given a single seed color, `@cosmos/themes` produces coherent light/dark palettes, resolves them into CSS custom properties (or Tailwind tokens), and exposes helpers for integrating the same values inside design systems, docs sites, or marketing pages.

## Features

- Builds the six standard Cosmos palettes (primary, secondary, tertiary, neutral, gray, error) from any input color using `@cosmos/colorful`.
- Emits ready-to-use `--color-name` custom properties with optional `light-dark()` values so you can opt into automatic media-query switching or fully separated themes.
- Provides a Tailwind-friendly string builder that prefixes every token with `color-` for seamless use inside design tokens or `@theme` blocks.
- Ships with the `COLORFUL_THEME` config, which covers surface/background/container/on-\* tokens that map to Cosmos UI guidelines; the config is replaceable for custom systems.
- Supports multiple color formats (`oklch`, `hsl`, `p3`, `srgb`, `hex`) and selector overrides for scoping.

## Installation

```bash
vp add @cosmos/themes
```

> ℹ️ Always use `vp` instead of calling your package manager directly. `vp add` respects the workspace settings and lockfile.

## Usage

```ts
import { themeGenerator } from "@cosmos/themes";

const generator = new themeGenerator("#6550ff", {
  colorScheme: "default",
  colorFormat: "oklch",
  selector: ":root",
  darkSelector: ".dark",
});

// 1) Inject tokens as CSS custom properties
const css = generator.cssString;

// 2) Or feed them to Tailwind via @theme blocks
const tailwind = generator.tailwindString;

// 3) Access the underlying palettes if you need individual shades
const { primaryPalette } = generator.colorfulPalettes;
```

### Custom tokens

The generator accepts a `tokens` array describing the light/dark reference for every key you want to expose. Each entry maps to a palette (`primary`, `secondary`, `tertiary`, `neutral`, `gray`, `error`), a shade number (0–1000), and an optional `useContrast` flag that pulls the contrast color from the palette.

```ts
import { themeGenerator, type ThemeConfig } from "@cosmos/themes";

const TOKENS: ThemeConfig<string>[] = [
  {
    key: "card",
    light: { palette: "neutral", number: 100 },
    dark: { palette: "neutral", number: 800 },
  },
  {
    key: "on-card",
    light: { palette: "neutral", number: 100, useContrast: true },
    dark: { palette: "neutral", number: 800, useContrast: true },
  },
];

const generator = new themeGenerator("#ff6b6b", { tokens: TOKENS, useLightDark: false });
```

### API surface

- `new themeGenerator(inputColor, options)` – `inputColor` accepts anything understood by `@cosmos/colorful` (hex string, `colorjs.io` color, etc.).
- `options.colorScheme` – choose presets defined in `@cosmos/colorful` (defaults to `"default"`).
- `options.colorFormat` – control serialized output; `"hex"` maps to SRGB before formatting to maintain accuracy.
- `options.selector` / `options.darkSelector` – override `:root`/`.dark` when generating CSS or Tailwind strings.
- `options.useLightDark` – when `true`, uses `light-dark()` declarations; when `false`, emits separate light/dark blocks.
- `cssString` / `tailwindString` – formatted output strings ready to inject in `<style>` tags, CSS files, or Tailwind `@theme` directives.
- `primaryPalette`, `secondaryPalette`, …, `errorPalette` – direct palette accessors.

## Development

- Install dependencies: `vp install`
- Type check, lint, and test: `vp check` and `vp test`
- Build distributable output: `vp pack`

Before opening a PR, run `vp check` and `vp test` to validate the package end-to-end.
