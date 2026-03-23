import type { ComponentProps } from "react";
import { Button } from "./button";
import { useCopyToClipboard } from "#/hooks/use-copy-to-clipboard";
import { useHover } from "react-aria";
import { mergeProps } from "@base-ui/react";
import { CheckIcon } from "./check";
import { CopyIcon } from "./copy";

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
      aria-label="Copy to Clipboard"
      data-slot="copy-button"
      size={size}
      variant={variant}
      onClick={() => copy(copyContent)}
      {...mergeProps(props, hoverProps)}
    >
      {status === "copied" || status === "already" ? (
        <CheckIcon animate={status === "copied" || status === "already" || isHovered} />
      ) : (
        <CopyIcon animate={isHovered} />
      )}
    </Button>
  );
}
