import { Card, CardContent } from "#/components/ui/card";
import { ColorPicker } from "#/components/ui/colorpicker";
import { createFileRoute } from "@tanstack/react-router";
import type {} from "@cosmos/colorful";
import { ColorSpaceSelector } from "#/components/ui/color-space-selector";
import { LightDarkSelector } from "#/components/ui/use-light-dark-selector";
import { ColorSchemeSelector } from "#/components/ui/color-scheme-selector";
import { AppVisualizer } from "#/components/app-visualizer";
import { Spinner } from "#/components/ui/spinner";
import { useColorfulStore } from "#/store/store";
import { Suspense, lazy, useEffect } from "react";

const PaletteExplorer = lazy(async () => ({
  default: (await import("#/components/palette-explorer")).PaletteExplorer,
}));

type PresetParams = {
  preset?: string;
};

export const Route = createFileRoute("/")({
  component: App,
  validateSearch: (search: Record<string, unknown>): PresetParams => {
    const presetParam = typeof search.preset === "string" ? search.preset : "";
    return presetParam ? { preset: presetParam } : {};
  },
});

function App() {
  const inputColor = useColorfulStore.use.inputColor();
  const decodePreset = useColorfulStore.use.decodePreset();
  const { preset } = Route.useSearch();
  const navigate = Route.useNavigate();

  useEffect(() => {
    if (!preset) return;
    decodePreset(preset);
    void navigate({
      replace: true,
      search: (prev) => ({ ...prev, preset: undefined }),
    });
  }, [preset, decodePreset, navigate]);
  return (
    <main className="flex min-h-0 flex-1 flex-col gap-6 pt-3 p-6 md:flex-row-reverse">
      <AppVisualizer>
        <Suspense fallback={<PaletteExplorerFallback />}>
          <PaletteExplorer />
        </Suspense>
      </AppVisualizer>
      <Card className="md:w-56 ring-0 bg-sidebar">
        <CardContent className="flex flex-wrap md:flex-col gap-3">
          <ColorPicker defaultValue={inputColor} />
          <div className="flex md:flex-col gap-3 w-full">
            <ColorSchemeSelector />
            <ColorSpaceSelector />
          </div>
          <LightDarkSelector />
        </CardContent>
      </Card>
    </main>
  );
}

function PaletteExplorerFallback() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Spinner className="size-8" />
    </div>
  );
}
