"use client";
import { useEffect, useState } from "react";
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

export function LinkShare() {
  const { hoverProps, isHovered } = useHover({});
  const [open, setOpen] = useState(false);
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
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button {...hoverProps} variant="ghost">
            {m.share_link()}
            <SendIcon data-icon="inline-end" animate={isHovered} />
          </Button>
        }
      />
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
