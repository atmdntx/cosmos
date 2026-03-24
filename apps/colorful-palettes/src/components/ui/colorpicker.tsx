import { useId, useRef, type CSSProperties } from "react";
import {
  useColorArea,
  useColorField,
  useColorSlider,
  useColorSwatch,
  useLocale,
  type AriaColorAreaProps,
  type AriaColorFieldProps,
  type AriaColorSliderProps,
  type AriaColorSwatchProps,
} from "react-aria";
import {
  useColorAreaState,
  useColorFieldState,
  useColorPickerState,
  useColorSliderState,
  type ColorPickerProps,
} from "react-stately";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "#/lib/utils";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./input-group";

import { Field, FieldLabel } from "./field";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";
import type { ColorfulShade } from "@cosmos/colorful";
import { CopyButton } from "./copybutton";
import { useColorfulStore } from "#/store/store";

function ColorArea(props: AriaColorAreaProps) {
  const inputXRef = useRef<HTMLInputElement>(null);
  const inputYRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const state = useColorAreaState(props);

  const { colorAreaProps, thumbProps, xInputProps, yInputProps } = useColorArea(
    { ...props, inputXRef, inputYRef, containerRef },
    state,
  );

  return (
    <div ref={containerRef} {...colorAreaProps} className="w-full aspect-square rounded-lg">
      <div
        {...thumbProps}
        className="block size-4 border shrink-0 rounded-full bg-white ring-ring/50 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 disabled:pointer-events-none disabled:opacity-50"
      >
        <input ref={inputXRef} {...xInputProps} />
        <input ref={inputYRef} {...yInputProps} />
      </div>
    </div>
  );
}

function ColorField(props: AriaColorFieldProps) {
  const state = useColorFieldState(props);
  const inputRef = useRef<HTMLInputElement>(null);
  const { inputProps } = useColorField(props, state, inputRef);
  return <InputGroupInput ref={inputRef} {...inputProps} />;
}

interface ColorSwatchProps extends AriaColorSwatchProps {
  className?: string;
  style?: CSSProperties;
  showInfo?: boolean | "minimal";
  shade?: ColorfulShade;
}
function ColorSwatch(props: ColorSwatchProps) {
  const { className, style, showInfo, shade } = props;
  const { colorSwatchProps } = useColorSwatch(props);
  const colorFormat = useColorfulStore.use.colorFormat();
  const colorOutputId = useId();
  const contrastOutputId = useId();
  if (typeof showInfo === "boolean" && Boolean(showInfo)) {
    return (
      <HoverCard>
        <HoverCardTrigger delay={0} closeDelay={0} className={className} style={{ ...style }}>
          <div className="absolute inset-0" {...colorSwatchProps} />
        </HoverCardTrigger>
        <HoverCardContent className="flex flex-col gap-2">
          <div
            className="relative h-16 w-full grid place-items-center rounded-md font-semibold text-lg"
            style={{
              backgroundColor: shade!.color.to("oklch").toString(),
              color: shade!.contrast.color.to("oklch").toString(),
            }}
          >
            {shade!.number}
            <CopyButton
              variant="ghost"
              size="icon-xs"
              className="absolute bottom-1 right-1"
              copyContent={shade!.color
                .to(colorFormat === "hex" ? "srgb" : colorFormat)
                .toString({ format: colorFormat })}
            />
          </div>
          <Field className="gap-0">
            <FieldLabel htmlFor={colorOutputId}>Color</FieldLabel>
            <output className="text-muted-foreground" id={colorOutputId} aria-live="polite">
              {shade!.color
                .to(colorFormat === "hex" ? "srgb" : colorFormat)
                .toString({ format: colorFormat })}
            </output>
          </Field>
          <Field className="gap-0">
            <FieldLabel htmlFor={contrastOutputId}>Contrast Color</FieldLabel>
            <output className="text-muted-foreground" id={contrastOutputId} aria-live="polite">
              {shade!.contrast.color
                .to(colorFormat === "hex" ? "srgb" : colorFormat)
                .toString({ format: colorFormat })}
            </output>
          </Field>
        </HoverCardContent>
      </HoverCard>
    );
  }
  return (
    <div className={cn("absolute inset-0", className)} style={{ ...style }} {...colorSwatchProps} />
  );
}

function ColorSlider(props: AriaColorSliderProps) {
  const { locale } = useLocale();
  const state = useColorSliderState({ ...props, locale });
  const trackRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const label = props.label || state.value.getChannelName(props.channel, locale);

  const { trackProps, thumbProps, inputProps, outputProps, labelProps } = useColorSlider(
    { ...props, label, trackRef, inputRef },
    state,
  );

  return (
    <div>
      <div>
        <div className="flex justify-between w-full text-muted-foreground text-xs font-medium">
          <label {...labelProps} className="">
            {label}
          </label>
          <output {...outputProps}>{state.value.formatChannelValue(props.channel, locale)}</output>
        </div>
        <div {...trackProps} ref={trackRef} className="h-6 w-full rounded-sm">
          <div
            {...thumbProps}
            className="block size-4 top-3 shrink-0 rounded-full border bg-white ring-ring/50 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 disabled:pointer-events-none disabled:opacity-50"
          >
            <input ref={inputRef} {...inputProps} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorPicker(props: ColorPickerProps) {
  const colorPickerState = useColorPickerState(props);
  const { color } = colorPickerState;
  const setInputColor = useColorfulStore.use.setInputColor();
  return (
    <Field className="gap-1">
      <FieldLabel className="text-xs font-semibold text-muted-foreground">Base color</FieldLabel>
      <InputGroup className="flex items-center bg-background">
        <ColorField
          autoFocus={false}
          aria-label="Color picker"
          value={color}
          onChange={(e) => {
            colorPickerState.setColor(e);
            setInputColor(String(e));
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover>
            <PopoverTrigger
              render={
                <InputGroupButton
                  className="relative rounded-full overflow-hidden"
                  size="icon-xs"
                  variant="ghost"
                >
                  <ColorSwatch color={color} />
                </InputGroupButton>
              }
            ></PopoverTrigger>
            <PopoverContent>
              <ColorArea
                colorSpace="hsl"
                xChannel="saturation"
                yChannel="lightness"
                value={color}
                onChange={(e) => colorPickerState.setColor(e)}
                onChangeEnd={(e) => setInputColor(String(e))}
              />
              <div className="flex flex-col gap-2">
                <ColorSlider
                  value={color}
                  onChange={(e) => colorPickerState.setColor(e)}
                  onChangeEnd={(e) => setInputColor(String(e))}
                  colorSpace="hsl"
                  channel="hue"
                />
              </div>
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

export { ColorArea, ColorField, ColorSwatch, ColorSlider, ColorPicker };
