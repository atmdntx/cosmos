import { cn } from "#/lib/utils";
import type { ComponentProps } from "react";

export function AppVisualizer({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col overflow-hidden rounded-xl bg-background border relative",
        className,
      )}
      {...props}
    />
  );
}
