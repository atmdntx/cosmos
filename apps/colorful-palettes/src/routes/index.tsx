import { Card, CardContent, CardHeader } from "#/components/ui/card";
import { ColorPicker } from "#/components/ui/colorpicker";
import { createFileRoute } from "@tanstack/react-router";
import type {} from "@cosmos/colorful";
import { ColorSpaceSelector } from "#/components/ui/color-space-selector";
import { useColorfulStore } from "#/lib/store";
import { LightDarkSelector } from "#/components/ui/use-light-dark-selector";
import { ColorSchemeSelector } from "#/components/ui/color-scheme-selector";
import { PaletteExplorer } from "#/components/palette-explorer";
import { AppVisualizer } from "#/components/app-visualizer";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const { baseColor } = useColorfulStore();
  return (
    <main className="flex min-h-0 flex-1 flex-col gap-6 pt-3 p-6 md:flex-row-reverse">
      <AppVisualizer>
        <PaletteExplorer />
      </AppVisualizer>
      <Card className="md:w-56">
        <CardHeader>
          <ColorPicker defaultValue={baseColor} />
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <ColorSchemeSelector />
          <ColorSpaceSelector />
          <LightDarkSelector />
        </CardContent>
      </Card>
    </main>
  );
}
