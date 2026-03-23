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

interface ThemeGeneratorOptions<T> {
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

export class ThemeGenerator<T> {
  #paletteCreator: colorfulPaletteCreator;
  #tokens: ThemeConfig<T>[];
  #colorFormat: ColorFormat;
  #selector: string | undefined;
  #darkSelector: string | undefined;
  #useLightDark: boolean;
  #cache = new Map<PaletteTypes, ColorfulPalette>();
  #resolvedTokens: ResolvedToken[] | undefined;

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

  #getTokenValue(value: ThemeToken): string {
    const shadeValue = value.number;
    const palette = this.#getPalette(value.palette);
    const colorFormat = this.#colorFormat === "hex" ? "srgb" : this.#colorFormat;
    if (shadeValue === 0 || shadeValue === 1000) {
      const blackString = BLACK.to(colorFormat).toString({ format: this.#colorFormat });
      const whiteString = WHITE.to(colorFormat).toString({ format: this.#colorFormat });

      if (shadeValue === 0) {
        return value.useContrast ? blackString : whiteString;
      }
      if (shadeValue === 1000) {
        return value.useContrast ? whiteString : blackString;
      }
    }
    const shade = palette.shades.find((shade) => shade.number === shadeValue);
    return value.useContrast
      ? shade!.contrast.color.to(colorFormat).toString({ format: this.#colorFormat })
      : shade!.color.to(colorFormat).toString({ format: this.#colorFormat });
  }

  #getPalette(type: PaletteTypes): ColorfulPalette {
    if (!this.#cache.has(type)) {
      this.#cache.set(type, this.#resolvedPalette(type));
    }
    return this.#cache.get(type)!;
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
