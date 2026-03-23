import { useMemo } from "react";
import { useHover } from "react-aria";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { DownloadIcon } from "./ui/download";
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from "./ui/tabs";
import { themeGenerator } from "@cosmos/themes";
import { useColorfulStore } from "#/lib/store";
import { CodeBlock } from "./ui/codeblock";

export function Exporter() {
  const { hoverProps, isHovered } = useHover({});

  const baseColor = useColorfulStore.use.baseColor();
  const colorFormat = useColorfulStore.use.colorFormat();
  const colorScheme = useColorfulStore.use.colorScheme();
  const useLightDark = useColorfulStore.use.useLightDark();
  const { cssString, tailwindString } = useMemo(
    () => new themeGenerator(baseColor, { colorFormat, colorScheme, useLightDark }),
    [baseColor, colorFormat, colorScheme, useLightDark],
  );

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button {...hoverProps} variant="ghost">
            Export
            <DownloadIcon data-icon="inline-end" animate={isHovered} />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[calc(100%-2rem)] lg:max-w-max">
        <DialogHeader>
          <DialogTitle>Export</DialogTitle>
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
            <CodeBlock code={cssString} />
          </TabsContent>
          <TabsContent value="tailwindcss">
            <CodeBlock code={tailwindString} />
          </TabsContent>
          <TabsContent value="shadcn">Coming soon</TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
