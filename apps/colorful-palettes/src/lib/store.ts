import type { ColorScheme } from "@cosmos/colorful";
import type { ColorFormat } from "@cosmos/themes";
import { create, type StoreApi, type UseBoundStore } from "zustand";

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

const colorfulStore = create<ColorfulPaletteStore>((set) => ({
  baseColor: "#0091FF",
  setBaseColor: (baseColor) => set({ baseColor }),
  colorFormat: "oklch",
  setColorFormat: (colorFormat) => set({ colorFormat }),
  useLightDark: false,
  setUseLightDark: (useLightDark) => set({ useLightDark }),
  colorScheme: "default",
  setColorScheme: (colorScheme) => set({ colorScheme }),
}));

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};
export const useColorfulStore = createSelectors(colorfulStore);
