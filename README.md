# Dallas AI Direct Alpha

Secure, community-owned attendee directory for Dallas AI Direct talks. This alpha replaces paid Meetup directory access for in-room visibility while protecting attendee privacy.

## Business Case and ROI Math

Dallas AI Meetup has 10,000+ members. Meetup directory access introduces paid dependency for organizer outcomes.

| Variable | Low | High |
|---|---:|---:|
| Paying members | 1,000 (10%) | 1,000 (10%) |
| Annual fee per member | $3 | $5 |
| Annual gross spend | $3,000 | $5,000 |
| Event cadence multiplier (12 events/yr equivalent value) | 12x | 12x |
| Annualized value at scale | $36,000 | $60,000 |

This alpha demonstrates a lower-cost and higher-control alternative using v0 + Supabase.

## Architecture Overview

- **Frontend:** Next.js app (v0-generated UI can plug in here).
- **Backend:** Supabase Postgres + Supabase Auth.
- **Core tables:** `attendees`.
- **Public read model:** `attendees_public` view.
- **Live demo flow:** QR code -> signup form -> insert into `attendees` -> room directory reads `attendees_public` only.

## Security Overview (RLS First)

- Enable Row Level Security on all sensitive tables.
- Treat `email` as sensitive data.
- Store private data in base table.
- Expose public directory fields through `attendees_public` view only.
- Never read directory from `attendees` directly.
- Documented policy SQL lives in `docs/rls-policies.md`.

## Demo Flow

1. Speaker presents QR code during Q and A.
2. Attendee opens form and submits profile + preferences.
3. System inserts into `attendees`.
4. Live room dashboard updates from `attendees_public`.
5. Dashboard shows count and AI comfort distribution.
6. Dashboard never shows `email`.

## Local Run

1. Install dependencies:
   - `npm install`
2. Configure environment:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server use only)
3. Apply SQL docs to Supabase project:
   - `docs/data-model.md`
   - `docs/rls-policies.md`
4. Start app:
   - `npm run dev`

## Extend with Skills (Canonical)

This repository uses environment skills as the canonical extension mechanism.

1. Discover available skills:
   - Inspect local skills directory under OpenClaw skill paths.
   - Use available OpenClaw tooling to list/load skills.
2. Select task-specific skill before major edits.
3. Record which skill informed changes in PR notes and commit body.
4. Follow folder-level `agents.md` instructions in:
   - `/agents.md`
   - `/docs/agents.md`
   - `/tests/agents.md`
   - `/ops/agents.md`

## Repo Structure

- `docs/` product, security, privacy/consent, architecture, roadmap, runbook
- `tests/` markdown test plans
- `ops/` checklists and incident response

