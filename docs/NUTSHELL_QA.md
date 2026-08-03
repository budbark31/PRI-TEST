Nutshell QA Checklist

1. Purpose

Verify Nutshell embed and hCaptcha behavior on a production-like host.

2. Quick steps (local)

- Start a tunnel (ngrok) pointing to your local Next.js dev server:

```
ngrok http 3000
```

- Set `NEXT_PUBLIC_SITE_URL` to the ngrok URL in `.env.local` and restart dev server.

- Visit the page with the Nutshell form (inventory page or signup popover) and observe:
  - No hCaptcha console errors on initial load (forms deferred/click-to-load should avoid this).
  - Sales form loads after clicking "Load Sales Form".
  - Form submission completes; check Nutshell dashboard for received leads.

3. Notes

- hCaptcha behavior may still differ on custom domains due to provider configuration.
- If you see hCaptcha warnings, ensure the embedded script is not mounted while hidden.

4. Commands

```
# run dev server
npm run dev
# open ngrok (install first)
ngrok http 3000
```

5. Troubleshooting

- If the embed loads but the form doesn't submit, inspect network tab for blocked requests and check `NUTSHELL_API_KEY` in env.
- For production testing, set `NEXT_PUBLIC_SITE_URL` to the real domain before testing.
