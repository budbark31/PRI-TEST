import { defineField, defineType } from "sanity";

export const inventoryType = defineType({
  name: "inventory",
  title: "Inventory",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (Rule) => Rule.required() }),
    defineField({ name: "images", type: "array", of: [{ type: "image" }] }),
    defineField({ name: "price", type: "number" }),
    defineField({ name: "year", type: "number" }),
    defineField({ name: "make", type: "string" }),
    defineField({ name: "model", type: "string" }),
    defineField({ name: "hoursOrMileage", title: "Hours or Mileage", type: "string" }),
    defineField({
      name: "status",
      type: "string",
      initialValue: "available",
      options: {
        list: [
          { title: "Available", value: "available" },
          { title: "Pending", value: "pending" },
          { title: "Sold", value: "sold" },
        ],
      },
    }),
    defineField({ name: "category", type: "string" }),
    defineField({ name: "description", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "stockDate", type: "date" }),
    defineField({ name: "paperwork", type: "string" }),
  ],
});
