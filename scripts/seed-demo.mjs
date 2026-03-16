import fs from "node:fs";
import path from "node:path";
import { createClient } from "next-sanity";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim().replace(/^"|"$/g, "");
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const root = process.cwd();
loadEnvFile(path.join(root, ".env.local"));
loadEnvFile(path.join(root, ".env"));

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-02-08";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Missing required env vars: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const TRUCK_MAKES = ["Kenworth", "Peterbilt", "Mack", "Ford", "Freightliner", "International"];
const TRUCK_MODELS = ["T800", "W900", "389", "T680", "Granite", "F-550", "HX"];
const TRUCK_CATEGORIES = ["dump-trucks", "day-cabs", "heavy-equipment", "trailers"];

const PART_CATEGORIES = ["engine", "transmission", "body-cab", "maintenance-filters", "accessories", "other"];
const PART_CONDITIONS = ["new", "used", "rebuilt", "core"];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildTruckDoc(index) {
  const make = randomFrom(TRUCK_MAKES);
  const model = randomFrom(TRUCK_MODELS);
  const year = randomInt(2012, 2024);
  const category = randomFrom(TRUCK_CATEGORIES);
  const title = `Demo ${make} ${model} ${year} Truck #${index + 1}`;

  return {
    _id: `demo-truck-${index + 1}`,
    _type: "inventory",
    title,
    slug: { _type: "slug", current: slugify(title) },
    status: "available",
    images: [],
    category,
    price: randomInt(35000, 195000),
    year,
    make,
    model,
    hoursOrMileage: `${randomInt(30, 180)}k miles`,
    description: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Demo listing generated for staging and layout testing.",
          },
        ],
      },
    ],
    demo: true,
  };
}

function buildPartDoc(index) {
  const category = randomFrom(PART_CATEGORIES);
  const condition = randomFrom(PART_CONDITIONS);
  const inventoryCount = randomInt(0, 18);
  const title = `Demo ${category.replace(/-/g, " ")} Part #${index + 1}`;

  return {
    _id: `demo-part-${index + 1}`,
    _type: "part",
    title,
    slug: { _type: "slug", current: slugify(title) },
    category,
    condition,
    status: inventoryCount === 0 ? "out-of-stock" : "available",
    price: randomInt(150, 8400),
    inventoryCount,
    description: "Demo listing generated for staging and layout testing.",
    images: [],
    demo: true,
  };
}

const TRUCK_COUNT = 40;
const PART_COUNT = 40;

async function run() {
  const docs = [];
  for (let i = 0; i < TRUCK_COUNT; i += 1) docs.push(buildTruckDoc(i));
  for (let i = 0; i < PART_COUNT; i += 1) docs.push(buildPartDoc(i));

  console.log(`Seeding ${TRUCK_COUNT} trucks and ${PART_COUNT} parts into ${projectId}/${dataset}...`);

  await Promise.all(docs.map((doc) => client.createOrReplace(doc)));

  console.log("Done. Demo listings created/updated.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
