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

export function LinkShare() {
  const { hoverProps, isHovered } = useHover({});
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button {...hoverProps} variant="ghost">
            Share Link
            <SendIcon data-icon="inline-end" animate={isHovered} />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Link</DialogTitle>
          <DialogDescription>Bla bla bla bla</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
