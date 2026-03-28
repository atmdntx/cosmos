import { HeadContent, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import Header from "../components/header";

import appCss from "../styles.css?url";
import { TooltipProvider } from "#/components/ui/tooltip";
import { THEME_COLORS, ThemeProvider, useHtmlClass } from "#/components/ui/theme-provider";
import { useColorfulStore } from "#/store/store";
import { useEffect } from "react";
import { getLocale } from "#/paraglide/runtime";
import { m } from "@/paraglide/messages";
import { Toaster } from "#/components/ui/sonner";

export const Route = createRootRouteWithContext()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        name: "theme-color",
        content: THEME_COLORS.light,
        media: "(prefers-color-scheme: light)",
      },
      {
        name: "theme-color",
        content: THEME_COLORS.dark,
        media: "(prefers-color-scheme: dark)",
      },
      {
        title: m.site_title(),
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
    scripts: [
      {
        children: `(function(){try{var t=localStorage.getItem('colorful-palettes-theme')||'system';var v=['light','dark','system'].includes(t)?t:'system';if(v==='system'){var a=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.classList.add(a,'system')}else{document.documentElement.classList.add(v)}}catch(e){var a=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.classList.add(a,'system')}})()`,
      },
    ],
  }),
  shellComponent: ({ children }) => {
    return (
      <ThemeProvider>
        <TooltipProvider>
          <RootDocument>{children}</RootDocument>
        </TooltipProvider>
      </ThemeProvider>
    );
  },
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const htmlClass = useHtmlClass();
  const regenerate = useColorfulStore((state) => state.regenerate);
  useEffect(() => {
    regenerate();
  }, [regenerate]);

  return (
    <html lang={getLocale()} className={htmlClass} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="h-svh relative flex flex-col">
        <Header />
        {children}

        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}
