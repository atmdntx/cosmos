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
import { Link } from "@tanstack/react-router";
import { TerminalIcon } from "./ui/terminal";

export function GithubLinks() {
  const { isHovered, hoverProps } = useHover({});
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button {...hoverProps} variant="ghost" size="icon" aria-label="Get code">
            <GithubIcon animate={isHovered} />
          </Button>
        }
      />
      <DropdownMenuContent className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Main</DropdownMenuLabel>
          <DropdownMenuItem render={<Link to="/" />} className="font-mono">
            <TerminalIcon data-icon="inline-start" />
            ColorfulPalettes App
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Packages</DropdownMenuLabel>
          <DropdownMenuItem render={<Link to="/" />} className="font-mono">
            <TerminalIcon data-icon="inline-start" />
            @cosmos/colorful
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link to="/" />} className="font-mono">
            <TerminalIcon data-icon="inline-start" />
            @cosmos/themes
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
