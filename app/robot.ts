import { MetadataRoute } from "next";
import { SITE_URL } from "@/app/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/studio/", // Don't let Google try to index your admin login
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}