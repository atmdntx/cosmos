import type { StateCreator } from "zustand";
import type { ColorfulStore, ThemeStringSlice } from "./types";
import type { ColorfulPalette, PaletteTypes } from "@cosmos/colorful";
import type { ColorFormat } from "@cosmos/themes";

function buildColorString(
  palette: ColorfulPalette | undefined,
  name: PaletteTypes,
  colorFormat: ColorFormat,
) {
  if (!palette) return "";
  const lines = palette.shades.map(
    (shade) => `--color-${name}-${shade.number}: ${shade.exports[colorFormat]};`,
  );

  return lines.join("\n");
}

const EMPTY_STRINGS = {
  primaryString: "",
  secondaryString: "",
  tertiaryString: "",
  errorString: "",
  neutralString: "",
  grayString: "",
};

export const createThemeStringSlice: StateCreator<ColorfulStore, [], [], ThemeStringSlice> = (
  set,
  get,
) => ({
  ...EMPTY_STRINGS,
  buildStrings: () => {
    const state = get();
    const palettes = state.colorfulPalettes;

    if (!palettes) {
      set(EMPTY_STRINGS);
      return;
    }

    const primaryString = buildColorString(palettes.primaryPalette, "primary", state.colorFormat);
    const secondaryString = buildColorString(
      palettes.secondaryPalette,
      "secondary",
      state.colorFormat,
    );
    const tertiaryString = buildColorString(
      palettes.tertiaryPalette,
      "tertiary",
      state.colorFormat,
    );
    const errorString = buildColorString(palettes.errorPalette, "error", state.colorFormat);
    const neutralString = buildColorString(palettes.neutralPalette, "neutral", state.colorFormat);
    const grayString = buildColorString(palettes.grayPalette, "gray", state.colorFormat);

    set({
      primaryString,
      secondaryString,
      tertiaryString,
      errorString,
      neutralString,
      grayString,
    });
  },
  resetStrings: () => {
    set(EMPTY_STRINGS);
  },
});
