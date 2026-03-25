import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { ColorfulLogo } from "./ui/logo";
import { Exporter } from "./exporter";
import { LinkShare } from "./link-share";
import { Separator } from "./ui/separator";
import { ThemeSwitcher } from "./ui/theme-switcher";
import { GithubLinks } from "./github-links";
import { m } from "@/paraglide/messages";

export default function Header() {
  return (
    <header className="sticky top-0 w-full bg-background">
      <div className="px-6 w-full flex h-14 items-center justify-between">
        <div>
          <Button nativeButton={false} render={<Link to="/" />} variant="ghost">
            <ColorfulLogo />
            {m.brand_name()}
          </Button>
        </div>
        <div className="flex gap-1">
          <Exporter />
          <LinkShare />
          <Separator orientation="vertical" />
          <ThemeSwitcher />
          <GithubLinks />
        </div>
      </div>
    </header>
  );
}
