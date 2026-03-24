import { useColorfulStore } from "#/lib/store";
import { colorfulPaletteCreator } from "@cosmos/colorful";
import { useMemo } from "react";
import { Palette } from "./ui/palette";

export function PaletteExplorer() {
  const baseColor = useColorfulStore.use.baseColor();
  const colorScheme = useColorfulStore.use.colorScheme();
  const {
    primaryPalette,
    secondaryPalette,
    tertiaryPalette,
    neutralPalette,
    grayPalette,
    errorPalette,
  } = useMemo(() => new colorfulPaletteCreator(baseColor, colorScheme), [baseColor, colorScheme]);

  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-6 p-6 h-auto">
      <Palette label="Primary" palette={primaryPalette} />
      <Palette label="Secondary" palette={secondaryPalette} />
      <Palette label="Tertiary" palette={tertiaryPalette} />
      <Palette label="Error" palette={errorPalette} />
      <Palette label="Neutral" palette={neutralPalette} />
      <Palette label="Gray" palette={grayPalette} />
    </div>
  );
}
