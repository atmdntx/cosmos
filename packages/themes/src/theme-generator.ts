import {
  BLACK,
  colorfulPaletteCreator,
  WHITE,
  type ColorfulPalette,
  type ColorScheme,
  type ColorTypes,
  type PaletteTypes,
} from "@cosmos/colorful";
import type { ColorFormat, ThemeConfig, ThemeToken } from "./types";
import { COLORFUL_THEME } from "./colorful";

const PALETTE_TYPES: PaletteTypes[] = [
  "primary",
  "secondary",
  "tertiary",
  "neutral",
  "gray",
  "error",
];

export interface ThemeGeneratorOptions<T> {
  colorScheme?: ColorScheme;
  colorFormat?: ColorFormat;
  tokens?: ThemeConfig<T>[];
  useLightDark?: boolean;
  selector?: string;
  darkSelector?: string;
}

interface ResolvedToken {
  name: string;
  light: string;
  dark: string;
}

interface ShadeEntry {
  color: string;
  contrast: string;
}

type PaletteShadeMap = Map<number, ShadeEntry>;

export class ThemeGenerator<T> {
  #paletteCreator: colorfulPaletteCreator;
  #tokens: ThemeConfig<T>[];
  #colorFormat: ColorFormat;
  #selector: string | undefined;
  #darkSelector: string | undefined;
  #useLightDark: boolean;

  #paletteCache = new Map<PaletteTypes, ColorfulPalette>();
  #paletteShadeMapCache = new Map<PaletteTypes, PaletteShadeMap>();
  #resolvedTokens: ResolvedToken[] | undefined;
  #specialColorCache: { black: string; white: string } | undefined;

  constructor(inputColor: ColorTypes, options: ThemeGeneratorOptions<T> = {}) {
    const {
      colorScheme = "default",
      colorFormat = "oklch",
      tokens = COLORFUL_THEME as ThemeConfig<T>[],
      useLightDark = true,
      selector,
      darkSelector,
    } = options;
    this.#tokens = tokens;
    this.#colorFormat = colorFormat;
    this.#useLightDark = useLightDark;
    this.#selector = selector;
    this.#darkSelector = darkSelector;
    this.#paletteCreator = new colorfulPaletteCreator(inputColor, colorScheme);
  }

  get cssString(): string {
    const lightSelector = this.#resolveSelector(this.#selector, ":root");
    const darkSelector = this.#resolveSelector(this.#darkSelector, ".dark");
    return this.#buildThemeString(lightSelector, darkSelector);
  }

  get tailwindString(): string {
    const lightSelector = this.#resolveSelector(this.#selector, "@theme");
    const darkSelector = this.#resolveSelector(this.#darkSelector, ".dark");
    return this.#buildThemeString(lightSelector, darkSelector, "color-");
  }

  get baseString(): string {
    const paletteVariables = this.#getPaletteVariables();
    if (this.#useLightDark) {
      const lightDarkLines = paletteVariables.map(({ name, light, dark }) =>
        this.#makeLightDarkString(name, light, dark),
      );
      return this.#formatString(lightDarkLines, ":root");
    }
    const lightLines = paletteVariables.map(({ name, light }) =>
      this.#makeSingleThemeString(name, light),
    );
    const darkLines = paletteVariables.map(({ name, dark }) =>
      this.#makeSingleThemeString(name, dark),
    );
    const lightString = this.#formatString(lightLines, ":root");
    const darkString = this.#formatString(darkLines, ".dark");
    return `${lightString}\n\n${darkString}`;
  }

