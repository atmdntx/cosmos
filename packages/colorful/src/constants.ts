import Color from "colorjs.io";
import type { ColorScheme } from "./types";

export const MIN_APCA_CONTRAST = 80;
export const MIN_WCAG_CONTRAST = 5;
export const WHITE = new Color("#ffffff");
export const BLACK = new Color("#000000");
export const COLOR_SCHEMES: ColorScheme[] = [
  "default",
  "gradient",
  "triad",
  "analogous",
  "split",
  "pop",
];
