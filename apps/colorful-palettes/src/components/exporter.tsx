import React, { Suspense, type ComponentProps } from "react";
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
import { DownloadIcon } from "./ui/download";
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from "./ui/tabs";
import { Spinner } from "./ui/spinner";
import { useColorfulStore } from "#/store/store";
import { m } from "@/paraglide/messages";
import { useIsMobile } from "#/hooks/use-mobile";
import { cn } from "#/lib/utils";
import { mergeProps } from "@base-ui/react";

type ExporterProps = ComponentProps<typeof Button> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
};

const CodeBlock = React.lazy(() =>
  import("./ui/codeblock").then((m) => ({ default: m.CodeBlock })),
);

export function Exporter({
  open: openProp,
  onOpenChange,
  hideTrigger = false,
  ...props
}: ExporterProps) {
  const isMobile = useIsMobile();
  const { hoverProps, isHovered } = useHover({});
  const cssString = useColorfulStore.use.cssString();
  const tailwindString = useColorfulStore.use.tailwindString();
  const buildStrings = useColorfulStore.use.buildStrings();
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = openProp !== undefined;
  const isOpen = isControlled ? !!openProp : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (open) {
        buildStrings();
      }
      if (!isControlled) {
        setUncontrolledOpen(open);
      }
      onOpenChange?.(open);
    },
    [buildStrings, isControlled, onOpenChange],
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {!hideTrigger && (
        <DialogTrigger
          render={
            <Button
              {...mergeProps(hoverProps, props)}
              variant="ghost"
              className={cn(isMobile && "w-full justify-start")}
            >
              {isMobile && <DownloadIcon data-icon="inline-start" animate={isHovered} />}
              {m.export_theme()}
              {!isMobile && <DownloadIcon data-icon="inline-end" animate={isHovered} />}
            </Button>
          }
        />
      )}
      <DialogContent className="sm:max-w-[calc(100%-2rem)] lg:max-w-max">
        <DialogHeader>
          <DialogTitle>{m.export()}</DialogTitle>
          <DialogDescription>{m.export_description()}</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="css" className="overflow-hidden no-scrollbar">
          <TabsList>
            <TabsTrigger value="css">{m.tab_css()}</TabsTrigger>
            <TabsTrigger value="tailwindcss">{m.tab_tailwindcss()}</TabsTrigger>
            <TabsTrigger value="shadcn" disabled>
              {m.tab_shadcn()}
            </TabsTrigger>
            <TabsIndicator />
          </TabsList>
          <TabsContent value="css">
            <Suspense fallback={<Spinner />}>
              <CodeBlock code={cssString} />
            </Suspense>
          </TabsContent>
          <TabsContent value="tailwindcss">
            <Suspense fallback={<Spinner />}>
              <CodeBlock code={tailwindString} />
            </Suspense>
          </TabsContent>
          <TabsContent value="shadcn">{m.coming_soon()}</TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
