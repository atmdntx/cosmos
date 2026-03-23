import { useColorfulStore } from "#/lib/store";
import { colorfulPaletteCreator } from "@cosmos/colorful";
import { useMemo } from "react";
import { Palette } from "./ui/palette";

export function PaletteExplorer() {
  const { baseColor, colorScheme } = useColorfulStore();
  const {
    primaryPalette,
    secondaryPalette,
    tertiaryPalette,
    neutralPalette,
    grayPalette,
    errorPalette,
  } = useMemo(() => new colorfulPaletteCreator(baseColor, colorScheme), [baseColor, colorScheme]);

  return (
    <div className="absolute flex w-full border-t bottom-0 min-h-32 p-6 pt-3">
      <Palette name="Primary" palette={primaryPalette} />
      <Palette name="Secondary" palette={secondaryPalette} />
      <Palette name="Tertiary" palette={tertiaryPalette} />
      <Palette name="Error" palette={errorPalette} />
      <Palette name="Neutral" palette={neutralPalette} />
      <Palette name="Gray" palette={grayPalette} />
    </div>
  );
}
