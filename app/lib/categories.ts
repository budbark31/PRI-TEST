// Inventory categories shown on the site. Keep in sync with the category
// list in sanity/schemaTypes/inventoryType.ts.
export const CATEGORIES = [
  { value: "light-duty-trucks", label: "Light Duty Trucks", group: "trucks" },
  { value: "medium-duty-trucks", label: "Medium Duty Trucks", group: "trucks" },
  { value: "heavy-duty-trucks", label: "Heavy Duty Trucks", group: "trucks" },
  { value: "dump-trucks", label: "Dump Trucks", group: "trucks" },
  { value: "day-cabs", label: "Day Cabs", group: "trucks" },
  { value: "trailers", label: "Trailers", group: "trucks" },
  { value: "heavy-equipment", label: "Heavy Equipment", group: "equipment" },
] as const;

export type CategoryGroup = (typeof CATEGORIES)[number]["group"];

export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map(({ value, label }) => [value, label])
);
