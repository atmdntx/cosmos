"use client";
import { useEffect, useState, type ComponentProps } from "react";
import { useHover } from "react-aria";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { SendIcon } from "./ui/send";
import { m } from "@/paraglide/messages";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Field, FieldContent, FieldLabel } from "./ui/field";
import { useColorfulStore } from "#/store/store";
import { CopyButton } from "./ui/copybutton";
import { useIsMobile } from "#/hooks/use-mobile";
import { cn } from "#/lib/utils";
import { mergeProps } from "@base-ui/react";

type LinkShareProps = ComponentProps<typeof Button> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
};

export function LinkShare({
  open: openProp,
  onOpenChange,
  hideTrigger = false,
  ...props
}: LinkShareProps) {
  const isMobile = useIsMobile();
  const { hoverProps, isHovered } = useHover({});
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? !!openProp : uncontrolledOpen;
  const link = useColorfulStore.use.shareableUrl();
  const encodePreset = useColorfulStore.use.encodePreset();
  const inputColor = useColorfulStore.use.inputColor();
  const colorScheme = useColorfulStore.use.colorScheme();
  const colorFormat = useColorfulStore.use.colorFormat();
  const useLightDark = useColorfulStore.use.useLightDark();

  useEffect(() => {
    if (!open) return;
    encodePreset();
  }, [open, encodePreset, inputColor, colorScheme, colorFormat, useLightDark]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!hideTrigger && (
        <DialogTrigger
          {...mergeProps(props, hoverProps)}
          render={
            <Button variant="ghost" className={cn(isMobile && "w-full justify-start")}>
              {isMobile && <SendIcon data-icon="inline-start" animate={isHovered} />}
              {m.share_link()}
              {!isMobile && <SendIcon data-icon="inline-end" animate={isHovered} />}
            </Button>
          }
        />
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{m.share_link()}</DialogTitle>
          <DialogDescription>{m.share_dialog_description()}</DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor="share-link">Link</FieldLabel>
          <FieldContent>
            <InputGroup>
              <InputGroupInput id="share-link" className="text-left" readOnly value={link} />
              <InputGroupAddon align="inline-end">
                <CopyButton variant="ghost" size="icon-sm" copyContent={link} />
              </InputGroupAddon>
            </InputGroup>
          </FieldContent>
        </Field>
      </DialogContent>
    </Dialog>
  );
}
