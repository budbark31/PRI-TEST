import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'part',
  title: 'Part',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Engine', value: 'engine' },
          { title: 'Transmission', value: 'transmission' },
          { title: 'Body/Cab', value: 'body-cab' },
          { title: 'Maintenance/Filters', value: 'maintenance-filters' },
          { title: 'Accessories', value: 'accessories' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'condition',
      title: 'Condition',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Used', value: 'used' },
          { title: 'Rebuilt', value: 'rebuilt' },
          { title: 'Core', value: 'core' },
        ],
      },
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Available', value: 'available' },
          { title: 'Out of Stock', value: 'out-of-stock' },
          { title: 'Sold', value: 'sold' },
        ],
      },
      initialValue: 'available',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
    }),
    defineField({
      name: 'inventoryCount',
      title: 'Inventory Count',
      type: 'number',
    }),
    defineField({
      name: 'stripeProductId',
      title: 'Stripe Product ID',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      options: {
        layout: 'grid',
      },
    }),
    defineField({
      name: 'demo',
      title: 'Demo Listing',
      type: 'boolean',
      description: 'Used for bulk demo data; hidden in the Studio.',
      hidden: true,
      initialValue: false,
    }),
  ],
})