  #buildThemeString(lightSelector: string, darkSelector: string, namePrefix = ""): string {
    const tokens = this.#getResolvedTokens();
    if (this.#useLightDark) {
      const lightDarkLines = tokens.map(({ name, light, dark }) =>
        this.#makeLightDarkString(`${namePrefix}${name}`, light, dark),
      );
      return this.#formatString(lightDarkLines, lightSelector);
    }
    const lightLines = tokens.map(({ name, light }) =>
      this.#makeSingleThemeString(`${namePrefix}${name}`, light),
    );
    const darkLines = tokens.map(({ name, dark }) =>
      this.#makeSingleThemeString(`${namePrefix}${name}`, dark),
    );
    const lightString = this.#formatString(lightLines, lightSelector);
    const darkString = this.#formatString(darkLines, darkSelector);
    return `${lightString}\n\n${darkString}`;
  }

  #getResolvedTokens(): ResolvedToken[] {
    if (this.#resolvedTokens) {
      return this.#resolvedTokens;
    }
    this.#resolvedTokens = this.#tokens.map((token) => ({
      name: String(token.key),
      light: this.#getTokenValue(token.light),
      dark: this.#getTokenValue(token.dark),
    }));
    return this.#resolvedTokens;
  }

  #formatString(value: string[], selector: string): string {
    const lines = value.map((line) => (line.length ? `\t${line}` : "")).join("\n");
    return `${selector} {\n${lines}\n}`;
  }

  #resolveSelector(selector: string | undefined, fallback: string): string {
    return selector ?? fallback;
  }

  #makeLightDarkString(name: string, lightValue: string, darkValue: string) {
    return `--${name}: light-dark(${lightValue}, ${darkValue});`;
  }

  #makeSingleThemeString(name: string, value: string) {
    return `--${name}: ${value};`;
  }

  #getPaletteVariables(): ResolvedToken[] {
    const variables: ResolvedToken[] = [];
    for (const paletteType of PALETTE_TYPES) {
      const shadeEntries = Array.from(this.#getPaletteShadeMap(paletteType).entries()).sort(
        (a, b) => a[0] - b[0],
      );

      for (const [shadeNumber, { color, contrast }] of shadeEntries) {
        const baseName = `color-${paletteType}-${shadeNumber}`;
        variables.push({
          name: baseName,
          light: color,
          dark: color,
        });
        variables.push({
          name: `${baseName}-contrast`,
          light: contrast,
          dark: contrast,
        });
      }
    }
    return variables;
  }

  #getTokenValue(value: ThemeToken): string {
    const { black, white } = this.#getSpecialColors();
    if (value.number === 0) {
      return value.useContrast ? black : white;
    }
    if (value.number === 1000) {
      return value.useContrast ? white : black;
    }

    const shadeMap = this.#getPaletteShadeMap(value.palette);
    const shade = shadeMap.get(value.number);

    if (!shade) {
      throw new Error(`Shade ${value.number} not found in palette "${value.palette}"`);
    }
    return value.useContrast ? shade.contrast : shade.color;
  }

  #getSpecialColors() {
    if (this.#specialColorCache) return this.#specialColorCache;

    const colorFormat = this.#colorFormat === "hex" ? "srgb" : this.#colorFormat;

    this.#specialColorCache = {
      black: BLACK.to(colorFormat).toString({ format: this.#colorFormat }),
      white: WHITE.to(colorFormat).toString({ format: this.#colorFormat }),
    };
    return this.#specialColorCache;
  }

  #getPaletteShadeMap(type: PaletteTypes): PaletteShadeMap {
    const cached = this.#paletteShadeMapCache.get(type);
    if (cached) return cached;

    const palette = this.#getPalette(type);
    const colorFormat = this.#colorFormat === "hex" ? "srgb" : this.#colorFormat;

    const map: PaletteShadeMap = new Map();

    for (const shade of palette.shades) {
      map.set(shade.number, {
        color: shade.color.to(colorFormat).toString({ format: this.#colorFormat }),
        contrast: shade.contrast.color.to(colorFormat).toString({ format: this.#colorFormat }),
      });
    }
    this.#paletteShadeMapCache.set(type, map);
    return map;
  }

  get primaryPalette() {
    return this.#getPalette("primary");
  }
  get secondaryPalette() {
    return this.#getPalette("secondary");
  }

  get tertiaryPalette() {
    return this.#getPalette("tertiary");
  }

  get neutralPalette() {
    return this.#getPalette("neutral");
  }

  get grayPalette() {
    return this.#getPalette("gray");
  }

  get errorPalette() {
    return this.#getPalette("error");
  }

  get colorfulPalettes() {
    return {
      primaryPalette: this.primaryPalette,
      secondaryPalette: this.secondaryPalette,
      tertiaryPalette: this.tertiaryPalette,
      neutralPalette: this.neutralPalette,
      grayPalette: this.grayPalette,
      errorPalette: this.errorPalette,
    };
  }

  #getPalette(type: PaletteTypes): ColorfulPalette {
    const cached = this.#paletteCache.get(type);
    if (cached) return cached;
    const resolved = this.#resolvedPalette(type);
    this.#paletteCache.set(type, resolved);
    return resolved;
  }

  #resolvedPalette(type: PaletteTypes): ColorfulPalette {
    switch (type) {
      case "primary":
        return this.#paletteCreator.primaryPalette;
      case "secondary":
        return this.#paletteCreator.secondaryPalette;
      case "tertiary":
        return this.#paletteCreator.tertiaryPalette;
      case "neutral":
        return this.#paletteCreator.neutralPalette;
      case "gray":
        return this.#paletteCreator.grayPalette;
      case "error":
        return this.#paletteCreator.errorPalette;
      default:
        throw new Error("Invalid palette type", type);
    }
  }
}
