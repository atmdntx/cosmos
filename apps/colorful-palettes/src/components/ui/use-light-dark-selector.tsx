import { useColorfulStore } from "#/store/store";
import { Checkbox } from "./checkbox";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "./field";
import { m } from "@/paraglide/messages";

export function LightDarkSelector() {
  const useLightDark = useColorfulStore.use.useLightDark();
  const setUseLightDark = useColorfulStore.use.setUseLightDark();
  return (
    <FieldLabel htmlFor="light-dark" className="bg-background">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle>{m.label_use_light_dark()}</FieldTitle>
          <FieldDescription className="text-xs">{m.description_light_dark()}</FieldDescription>
        </FieldContent>
        <Checkbox checked={useLightDark} onCheckedChange={setUseLightDark} id="light-dark" />
      </Field>
    </FieldLabel>
  );
}
