import type { StructureResolver } from "sanity/structure";
import { CheckmarkCircleIcon, CloseCircleIcon, TagIcon } from "@sanity/icons";

const MAKES = ["Kenworth", "Peterbilt", "Mack", "Ford", "Freightliner", "International"];

export const structure: StructureResolver = (S) => {
  const truckList = (title: string, filter: string, params?: Record<string, unknown>) =>
    S.documentList()
      .title(title)
      .schemaType("inventory")
      .filter(`_type == "inventory" && ${filter}`)
      .params(params ?? {})
      .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]);

  return S.list()
    .title("Penn Rock Admin")
    .items([
      S.listItem()
        .title("Active Trucks")
        .icon(CheckmarkCircleIcon)
        .child(truckList("Active Trucks", 'status != "sold"')),
      S.listItem()
        .title("Sold Trucks")
        .icon(CloseCircleIcon)
        .child(truckList("Sold Trucks", 'status == "sold"')),
      S.listItem()
        .title("Active by Make")
        .icon(TagIcon)
        .child(
          S.list()
            .title("Active by Make")
            .items([
              ...MAKES.map((make) =>
                S.listItem()
                  .id(make.toLowerCase())
                  .title(make)
                  .child(truckList(make, 'status != "sold" && lower(make) == $make', { make: make.toLowerCase() }))
              ),
              S.listItem()
                .id("other")
                .title("Other")
                .child(
                  truckList("Other", 'status != "sold" && !(lower(coalesce(make, "")) in $makes)', {
                    makes: MAKES.map((make) => make.toLowerCase()),
                  })
                ),
            ])
        ),
    ]);
};
