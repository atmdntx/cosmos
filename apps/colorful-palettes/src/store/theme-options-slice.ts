import type { StateCreator } from "zustand";

import type { ColorfulStore, ThemeOptionsSlice } from "./types";

export const createThemeOptionsSlice: StateCreator<
  ColorfulStore,
  [],
  [],
  ThemeOptionsSlice
> = () => ({
  inputColor: "#34C759",
  colorScheme: "default",
  colorFormat: "oklch",
  useLightDark: true,
});
