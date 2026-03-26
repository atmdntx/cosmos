import { useHover } from "react-aria";
import { useTheme } from "./theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import { MoonIcon } from "./moon";
import { SunIcon } from "./sun";
import { SunMoonIcon } from "./sun-moon";
import { m } from "@/paraglide/messages";
import { useIsMobile } from "#/hooks/use-mobile";

export function ThemeSwitcher() {
  const { hoverProps, isHovered } = useHover({});
  const { setTheme, themeMode } = useTheme();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          {themeMode === "dark" ? (
            <MoonIcon data-icon="inline-start" animate={isHovered} />
          ) : themeMode === "light" ? (
            <SunIcon data-icon="inline-start" animate={isHovered} />
          ) : (
            <SunMoonIcon data-icon="inline-start" animate={isHovered} />
          )}
          <span className="md:sr-only">{m.aria_change_theme()}</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
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
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        nativeButton
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
