import ShikiHightlighter, { type ShikiHighlighterProps } from "react-shiki/web";
import { CopyButton } from "./copybutton";

export function CodeBlock({
  code,
  language = "css",
  theme = {
    light: "catppuccin-latte",
    dark: "catppuccin-mocha",
  },
  defaultColor = "light-dark()",
  ...props
}: Partial<ShikiHighlighterProps> & { code: string }) {
  const trimmedCode = code.trim();
  return (
    <div className="rounded-md relative overflow-hidden">
      <CopyButton copyContent={trimmedCode} className="absolute right-3 top-3 z-10" />
      <ShikiHightlighter
        as="div"
        style={{ tabSize: 2 }}
        language={language}
        theme={theme}
        defaultColor={defaultColor}
        className="max-h-128 overflow-auto no-scrollbar overscroll-none"
        showLanguage={false}
        {...props}
      >
        {trimmedCode}
      </ShikiHightlighter>
    </div>
  );
}
