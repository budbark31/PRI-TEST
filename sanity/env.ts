export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

// Fallback values keep local development working when .env.local is missing.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "72zzspuo";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const useCdn = process.env.NODE_ENV === "production";
