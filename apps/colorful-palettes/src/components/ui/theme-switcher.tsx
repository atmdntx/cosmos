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

export function ThemeSwitcher() {
  const { hoverProps, isHovered } = useHover({});
  const { setTheme, themeMode } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            {...hoverProps}
            size="icon"
            variant="ghost"
            data-label={`Current theme: ${themeMode}`}
          >
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
            System
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light">
            <SunIcon />
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <MoonIcon />
            Dark
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
