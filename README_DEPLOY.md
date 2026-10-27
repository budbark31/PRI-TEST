Deployment & QA Checklist

1. Local dev Redis (optional but recommended for rate limiting)

- Using Docker:

```bash
docker compose up -d redis
# or
docker run -d --name pri-redis -p 6379:6379 redis:7-alpine
```

- Verify:

```bash
node scripts/redis-smoke.mjs
```

2. Sanity migration

- The migration to convert `hoursOrMileage` -> `usage` has been prepared and applied in this workspace.
- To preview (dry-run):

```bash
DRY_RUN=true node scripts/sanity-migrate-usage.mjs
```

- To run (requires `SANITY_WRITE_TOKEN` in env):

```bash
node scripts/sanity-migrate-usage.mjs
```

3. Forms

- The truck "Email Sales" form and the mailing list signup are Netlify Forms, defined in `public/__forms.html`.
- In Netlify: Forms → enable form detection, then add an email notification for each form.
- Submissions are under Forms in the Netlify dashboard; the mailing list exports as CSV.

4. CI / Build

- A GitHub Actions workflow is included at `.github/workflows/ci.yml` that runs install, build, typecheck, and lint.

5. Production environment

- Copy `.env.production.example` to `.env.production` and populate real secrets.
- Ensure `REDIS_URL` is set for production if you want cross-instance rate limiting.

6. Notes

- The middleware rate limiter defaults to using Redis when `REDIS_URL` is present; otherwise falls back to an in-memory Map (single-instance only).
- The Sanity migration has been applied to the dataset referenced by `.env.local`.

