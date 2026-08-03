import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.documentTypeListItem("inventory").title("Inventory"),
      S.documentTypeListItem("order").title("Orders"),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !["inventory", "order"].includes(item.getId() || "")
      ),
    ]);
