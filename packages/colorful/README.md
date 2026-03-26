# @cosmos/colorful

Color palette utilities that turn a single seed color into the full Cosmos theming system. `@cosmos/colorful` figures out role-based palettes, contrast-friendly shades, Tailwind lookups, and performance optimizations so downstream packages (like `@cosmos/themes`) can stay declarative.

## Features

- Builds six role-aware palettes (primary, secondary, tertiary, neutral, gray, error) using predefined Cosmos color schemes.
- Matches the closest Tailwind palette to keep generated colors aligned with familiar shade numbers.
- Generates contrast-checked shades with configurable WCAG 2.1 / APCA strategies.
- Caches heavy computations (memoized colors, palette derivations) to make theme regeneration fast in CLIs and dev servers.
- Ships typed helpers (`ColorfulPalette`, `ColorScheme`, `ColorScale`, etc.) plus `memoColor`, `COLOR_SCHEMES`, and OKLCH-friendly utilities.

## Installation

```bash
vp add @cosmos/colorful
```

> ℹ️ Always prefer `vp` commands over calling pnpm/npm/yarn directly; Vite+ keeps the workspace and lockfile in sync.

## Usage

```ts
import { colorfulPaletteCreator, COLOR_SCHEMES, memoColor } from "@cosmos/colorful";

// Normalize any colorjs.io-compatible input once
const cyan = memoColor("oklch(75% 0.1 215)");

// Instantiate the generator with a color scheme
const palettes = new colorfulPaletteCreator(cyan.color, "expressive", {
  contrastMode: "WCAG21",
});

const primary = palettes.primaryPalette;
const surface = palettes.neutralPalette.shades.find((shade) => shade.number === 100);

console.log(primary.shades[5].color.toString({ format: "oklch" }));
console.log(surface?.contrast.color.toString({ format: "srgb" }));

// Export the scheme metadata if you need to build custom roles
console.table(COLOR_SCHEMES.map((scheme) => scheme.name));
```

### Tailwind alignment

`colorfulPaletteCreator` approximates the closest Tailwind palette and shade before applying Cosmos role transforms. This keeps generated palettes easy to map back to `50…950` shade stops and lets you bridge Cosmos tokens with Tailwind config when needed.

### API surface

- `colorfulPaletteCreator` – class that exposes `primaryPalette`, `secondaryPalette`, `tertiaryPalette`, `neutralPalette`, `grayPalette`, and `errorPalette` getters, each returning `ColorfulPalette` objects with `shades`, `closestShade`, and contrast colors.
- `COLOR_SCHEMES` – catalog of built-in Cosmos schemes (Default, Expressive, Vibrant, etc.) including role transforms.
- `memoColor(input)` – caches `colorjs.io` conversions so repeated palette generations reuse the same instances.
- Type exports (`ColorScheme`, `ColorfulPalette`, `ColorfulShade`, `ContrastType`, …) for authoring custom helpers with strong typing.

## Development

- Install dependencies: `vp install`
- Type check, lint, and test: `vp check` and `vp test`
- Build distributable output: `vp pack`

Before pushing changes, run `vp check` and `vp test` to make sure all palettes and helpers still pass validation.
