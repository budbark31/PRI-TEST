import "server-only";

import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export const getAdminClient = () => {
  const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN;

  if (!token) {
    throw new Error("Missing SANITY_API_WRITE_TOKEN");
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
  });
};
