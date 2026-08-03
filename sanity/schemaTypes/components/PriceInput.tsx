import { TextInput } from "@sanity/ui";
import { set, unset, type NumberInputProps } from "sanity";

export default function PriceInput(props: NumberInputProps) {
  const { elementProps, onChange, value, readOnly } = props;

  return (
    <TextInput
      {...elementProps}
      prefix="$"
      readOnly={readOnly}
      value={value === undefined || value === null ? "" : String(value)}
      onChange={(event) => {
        const nextValue = event.currentTarget.value;
        onChange(nextValue === "" ? unset() : set(Number(nextValue)));
      }}
    />
  );
}