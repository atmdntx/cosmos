import { useColorfulStore } from "#/lib/store";
import { Checkbox } from "./checkbox";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "./field";

export function LightDarkSelector() {
  const { useLightDark, setUseLightDark } = useColorfulStore();
  return (
    <FieldLabel htmlFor="light-dark">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle>Use light-dark()</FieldTitle>
          <FieldDescription className="text-xs">
            CSS function that switches colors based on system color-scheme.
          </FieldDescription>
        </FieldContent>
        <Checkbox checked={useLightDark} onCheckedChange={setUseLightDark} id="light-dark" />
      </Field>
    </FieldLabel>
  );
}
