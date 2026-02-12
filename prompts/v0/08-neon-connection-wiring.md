# Step 8 – Neon Connection Wiring (Minimal and Safe)

## Objective
Wire the app to Neon Postgres for anonymous-safe reads and controlled inserts without changing schema or RLS policy design.

## Guardrails (Non-Negotiable)
- Do not modify schema or migrations.
- Do not modify RLS SQL.
- Do not place Neon database credentials in client code.
- Keep public reads constrained to `attendees_public` shape.
- Keep insert path server-side through Next.js route handlers.
- Do not add OAuth/SSO in this step.

## Paste into v0

```text
Wire Neon connection for Dallas AI Direct Alpha with strict security boundaries.

Requirements:
- Add a minimal `lib/neon` helper for server runtime usage via:
  - NEON_DATABASE_URL
  - NEON_DATABASE_URL_READONLY (optional)
- Route all read/write calls through server-side handlers.
- Never expose Neon connection strings in client components.
- Room board data path must read only from attendees_public projection.
- Signup insert path must target attendees insert flow consistent with docs.
- Keep UI behavior unchanged except data wiring.
- Add concise error states with no raw stack traces.

Output:
- minimal Neon server wiring
- room board read integration shape
- signup submit integration shape
- no schema/auth redesign
```

## Regression checks
- Environment variables resolve cleanly.
- No Neon credentials appear in the client bundle.
- Room path references `attendees_public` only.
- No email rendered publicly.
- Existing UI tests still pass.
