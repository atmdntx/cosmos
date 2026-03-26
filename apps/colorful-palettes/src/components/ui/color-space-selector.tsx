import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "./dropdown-menu";
import { Button } from "./button";
import { COLOR_FORMATS } from "#/lib/constants";

import { ChevronsUpDownIcon } from "./chevrons-up-down";
import { useHover } from "react-aria";
import { useColorfulStore } from "#/store/store";
import { m } from "@/paraglide/messages";

export function ColorSpaceSelector() {
  const colorFormat = useColorfulStore.use.colorFormat();
  const setColorFormat = useColorfulStore.use.setColorFormat();
  const { isHovered, hoverProps } = useHover({});
  return (
    <div className="flex flex-col gap-1 w-full">
      <span className="text-xs text-muted-foreground font-semibold">{m.label_color_format()}</span>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button {...hoverProps} className="w-full" size="lg" variant="outline" />}
        >
          <div className="w-full text-left uppercase">{colorFormat}</div>
          <ChevronsUpDownIcon animate={isHovered} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value={colorFormat} onValueChange={setColorFormat}>
            {COLOR_FORMATS.map((colorFormat) => (
              <DropdownMenuRadioItem value={colorFormat} key={colorFormat}>
                <span className="uppercase">{colorFormat}</span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
