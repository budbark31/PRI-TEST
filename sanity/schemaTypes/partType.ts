import { defineField, defineType } from "sanity";

export const partType = defineType({
  name: "part",
  title: "Part",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (Rule) => Rule.required() }),
    defineField({ name: "images", type: "array", of: [{ type: "image" }] }),
    defineField({ name: "price", type: "number" }),
    defineField({ name: "inventoryCount", type: "number", initialValue: 0 }),
    defineField({
      name: "category",
      type: "string",
      options: {
        list: [
          { title: "Engine", value: "engine" },
          { title: "Transmission", value: "transmission" },
          { title: "Body/Cab", value: "body-cab" },
          { title: "Maintenance/Filters", value: "maintenance-filters" },
          { title: "Accessories", value: "accessories" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({
      name: "condition",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Used", value: "used" },
          { title: "Rebuilt", value: "rebuilt" },
          { title: "Core", value: "core" },
        ],
      },
    }),
    defineField({
      name: "status",
      type: "string",
      initialValue: "available",
      options: {
        list: [
          { title: "Available", value: "available" },
          { title: "Out of Stock", value: "out-of-stock" },
          { title: "Sold", value: "sold" },
        ],
      },
    }),
    defineField({ name: "description", type: "text" }),
  ],
});
