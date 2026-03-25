"use client";
import { create, type StoreApi, type UseBoundStore } from "zustand";
import { createThemeGeneratorSlice } from "./theme-generator-slice";
import { createThemeOptionsSlice } from "./theme-options-slice";
import { createThemeSlice } from "./theme-slice";
import type { ColorfulStore, WithSelectors } from "./types";
import { createThemeStringSlice } from "./theme-string-slice";
import { createThemePresetSlice } from "./theme-preset-slice";

const useColorfulStoreBase = create<ColorfulStore>()((...a) => ({
  ...createThemeOptionsSlice(...a),
  ...createThemeGeneratorSlice(...a),
  ...createThemeSlice(...a),
  ...createThemeStringSlice(...a),
  ...createThemePresetSlice(...a),
}));

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

export const useColorfulStore = createSelectors(useColorfulStoreBase);
