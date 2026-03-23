import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "./dropdown-menu";
import { Button } from "./button";

import { useColorfulStore } from "#/lib/store";
import { ChevronsUpDownIcon } from "./chevrons-up-down";
import { useHover } from "react-aria";
import { COLOR_SCHEMES } from "@cosmos/colorful";

export function ColorSchemeSelector() {
  const { colorScheme, setColorScheme } = useColorfulStore();
  const { isHovered, hoverProps } = useHover({});
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground font-semibold">Color Scheme</span>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button {...hoverProps} className="w-full" size="lg" variant="outline" />}
        >
          <div className="w-full text-left capitalize">{colorScheme}</div>
          <ChevronsUpDownIcon animate={isHovered} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value={colorScheme} onValueChange={setColorScheme}>
            {COLOR_SCHEMES.map((colorScheme) => (
              <DropdownMenuRadioItem value={colorScheme} key={colorScheme}>
                <span className="capitalize">{colorScheme}</span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
