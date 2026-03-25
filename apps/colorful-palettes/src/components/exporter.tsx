import React, { Suspense } from "react";
import { useHover } from "react-aria";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
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
        </DialogHeader>
        <Tabs defaultValue="css" className="overflow-hidden no-scrollbar">
          <TabsList>
            <TabsTrigger value="css">CSS</TabsTrigger>
            <TabsTrigger value="tailwindcss">TailwindCSS</TabsTrigger>
            <TabsTrigger value="shadcn" disabled>
              Shadcn
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
          <TabsContent value="shadcn">Coming soon</TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
