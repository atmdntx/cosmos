import { useHover } from "react-aria";
import { useTheme } from "./theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import { MoonIcon } from "./moon";
import { SunIcon } from "./sun";
import { SunMoonIcon } from "./sun-moon";
import { m } from "@/paraglide/messages";

export function ThemeSwitcher() {
  const { hoverProps, isHovered } = useHover({});
  const { setTheme, themeMode } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button {...hoverProps} size="icon" variant="ghost">
            <span className="sr-only">{m.aria_change_theme()}</span>
            {themeMode === "dark" ? (
              <MoonIcon animate={isHovered} />
            ) : themeMode === "light" ? (
              <SunIcon animate={isHovered} />
            ) : (
              <SunMoonIcon animate={isHovered} />
            )}
          </Button>
        }
      />
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={themeMode} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="system">
            <SunMoonIcon />
            {m.theme_system()}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light">
            <SunIcon />
            {m.theme_light()}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <MoonIcon />
            {m.theme_dark()}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
