import { useRef, type CSSProperties, type ReactEventHandler } from "react";
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
  parseColor,
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
import type { ColorfulShade } from "@cosmos/colorful";
import { useColorfulStore } from "#/store/store";
import { m } from "@/paraglide/messages";

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
  children?: React.ReactNode;
  onClick?: ReactEventHandler;
}
function ColorSwatch(props: ColorSwatchProps) {
  const { className, style } = props;
  const { colorSwatchProps } = useColorSwatch(props);

  return (
    <div
      onClick={(e) => props.onClick?.(e)}
      className={cn("w-[inherit] h-[inherit]", className)}
      {...colorSwatchProps}
      style={{ ...colorSwatchProps.style, ...style }}
    >
      {props.children}
    </div>
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
  const inputColor = useColorfulStore.use.inputColor();
  const setInputColor = useColorfulStore.use.setInputColor();

  return (
    <Field className="gap-1">
      <FieldLabel className="text-xs font-semibold text-muted-foreground">
        {m.label_base_color()}
      </FieldLabel>
      <InputGroup className="flex items-center bg-background">
        <ColorField
          autoFocus={false}
          aria-label={m.aria_color_picker()}
          value={colorPickerState.color}
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
                  <ColorSwatch color={parseColor(inputColor)} />
                </InputGroupButton>
              }
            ></PopoverTrigger>
            <PopoverContent>
              <ColorArea
                colorSpace="hsl"
                xChannel="saturation"
                yChannel="lightness"
                value={colorPickerState.color}
                onChange={(e) => colorPickerState.setColor(e)}
                onChangeEnd={(e) => setInputColor(String(e))}
              />
              <div className="flex flex-col gap-2">
                <ColorSlider
                  value={colorPickerState.color}
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
