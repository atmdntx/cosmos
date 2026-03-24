import type { ColorScheme } from "@cosmos/colorful";
import { themeGenerator, type ColorFormat } from "@cosmos/themes";
import type { StateCreator } from "zustand";
import type { ColorfulStore, ThemeSlice } from "./types";

function buildTheme(options: {
  inputColor: string;
  colorScheme: ColorScheme;
  colorFormat: ColorFormat;
  useLightDark: boolean;
  selector?: string;
  darkSelector?: string;
}) {
  const { inputColor } = options;
  const generator = new themeGenerator(inputColor, { ...options });

  return {
    palettes: generator.colorfulPalettes,
    cssString: generator.cssString,
    tailwindString: generator.tailwindString,
  };
}

export const createThemeSlice: StateCreator<ColorfulStore, [], [], ThemeSlice> = (set, get) => ({
  regenerate: () => {
    const state = get();

    const result = buildTheme({
      inputColor: state.inputColor,
      colorScheme: state.colorScheme,
      colorFormat: state.colorFormat,
      useLightDark: state.useLightDark,
      selector: state.selector,
      darkSelector: state.darkSelector,
    });

    set({
      colorfulPalettes: result.palettes,
      cssString: result.cssString,
      tailwindString: result.tailwindString,
      isReady: true,
    });
  },

  setInputColor: (inputColor) => {
    set({ inputColor });
    get().regenerate();
  },

  setColorScheme: (colorScheme) => {
    set({ colorScheme });
    get().regenerate();
  },

  setColorFormat: (colorFormat) => {
    set({ colorFormat });
    get().regenerate();
  },

  setUseLightDark: (useLightDark) => {
    set({ useLightDark });
    get().regenerate();
  },

  setSelector: (selector) => {
    set({ selector });
    get().regenerate();
  },

  setDarkSelector: (darkSelector) => {
    set({ darkSelector });
    get().regenerate();
  },
});
