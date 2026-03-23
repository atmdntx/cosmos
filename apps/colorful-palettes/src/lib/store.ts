import type { ColorScheme } from "@cosmos/colorful";
import type { ColorFormat } from "@cosmos/themes";
import { create } from "zustand";

export interface ColorfulPaletteStore {
  baseColor: string;
  setBaseColor: (baseColor: string) => void;
  colorFormat: ColorFormat;
  setColorFormat: (colorSpace: ColorFormat) => void;
  useLightDark: boolean;
  setUseLightDark: (useLightDark: boolean) => void;
  colorScheme: ColorScheme;
  setColorScheme: (colorScheme: ColorScheme) => void;
}

export const useColorfulStore = create<ColorfulPaletteStore>((set) => ({
  baseColor: "#0091FF",
  setBaseColor: (baseColor) => set({ baseColor }),
  colorFormat: "oklch",
  setColorFormat: (colorFormat) => set({ colorFormat }),
  useLightDark: false,
  setUseLightDark: (useLightDark) => set({ useLightDark }),
  colorScheme: "default",
  setColorScheme: (colorScheme) => set({ colorScheme }),
}));
