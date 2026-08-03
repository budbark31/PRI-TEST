import { defineField, defineType } from "sanity";
import PriceInput from "./components/PriceInput";

export const inventoryType = defineType({
  name: "inventory",
  title: "Inventory",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (Rule) => Rule.required() }),
    defineField({ name: "images", type: "array", of: [{ type: "image" }] }),
    defineField({ name: "price", type: "number", components: { input: PriceInput } }),
    defineField({ name: "year", type: "number" }),
    defineField({ name: "make", type: "string" }),
    defineField({ name: "model", type: "string" }),
    defineField({
      name: "usage",
      title: "Miles/Hours",
      type: "object",
      fields: [
        defineField({ name: "value", title: "Value", type: "number", validation: (Rule) => Rule.required().min(0) }),
        defineField({
          name: "unit",
          title: "Select Miles or Hours",
          type: "string",
          validation: (Rule) => Rule.required(),
          options: {
            list: [
              { title: "Miles", value: "miles" },
              { title: "Hours", value: "hours" },
            ],
          },
        }),
      ],
    }),
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
