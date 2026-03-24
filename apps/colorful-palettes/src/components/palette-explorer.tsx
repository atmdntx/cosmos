import { Palette } from "./ui/palette";
import { useColorfulStore } from "#/store/store";

export function PaletteExplorer() {
  const palettes = useColorfulStore.use.colorfulPalettes();
  if (!palettes) return null;

  const {
    primaryPalette,
    secondaryPalette,
    tertiaryPalette,
    errorPalette,
    neutralPalette,
    grayPalette,
  } = palettes;
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
