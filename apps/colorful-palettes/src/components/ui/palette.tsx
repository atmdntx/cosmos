import type { ColorfulPalette } from "@cosmos/colorful";
import { useId, useMemo, type ComponentProps } from "react";
import { ColorSwatch } from "./colorpicker";
import { Field, FieldLabel } from "./field";
import { useLocale } from "react-aria";
import { parseColor } from "react-stately";

interface PaletteProps<T> extends ComponentProps<"div"> {
  palette: T;
  name: string;
}
export function Palette<T extends ColorfulPalette>({ palette, name, ...props }: PaletteProps<T>) {
  const id = useId();
  const mainColor = useMemo(() => palette.shades.find((shade) => shade.number === 500), []);
  const { locale } = useLocale();
  const colorName = parseColor(
    mainColor!.color.to("srgb").toString({ format: "hex" }),
  ).getColorName(locale);
  return (
    <Field {...props}>
      <FieldLabel htmlFor={`${id}-${name}`}>{colorName}</FieldLabel>
      <output id={`${id}-${name}`} className="flex gap-1 w-full flex-wrap">
        {palette.shades.map((shade) => (
          <ColorSwatch
            key={shade.number}
            className="relative h-5 w-8 xl:w-12 xl:h-6 *:rounded"
            showInfo
            shade={shade}
            color={shade.color.toString({ format: "hex" })}
          ></ColorSwatch>
        ))}
      </output>
    </Field>
  );
}
