import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "./dropdown-menu";
import { Button } from "./button";

import { ChevronsUpDownIcon } from "./chevrons-up-down";
import { useHover } from "react-aria";
import { COLOR_SCHEMES } from "@cosmos/colorful";
import { useColorfulStore } from "#/store/store";
import { m } from "@/paraglide/messages";

export function ColorSchemeSelector() {
  const colorScheme = useColorfulStore.use.colorScheme();
  const setColorScheme = useColorfulStore.use.setColorScheme();
  const { isHovered, hoverProps } = useHover({});
  return (
    <div className="flex flex-col w-full gap-1">
      <span className="text-xs text-muted-foreground font-semibold">{m.label_color_scheme()}</span>
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
