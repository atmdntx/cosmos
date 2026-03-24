import type { ColorTypes } from "colorjs.io";
import Color from "colorjs.io";

const colorCache = new Map<ColorTypes, Color>();
export function memoColor(inputColor: ColorTypes | Color): Color {
  if (inputColor instanceof Color) return inputColor;
  const key = inputColor;
  if (colorCache.has(key)) return colorCache.get(key)!;
  const color = new Color(inputColor);
  colorCache.set(key, color);
  return color;
}
