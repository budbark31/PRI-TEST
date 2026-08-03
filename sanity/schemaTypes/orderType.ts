import { defineField, defineType } from "sanity";

export const orderType = defineType({
  name: "order",
  title: "Order",
  type: "document",
  fields: [
    defineField({ name: "stripeSessionId", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "stripePaymentIntentId", type: "string" }),
    defineField({ name: "paymentStatus", type: "string" }),
    defineField({ name: "amountTotal", type: "number" }),
    defineField({ name: "currency", type: "string" }),
    defineField({ name: "customerEmail", type: "string" }),
    defineField({ name: "customerName", type: "string" }),
    defineField({ name: "customerPhone", type: "string" }),
    defineField({ name: "source", type: "string" }),
    defineField({ name: "createdAt", type: "datetime" }),
    defineField({
      name: "lineItems",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", type: "string" }),
            defineField({ name: "slug", type: "string" }),
            defineField({ name: "quantity", type: "number" }),
            defineField({ name: "unitAmount", type: "number" }),
            defineField({ name: "totalAmount", type: "number" }),
            defineField({ name: "imageUrl", type: "url" }),
          ],
        },
      ],
    }),
  ],
});
