import { Palette } from "./ui/palette";
import { useColorfulStore } from "#/store/store";
import { m } from "@/paraglide/messages";

export function PaletteExplorer() {
  const palettes = useColorfulStore.use.colorfulPalettes();
  const primaryString = useColorfulStore.use.primaryString();
  const secondaryString = useColorfulStore.use.secondaryString();
  const tertiaryString = useColorfulStore.use.tertiaryString();
  const errorString = useColorfulStore.use.errorString();
  const neutralString = useColorfulStore.use.neutralString();
  const grayString = useColorfulStore.use.grayString();

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
      <Palette
        label={m.palette_primary()}
        description={m.palette_primary_description()}
        palette={primaryPalette}
        codeString={primaryString}
      />
      <Palette
        label={m.palette_secondary()}
        description={m.palette_secondary_description()}
        palette={secondaryPalette}
        codeString={secondaryString}
      />
      <Palette
        label={m.palette_tertiary()}
        description={m.palette_tertiary_description()}
        palette={tertiaryPalette}
        codeString={tertiaryString}
      />
      <Palette
        label={m.palette_error()}
        description={m.palette_error_description()}
        palette={errorPalette}
        codeString={errorString}
      />
      <Palette
        label={m.palette_neutral()}
        description={m.palette_neutral_description()}
        palette={neutralPalette}
        codeString={neutralString}
      />
      <Palette
        label={m.palette_gray()}
        description={m.palette_gray_description()}
        palette={grayPalette}
        codeString={grayString}
      />
    </div>
  );
}
