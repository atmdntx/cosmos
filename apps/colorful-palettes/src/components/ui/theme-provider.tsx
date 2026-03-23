import { createClientOnlyFn, createIsomorphicFn } from "@tanstack/react-start";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as v from "valibot";

export const THEME_COLORS = {
  light: "#f9fafb", // Tailwind gray-50
  dark: "#101828", // Tailwind gray-900
} as const;

const themeKey = "colorful-palettes-theme";
const themeModeSchema = v.picklist(["system", "light", "dark"]);
const resolvedThemeSchema = v.picklist(["light", "dark"]);

type ThemeMode = v.InferOutput<typeof themeModeSchema>;
type ResolvedTheme = v.InferOutput<typeof resolvedThemeSchema>;

const getStoredThemeMode = createIsomorphicFn()
  .server((): ThemeMode => "system")
  .client((): ThemeMode => {
    try {
      const storedTheme = localStorage.getItem(themeKey);
      return v.parse(themeModeSchema, storedTheme);
    } catch (_error) {
      return "system";
    }
  });

const setStoredThemeMode = createClientOnlyFn((theme: ThemeMode) => {
  try {
    const parsedTheme = v.parse(themeModeSchema, theme);
    localStorage.setItem(themeKey, parsedTheme);
  } catch (error) {
    console.warn(error);
  }
});

const getSystemTheme = createIsomorphicFn()
  .server((): ResolvedTheme => "light")
  .client((): ResolvedTheme => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

const updateThemeClass = createClientOnlyFn((themeMode: ThemeMode) => {
  const root = document.documentElement;
  root.classList.remove("light", "dark", "system");
  const newTheme = themeMode === "system" ? getSystemTheme() : themeMode;
  root.classList.add(newTheme);

  if (themeMode === "system") {
    root.classList.add("system");
  }

  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute(
      "content",
      newTheme === "dark" ? THEME_COLORS.dark : THEME_COLORS.light,
    );
  }
});

interface ThemeContextValue {
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  useEffect(() => {
    const storedTheme = getStoredThemeMode();
    setThemeMode(storedTheme);
    const newResolvedTheme = storedTheme === "system" ? getSystemTheme() : storedTheme;
    setResolvedTheme(newResolvedTheme);
    updateThemeClass(storedTheme);
  }, []);

  useEffect(() => {
    if (themeMode !== "system") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      updateThemeClass("system");
      setResolvedTheme(getSystemTheme());
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [themeMode]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeMode(newTheme);
    setStoredThemeMode(newTheme);
    updateThemeClass(newTheme);
    setResolvedTheme(newTheme === "system" ? getSystemTheme() : newTheme);
  };

  return (
    <ThemeContext.Provider value={{ themeMode, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("usetheme must be used within a ThemeProvider");
  }
  return context;
};

const getHtmlClass = createIsomorphicFn()
  .server(() => "")
  .client(() => document.documentElement.className);

function useHtmlClass(): string {
  return getHtmlClass();
}
export { ThemeProvider, useTheme, useHtmlClass };
