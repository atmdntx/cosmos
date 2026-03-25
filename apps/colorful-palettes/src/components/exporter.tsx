import React, { Suspense } from "react";
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

const CodeBlock = React.lazy(() =>
  import("./ui/codeblock").then((m) => ({ default: m.CodeBlock })),
);

export function Exporter() {
  const { hoverProps, isHovered } = useHover({});
  const cssString = useColorfulStore.use.cssString();
  const tailwindString = useColorfulStore.use.tailwindString();
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button {...hoverProps} variant="ghost">
            {m.export_theme()}
            <DownloadIcon data-icon="inline-end" animate={isHovered} />
          </Button>
        }
      />
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
