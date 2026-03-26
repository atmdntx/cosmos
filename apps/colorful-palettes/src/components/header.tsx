import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { ColorfulLogo } from "./ui/logo";
import { Exporter } from "./exporter";
import { LinkShare } from "./link-share";
import { Separator } from "./ui/separator";
import { ThemeSwitcher } from "./ui/theme-switcher";
import { GithubLinks } from "./github-links";
import { m } from "@/paraglide/messages";
import { useIsMobile } from "#/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { MenuIcon } from "./ui/menu";
import { useHover } from "react-aria";
import { DownloadIcon } from "./ui/download";
import { SendIcon } from "./ui/send";

export default function Header() {
  const { hoverProps } = useHover({});
  const isMobile = useIsMobile();
  const [exporterOpen, setExporterOpen] = React.useState(false);
  const [linkShareOpen, setLinkShareOpen] = React.useState(false);
  return (
    <header className="sticky top-0 w-full bg-background">
      <div className="px-6 w-full flex h-14 items-center justify-between">
        <div>
          <Button nativeButton={false} render={<Link to="/" />} variant="ghost">
            <ColorfulLogo />
            {m.brand_name()}
          </Button>
        </div>
        {isMobile ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={(props, state) => (
                  <Button {...props} size="icon" {...hoverProps} variant="outline">
                    <MenuIcon animate={state.open} />
                  </Button>
                )}
              />
              <DropdownMenuContent className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setExporterOpen(true)}>
                    <DownloadIcon className="size-4 shrink-0" />
                    {m.export_theme()}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLinkShareOpen(true)}>
                    <SendIcon className="size-4 shrink-0" />
                    {m.share_link()}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <ThemeSwitcher />
                  <GithubLinks />
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Exporter hideTrigger open={exporterOpen} onOpenChange={setExporterOpen} />
            <LinkShare hideTrigger open={linkShareOpen} onOpenChange={setLinkShareOpen} />
          </>
        ) : (
          <div className="hidden sm:flex gap-1">
            <Exporter />
            <LinkShare />
            <Separator orientation="vertical" />
            <ThemeSwitcher />
            <GithubLinks />
          </div>
        )}
      </div>
    </header>
  );
}
