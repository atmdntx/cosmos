import { cn } from "#/lib/utils";
import { Loader2Icon } from "lucide-react";
import { m } from "@/paraglide/messages";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      role="status"
      aria-label={m.aria_loading()}
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
