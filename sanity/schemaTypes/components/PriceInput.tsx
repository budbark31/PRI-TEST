import { TextInput } from "@sanity/ui";
import { set, unset, type NumberInputProps } from "sanity";

// Accept prices typed the way people write them ("$45,000", "45000.00") and
// store only the number. Anything that isn't a valid number is ignored rather
// than saved as NaN, which used to lock the field.
const parsePrice = (raw: string) => {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  if (cleaned === "") return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export default function PriceInput(props: NumberInputProps) {
  const { elementProps, onChange, value, readOnly } = props;
  const displayValue = typeof value === "number" && Number.isFinite(value) ? String(value) : "";

  return (
    <TextInput
      {...elementProps}
      prefix="$"
      inputMode="decimal"
      readOnly={readOnly}
      value={displayValue}
      onChange={(event) => {
        const parsed = parsePrice(event.currentTarget.value);
        if (parsed === null) onChange(unset());
        else if (parsed !== undefined) onChange(set(parsed));
      }}
    />
  );
}
