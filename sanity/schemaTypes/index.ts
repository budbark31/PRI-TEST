import { type SchemaTypeDefinition } from "sanity";
import { inventoryType } from "./inventoryType";
import { partType } from "./partType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [inventoryType, partType],
};
