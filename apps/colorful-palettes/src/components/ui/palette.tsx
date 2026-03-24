import type { ColorfulPalette } from "@cosmos/colorful";
import { type ComponentProps } from "react";
import { ColorSwatch } from "./colorpicker";
import { Card, CardAction, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";

interface PaletteProps<T> extends ComponentProps<"div"> {
  palette: T;
  label: string;
}
export function Palette<T extends ColorfulPalette>({ palette, label, ...props }: PaletteProps<T>) {
  return (
    <Card {...props} className="relative pt-0 ring-0 shadow">
      <output className="flex relative z-20 aspect-video m-2 mb-0 rounded-xl overflow-hidden">
        {palette.shades.map((shade) => (
          <ColorSwatch
            key={shade.number}
            className="relative h-full w-auto flex-1"
            shade={shade}
            color={shade.color.toString({ format: "hex" })}
          ></ColorSwatch>
        ))}
      </output>
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">{label}</Badge>
        </CardAction>
        <CardTitle className="font-semibold">{palette.name}</CardTitle>
      </CardHeader>
    </Card>
  );
}
