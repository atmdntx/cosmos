import type { ColorScale, PaletteTypes } from "@cosmos/colorful";

export function getValue(
  palette: PaletteTypes,
  number: ColorScale,
  options: { useContrast?: boolean } = {},
) {
  return { palette, number, useContrast: options.useContrast };
}
