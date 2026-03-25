import type { ColorfulPalette, ColorfulShade } from "@cosmos/colorful";
import { type ComponentProps } from "react";
import { ColorSwatch } from "./colorpicker";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";
import { Maximize2Icon } from "./maximize-2";
import { useHover } from "react-aria";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "./item";
import { useColorfulStore } from "#/store/store";
import type { ColorFormat } from "@cosmos/themes";
import { m } from "@/paraglide/messages";
import { CopyButton } from "./copybutton";

interface PaletteProps<T> extends ComponentProps<"div"> {
  palette: T;
  label: string;
  description?: string;
  codeString?: string;
}

function PaletteItem({ shade, colorFormat }: { shade: ColorfulShade; colorFormat: ColorFormat }) {
  return (
    <Item variant="default">
      <ItemMedia variant="image">
        <ColorSwatch color={shade.exports.hex} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="font-semibold">{shade.number}</ItemTitle>
        <ItemDescription className="text-xs">{shade.exports[colorFormat]}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Badge
          style={{
            color: shade.exports.hex,
            backgroundColor: shade.contrast.exports.hex,
          }}
        >
          {shade.contrast.contrastRatio.toFixed(1)}
        </Badge>
      </ItemActions>
    </Item>
  );
}

function PaletteContent({ palette }: { palette: ColorfulPalette }) {
  const colorFormat = useColorfulStore.use.colorFormat();
  return (
    <ItemGroup className="gap-0 no-scrollbar overflow-y-auto">
      {palette.shades.map((shade) => (
        <PaletteItem key={shade.number} shade={shade} colorFormat={colorFormat} />
      ))}
    </ItemGroup>
  );
}

export function Palette<T extends ColorfulPalette>({
  palette,
  label,
  description,
  codeString,
  ...props
}: PaletteProps<T>) {
  const { hoverProps, isHovered } = useHover({});
  return (
    <Card {...props} className="relative pt-0 ring-0 shadow">
      <Drawer direction="right">
        <DrawerTrigger asChild {...hoverProps}>
          <div className="group relative z-20 aspect-video overflow-hidden rounded-xl p-2">
            <div className="absolute inset-0 z-30 bg-background opacity-0 group-hover:opacity-50 transition-opacity m-2 mb-0 grid place-items-center rounded-xl overflow-hidden">
              <Maximize2Icon size={48} animate={isHovered} />
            </div>
            <output className="flex relative pointer-events-none aspect-video rounded-xl overflow-hidden">
              {palette.shades.map((shade) => (
                <ColorSwatch
                  key={shade.number}
                  className="relative h-full w-auto flex-1"
                  shade={shade}
                  color={shade.color.toString({ format: "hex" })}
                ></ColorSwatch>
              ))}
            </output>
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="font-semibold">{palette.name}</DrawerTitle>
            <DrawerDescription>{description ?? label}</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-2 no-scrollbar overflow-y-hidden">
            <div className="flex justify-between items-center px-4 font-semibold text-muted-foreground [font-variant-caps:all-small-caps]">
              <h3 className="font-semibold text-base">{m.palette_specs_heading()}</h3>
              <span className="text-sm">{m.palette_contrast_label()}</span>
            </div>
            <PaletteContent palette={palette} />
          </div>
          {codeString && (
            <DrawerFooter>
              <CopyButton variant="default" size="default" copyContent={codeString}>
                Copy Code
              </CopyButton>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
      <CardHeader>
        <CardAction>
          <Badge variant="secondary" className="capitalize">
            {label}
          </Badge>
        </CardAction>
        <CardTitle className="font-semibold">{palette.name}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
    </Card>
  );
}
