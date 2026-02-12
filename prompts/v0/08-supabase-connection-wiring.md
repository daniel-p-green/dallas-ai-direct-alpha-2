# Step 8 – Supabase Connection Wiring (Minimal and Safe)

## Objective
Wire the app to Supabase for anonymous-safe reads and controlled inserts without changing schema or RLS policy design.

## Guardrails (Non-Negotiable)
- Do not modify schema or migrations.
- Do not modify RLS SQL.
- Do not use service role key in browser code.
- Keep public reads constrained to `attendees_public` shape.
- Keep insert path server-side or constrained client-side per current alpha docs.
- Do not add OAuth/SSO in this step.

## Paste into v0

```text
Wire Supabase connection for Dallas AI Direct Alpha with strict security boundaries.

Requirements:
- Add a minimal `lib/supabase` helper for browser-safe client usage via:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
- Add server-safe helper if needed for server routes only.
- Never use SUPABASE_SERVICE_ROLE_KEY in client components.
- Room board data path must read only from attendees_public projection.
- Signup insert path must target attendees insert flow consistent with docs.
- Keep UI behavior unchanged except data wiring.
- Add concise error states with no raw stack traces.

Output:
- minimal Supabase client wiring
- room board read integration shape
- signup submit integration shape
- no schema/auth redesign
```

## Regression checks
- Environment variables resolve cleanly.
- No service role usage in client bundle.
- Room path references `attendees_public` only.
- No email rendered publicly.
- Existing UI tests still pass.
