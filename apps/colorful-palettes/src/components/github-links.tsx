import { useHover } from "react-aria";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { GithubIcon } from "./ui/github";
import { TerminalIcon } from "./ui/terminal";
import { m } from "@/paraglide/messages";

export function GithubLinks() {
  const { isHovered, hoverProps } = useHover({});

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button {...hoverProps} variant="ghost" size="icon" aria-label={m.aria_get_code()}>
            <GithubIcon animate={isHovered} />
          </Button>
        }
      />
      <DropdownMenuContent className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{m.github_section_packages()}</DropdownMenuLabel>
          <DropdownMenuItem
            render={
              <a
                href="https://github.com/atmdntx/cosmos/tree/main/packages/colorful#readme"
                target="_blank"
                rel="noreferrer noopener"
              />
            }
            className="font-mono"
          >
            <TerminalIcon data-icon="inline-start" />
            @cosmos/colorful
          </DropdownMenuItem>
          <DropdownMenuItem
            render={
              <a
                href="https://github.com/atmdntx/cosmos/tree/main/packages/themes#readme"
                target="_blank"
                rel="noreferrer noopener"
              />
            }
            className="font-mono"
          >
            <TerminalIcon data-icon="inline-start" />
            @cosmos/themes
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
