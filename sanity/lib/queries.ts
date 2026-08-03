import { groq } from "next-sanity";

export const ALL_INVENTORY_QUERY = groq`{
  "trucks": *[_type == "inventory" && defined(slug.current)] | order(_updatedAt desc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    "images": images[0..4].asset->url,
    price,
    year,
    make,
    model,
    hoursOrMileage,
    status,
    category
  },
  "parts": *[_type == "part" && defined(slug.current)] | order(_updatedAt desc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    category,
    condition,
    status,
    price,
    inventoryCount,
    "imageUrl": images[0].asset->url
  }
}`;

export const PARTS_QUERY = groq`*[_type == "part" && defined(slug.current)] | order(_updatedAt desc) {
  _id,
  title,
  "slug": slug.current,
  category,
  condition,
  status,
  price,
  inventoryCount,
  "imageUrl": images[0].asset->url
}`;

export const PART_BY_SLUG_QUERY = groq`*[_type == "part" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  category,
  condition,
  status,
  price,
  inventoryCount,
  description,
  "images": images[].asset->url
}`;
