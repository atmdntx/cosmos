import type { ColorfulPalette, ColorScheme } from "@cosmos/colorful";
import type { ColorFormat } from "@cosmos/themes";

export interface ColorfulPalettesMap {
  primaryPalette: ColorfulPalette;
  secondaryPalette: ColorfulPalette;
  tertiaryPalette: ColorfulPalette;
  errorPalette: ColorfulPalette;
  neutralPalette: ColorfulPalette;
  grayPalette: ColorfulPalette;
}

export interface ThemeGeneratorSlice {
  colorfulPalettes: ColorfulPalettesMap | null;
  cssString: string;
  tailwindString: string;
  isReady: boolean;
}

export interface ThemeOptionsSlice {
  inputColor: string;
  colorScheme: ColorScheme;
  colorFormat: ColorFormat;
  useLightDark: boolean;
  selector?: string;
  darkSelector?: string;
}

export interface ThemeStringSlice {
  primaryString: string;
  secondaryString: string;
  tertiaryString: string;
  errorString: string;
  neutralString: string;
  grayString: string;
  buildStrings: () => void;
}

export interface ThemeSlice {
  regenerate: () => void;
  setInputColor: (inputColor: string) => void;
  setColorScheme: (colorScheme: ColorScheme) => void;
  setColorFormat: (colorFormat: ColorFormat) => void;
  setUseLightDark: (useLightDark: boolean) => void;
  setSelector: (selector?: string) => void;
  setDarkSelector: (darkSelector?: string) => void;
}

export type Preset = ThemeOptionsSlice;

export interface ThemePresetSlice {
  shareableUrl: string;
  encodePreset: () => void;
  decodePreset: (preset: string) => void;
}

export type ColorfulStore = ThemeOptionsSlice &
  ThemeGeneratorSlice &
  ThemeSlice &
  ThemeStringSlice &
  ThemePresetSlice;

export type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;
