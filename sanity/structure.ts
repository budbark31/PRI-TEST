import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.documentTypeListItem("inventory").title("Inventory"),
      S.documentTypeListItem("part").title("Parts"),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !["inventory", "part"].includes(item.getId() || "")
      ),
    ]);
