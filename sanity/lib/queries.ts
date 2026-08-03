import { groq } from "next-sanity";

const EXCLUDE_DEMO_INVENTORY =
  "!(lower(coalesce(title, '')) match '*demo*' || lower(coalesce(title, '')) match '*test*' || lower(coalesce(title, '')) match '*sample*')";

export const ALL_INVENTORY_QUERY = groq`{
  "trucks": *[_type == "inventory" && defined(slug.current) && ${EXCLUDE_DEMO_INVENTORY}] | order(_updatedAt desc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    "images": images[0..4].asset->url,
    price,
    year,
    make,
    model,
    usage,
    hoursOrMileage,
    status,
    category
  }
}`;
