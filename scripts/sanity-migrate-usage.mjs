// This script migrates legacy `hoursOrMileage` string values into the structured
// `usage` object: { value: number, unit: 'miles'|'hours' }
// It does NOT run automatically. Provide SANITY_WRITE_TOKEN in your environment
// before running: `SANITY_WRITE_TOKEN=sk... node scripts/sanity-migrate-usage.mjs`

/*
Notes:
- The script expects `hoursOrMileage` to be a string like "1234 miles" or "500 hours".
- If parsing fails, it will log the document and skip it.
- Optionally set `DRY_RUN=true` to only print patches without applying them.
*/

import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN
if (!projectId || !token) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN in env. Aborting.');
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: '2024-01-01', useCdn: false, token })

const DRY_RUN = process.env.DRY_RUN === 'true'

async function parseHoursOrMileage(str) {
  if (!str) return null;
  const m = String(str).trim().toLowerCase().match(/([\d,\.]+)\s*(miles|mile|hours|hour)?/);
  if (!m) return null;
  const rawVal = m[1].replace(/,/g, '');
  const val = Number(rawVal);
  if (isNaN(val)) return null;
  const unitRaw = m[2] || '';
  const unit = unitRaw.startsWith('hour') ? 'hours' : 'miles';
  return { value: val, unit };
}

async function run() {
  console.log('Fetching inventory docs...')
  const docs = await client.fetch(`*[_type == "inventory" && defined(hoursOrMileage)]{_id, _rev, hoursOrMileage, usage}`)
  console.log(`Found ${docs.length} docs with hoursOrMileage defined.`)

  for (const doc of docs) {
    const parsed = await parseHoursOrMileage(doc.hoursOrMileage)
    if (!parsed) {
      console.warn('Could not parse hoursOrMileage for', doc._id, doc.hoursOrMileage)
      continue
    }

    const patch = { usage: parsed }
    if (!DRY_RUN) {
      try {
        console.log('Patching', doc._id, '=>', patch)
        await client.patch(doc._id).set(patch).unset(['hoursOrMileage']).commit({ ifRevisionID: doc._rev })
      } catch (err) {
        console.error('Patch failed for', doc._id, err)
      }
    } else {
      console.log('[DRY RUN] Would patch', doc._id, '=>', patch)
    }
  }

  console.log('Done.')
}

run().catch((err) => { console.error(err); process.exit(1) })
