import type { StateCreator } from "zustand";

import type { ColorfulStore, ThemeGeneratorSlice } from "./types";

export const createThemeGeneratorSlice: StateCreator<
  ColorfulStore,
  [],
  [],
  ThemeGeneratorSlice
> = () => ({
  colorfulPalettes: null,
  cssString: "",
  tailwindString: "",
  isReady: false,
  primaryVarsString: "",
  secondaryVarsString: "",
  tertiaryVarsString: "",
  neutralVarsString: "",
  grayVarsString: "",
  errorVarsString: "",
});
