import type { ColorScale, PaletteTypes } from "@cosmos/colorful";

export interface ThemeToken {
  palette: PaletteTypes;
  number: ColorScale;
  useContrast?: boolean;
}

export interface ThemeConfig<T> {
  key: T;
  light: ThemeToken;
  dark: ThemeToken;
}

export type ColorFormat = "hex" | "hsl" | "oklch" | "p3" | "srgb";
