import type { ColorfulStore, Preset, ThemePresetSlice } from "#/store/types";
import type { StateCreator } from "zustand";
import * as lz from "lz-string";

export function _encodePreset(preset: Preset) {
  const json = JSON.stringify(preset);
  return btoa(lz.compressToEncodedURIComponent(json));
}

export function _decodePreset(encoded: string): Preset {
  const json = lz.decompressFromEncodedURIComponent(atob(encoded));
  return JSON.parse(json);
}

export function buildShareableUrl(preset?: string): string {
  const normalizedPreset = typeof preset === "string" ? preset.trim() : "";

  if (typeof window === "undefined" || !window.location) {
    // SSR-safe fallback; client will recompute once hydrated
    return "";
  }

  const url = new URL(window.location.href);
  if (normalizedPreset.length > 0) {
    url.searchParams.set("preset", normalizedPreset);
  } else {
    url.searchParams.delete("preset");
  }
  url.hash = "";

  return url.toString();
}

export const createThemePresetSlice: StateCreator<ColorfulStore, [], [], ThemePresetSlice> = (
  set,
  get,
) => ({
  shareableUrl: "",
  encodePreset: () => {
    if (typeof window === "undefined" || !window.location) return;

    const state = get();
    const preset = {
      inputColor: state.inputColor,
      colorScheme: state.colorScheme,
      colorFormat: state.colorFormat,
      useLightDark: state.useLightDark,
      selector: state.selector,
      darkSelector: state.darkSelector,
    };
    const nextUrl = buildShareableUrl(_encodePreset(preset));

    if (state.shareableUrl === nextUrl) {
      return;
    }

    set({
      shareableUrl: nextUrl,
    });
  },
  decodePreset: (preset: string) => {
    const state = get();
    const decodedPreset = _decodePreset(preset);
    const { inputColor, colorFormat, colorScheme, useLightDark, darkSelector, selector } =
      decodedPreset;
    set({
      inputColor,
      colorFormat,
      colorScheme,
      useLightDark,
      darkSelector,
      selector,
    });

    state.regenerate();
  },
});
