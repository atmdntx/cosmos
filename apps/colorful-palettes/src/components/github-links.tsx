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
          <DropdownMenuLabel>{m.github_section_main()}</DropdownMenuLabel>
          <DropdownMenuItem render={<Link to="/" />} className="font-mono">
            <TerminalIcon data-icon="inline-start" />
            {m.github_app_name()}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuLabel>{m.github_section_packages()}</DropdownMenuLabel>
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
