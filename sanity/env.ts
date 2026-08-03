export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

const envProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const envDataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const isProd = process.env.NODE_ENV === "production";

if (isProd && (!envProjectId || !envDataset)) {
	throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET");
}

// Fallback values keep local development working when .env.local is missing.
export const projectId = envProjectId || "72zzspuo";
export const dataset = envDataset || "production";

export const useCdn = isProd;
