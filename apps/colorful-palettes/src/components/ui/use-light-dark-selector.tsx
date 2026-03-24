import { useColorfulStore } from "#/store/store";
import { Checkbox } from "./checkbox";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "./field";

export function LightDarkSelector() {
  const useLightDark = useColorfulStore.use.useLightDark();
  const setUseLightDark = useColorfulStore.use.setUseLightDark();
  return (
    <FieldLabel htmlFor="light-dark" className="bg-background">
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
