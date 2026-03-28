import type { ColorfulColorScheme, ColorScheme, PaletteTypes, RoleMap } from "./types";

const BASE_ROLE_TRANSFORMS: RoleMap = {
  primary: {},
  secondary: {
    hue: { type: "shift", value: 28 },
    lightness: { type: "shift", value: 0.08 },
  },
  tertiary: {
    hue: { type: "shift", value: -90 },
    lightness: { type: "shift", value: -0.05 },
  },
  neutral: {
    chroma: { type: "factor", value: 0.1 },
    lightness: { type: "shift", value: 0.05 },
  },
  gray: {
    chroma: { type: "factor", value: 0.1 },
    lightness: { type: "factor", value: 0.92 },
  },
  error: {
    hue: { type: "set", value: 28 },
    chroma: { type: "set", value: 0.18 },
    lightness: { type: "factor", value: 0.9 },
  },
};

type ColorSchemes = {
  name: string;
  overrides?: Partial<RoleMap>;
};

const COLOR_SCHEMES: Record<ColorScheme, ColorSchemes> = {
  default: {
    name: "Default",
    overrides: {
      secondary: {
        hue: { type: "shift", value: 24 },
      },
      tertiary: {
        hue: { type: "shift", value: 84 },
      },
    },
  },
  gradient: {
    name: "Gradient",
    overrides: {
      secondary: {
        hue: {
          type: "shift",
          value: 36,
        },
      },
      tertiary: {
        hue: { type: "shift", value: 72 },
        lightness: { type: "shift", value: 0.02 },
      },
    },
  },
  triad: {
    name: "Triad",
    overrides: {
      secondary: {
        hue: { type: "shift", value: 120 },
      },
      tertiary: {
        hue: { type: "shift", value: -120 },
      },
      neutral: {
        hue: { type: "shift", value: 110 },
        chroma: { type: "factor", value: 0.2 },
      },
    },
  },
  analogous: {
    name: "Analogous",
    overrides: {
      secondary: {
        hue: { type: "shift", value: 32 },
        lightness: { type: "shift", value: 0.04 },
      },
      tertiary: {
        hue: { type: "shift", value: -28 },
        lightness: { type: "shift", value: -0.03 },
      },
    },
  },
  split: {
    name: "Split Complementary",
    overrides: {
      secondary: {
        hue: { type: "shift", value: 150 },
        lightness: { type: "shift", value: 0.02 },
      },
      tertiary: {
        hue: { type: "shift", value: -150 },
        lightness: { type: "shift", value: -0.02 },
      },
      neutral: {
        hue: { type: "shift", value: 150 },
      },
    },
  },
  pop: {
    name: "Pop",
    overrides: {
      primary: {
        chroma: { type: "factor", value: 1.25 },
      },
      secondary: {
        hue: { type: "shift", value: 155 },
        chroma: { type: "factor", value: 1.25 },
      },
      tertiary: {
        hue: { type: "shift", value: -85 },
        chroma: { type: "factor", value: 1.25 },
      },
      neutral: {
        chroma: { type: "factor", value: 1.1 },
      },
      gray: {
        chroma: { type: "factor", value: 1.1 },
      },
      error: {
        chroma: { type: "factor", value: 1.25 },
      },
    },
  },
  asymmetric: {
    name: "Asymmetric",
    overrides: {
      primary: {
        chroma: {
          type: "factor",
          value: 1.5,
        },
      },
      secondary: {
        hue: {
          type: "shift",
          value: 210,
        },
        chroma: {
          type: "factor",
          value: 1.5,
        },
      },
      tertiary: {
        hue: {
          type: "shift",
          value: -45,
        },
        chroma: {
          type: "factor",
          value: 1.5,
        },
      },
      error: {
        chroma: {
          type: "factor",
          value: 1.25,
        },
      },
      neutral: {
        hue: {
          type: "shift",
          value: 210,
        },
        chroma: {
          type: "factor",
          value: 0.9,
        },
      },
      gray: {
        chroma: {
          type: "factor",
          value: 0.5,
        },
      },
    },
  },
};

function mergeRoleTransforms(base: RoleMap, overrides: Partial<RoleMap> = {}) {
  const roles = {} as RoleMap;
  (Object.keys(base) as PaletteTypes[]).forEach((role) => {
    roles[role] = {
      ...base[role],
      ...overrides[role],
    };
  });
  return roles;
}

export const COLORFUL_COLOR_SCHEMES: Record<ColorScheme, ColorfulColorScheme> = Object.entries(
  COLOR_SCHEMES,
).reduce(
  (acc, [key, config]) => {
    const colorScheme = key as ColorScheme;
    acc[colorScheme] = {
      key: colorScheme,
      name: config.name,
      roles: mergeRoleTransforms(BASE_ROLE_TRANSFORMS, config.overrides),
    };
    return acc;
  },
  {} as Record<ColorScheme, ColorfulColorScheme>,
);
