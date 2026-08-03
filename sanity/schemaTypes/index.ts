import { type SchemaTypeDefinition } from "sanity";
import { inventoryType } from "./inventoryType";
import { orderType } from "./orderType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [inventoryType, orderType],
};
