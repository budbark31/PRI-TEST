import { defineField, defineType } from "sanity";
import PriceInput from "./components/PriceInput";

export const inventoryType = defineType({
  name: "inventory",
  title: "Inventory",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: "Shown as the listing name, e.g. \"2019 Kenworth T880 Tri-Axle Dump\". Avoid the words test, demo or sample, which hide a listing from the site.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      description: "The web address for this listing. Click Generate after typing the title.",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      type: "array",
      description: "The first photo is the main photo on the inventory page and in text-message previews. Drag photos to reorder.",
      of: [{ type: "image" }],
    }),
    defineField({
      name: "price",
      type: "number",
      description: "Numbers only, no commas. Leave empty to show \"Call for Price\".",
      components: { input: PriceInput },
    }),
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
      description: "Pending shows a \"Pending Sale\" badge. Sold greys out the photo, adds a SOLD stamp and moves the listing to the bottom.",
      initialValue: "available",
      options: {
        list: [
          { title: "Available", value: "available" },
          { title: "Pending", value: "pending" },
          { title: "Sold", value: "sold" },
        ],
      },
    }),
    defineField({
      name: "category",
      type: "string",
      description: "Controls which filter the listing appears under on the site.",
      options: {
        list: [
          { title: "Dump Trucks", value: "dump-trucks" },
          { title: "Day Cabs", value: "day-cabs" },
          { title: "Heavy Equipment", value: "heavy-equipment" },
          { title: "Trailers", value: "trailers" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "description", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "stockDate", type: "date", description: "Internal only. Not shown on the site." }),
    defineField({ name: "paperwork", type: "string", description: "Internal only. Not shown on the site." }),
  ],
});
