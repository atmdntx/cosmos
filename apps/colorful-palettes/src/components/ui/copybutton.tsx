import type { ComponentProps } from "react";
import { Button } from "./button";
import { useCopyToClipboard } from "#/hooks/use-copy-to-clipboard";
import { useHover } from "react-aria";
import { mergeProps } from "@base-ui/react";
import { CheckIcon } from "./check";
import { CopyIcon } from "./copy";
import { m } from "@/paraglide/messages";

export function CopyButton({
  copyContent,
  size = "icon",
  variant = "outline",
  ...props
}: ComponentProps<typeof Button> & { copyContent: string }) {
  const { status, copy } = useCopyToClipboard();
  const { hoverProps, isHovered } = useHover({});
  return (
    <Button
      aria-label={m.aria_copy_to_clipboard()}
      data-slot="copy-button"
      size={size}
      variant={variant}
      onClick={() => copy(copyContent)}
      {...mergeProps(props, hoverProps)}
    >
      {props.children}
      {status === "copied" || status === "already" ? (
        <CheckIcon
          data-icon={props.children ? "inline-end" : undefined}
          animate={status === "copied" || status === "already" || isHovered}
        />
      ) : (
        <CopyIcon data-icon={props.children ? "inline-end" : undefined} animate={isHovered} />
      )}
    </Button>
  );
}
