import type Color from "colorjs.io";
import type { ColorTypes } from "colorjs.io";
export type { ColorTypes };
export type PaletteTypes = "primary" | "secondary" | "tertiary" | "neutral" | "gray" | "error";
export type ColorScheme = "default" | "gradient" | "triad" | "analogous" | "split" | "pop";

export enum TailwindColorNames {
  Red = "red",
  Orange = "orange",
  Amber = "amber",
  Yellow = "yellow",
  Lime = "lime",
  Green = "green",
  Emerald = "emerald",
  Teal = "teal",
  Cyan = "cyan",
  Sky = "sky",
  Blue = "blue",
  Indigo = "indigo",
  Violet = "violet",
  Purple = "purple",
  Fuchsia = "fuchsia",
  Pink = "pink",
  Rose = "rose",
  Slate = "slate",
  Gray = "gray",
  Zinc = "zinc",
  Neutral = "neutral",
  Stone = "stone",
  Taupe = "taupe",
  Mauve = "mauve",
  Mist = "mist",
  Olive = "olive",
}
export type TailwindColorScale = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;
export type ColorScale = TailwindColorScale | 0 | 1000;
export type TailwindColors = Record<TailwindColorNames, Record<TailwindColorScale, ColorTypes>>;
export type TailwindNeutralColors = Pick<
  TailwindColors,
  | TailwindColorNames.Slate
  | TailwindColorNames.Gray
  | TailwindColorNames.Zinc
  | TailwindColorNames.Neutral
  | TailwindColorNames.Stone
  | TailwindColorNames.Taupe
  | TailwindColorNames.Mauve
  | TailwindColorNames.Mist
  | TailwindColorNames.Olive
>;
export type TailwindErrorColors = Pick<
  TailwindColors,
  TailwindColorNames.Red | TailwindColorNames.Rose
>;

export interface TailwindShade {
  number: TailwindColorScale;
  color: ColorTypes;
}

export interface ExtendedTailwindShade extends TailwindShade {
  delta: number;
}

export interface ColorfulShadeContrast {
  color: Color;
  contrastRatio: number;
  meetsContrast: boolean;
  usesFallbackContrast: boolean;
}

type ColorFormat = "hex" | "hsl" | "oklch" | "p3" | "srgb";
export type ColorfulShadeExports = Record<ColorFormat, string>;

export interface ColorfulShade {
  number: TailwindColorScale;
  color: Color;
  contrast: ColorfulShadeContrast;
  exports: ColorfulShadeExports;
}

export interface TailwindPalette {
  name: string;
  shades: TailwindShade[];
}

export interface ExtendedTailwindPalette extends TailwindPalette {
  shades: ExtendedTailwindShade[];
  closestShade: ExtendedTailwindShade;
}

export interface ColorfulPalette {
  name: string;
  shades: ColorfulShade[];
}

export type ContrastType = "APCA" | "WCAG21";

export type ChannelType = "set" | "shift" | "delta" | "factor";

export interface ChannelTransform {
  type: ChannelType;
  value: number;
}

export interface RoleTransform {
  hue?: ChannelTransform;
  lightness?: ChannelTransform;
  chroma?: ChannelTransform;
}

export type RoleMap = Record<PaletteTypes, RoleTransform>;

export interface ColorfulColorScheme {
  key: ColorScheme;
  name: string;
  roles: Record<PaletteTypes, RoleTransform>;
}

export type Mode = "error" | "neutral";
