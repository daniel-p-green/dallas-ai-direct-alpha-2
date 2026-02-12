# Product requirements document

## Problem

Organizers need real-time attendee visibility without paid directory lock-in
or email exposure risk.

## Product scope (alpha)

- QR signup flow during talk Q and A.
- Attendee insert path to secure base table.
- Public directory reads from `attendees_public` only.
- Aggregates for room count and AI comfort distribution.

## Hero moment requirements

- Attendee completes signup in about 30 seconds.
- Room board updates within 5 seconds.
- Board shows only safe public fields.
- Email never appears in public output.

## Functional requirements

1. System stores required fields: `name`, `email`.
2. System stores optional fields: `linkedin_url`, `title`, `company`.
3. System stores required structured fields:
   - `ai_comfort_level` as integer `1..5`
   - `help_needed` as `text[]`
   - `help_offered` as `text[]`
4. System stores optional free-text fields:
   - `other_help_needed`
   - `other_help_offered`
5. System treats `email` as sensitive.
6. Public UI reads from `attendees_public` only.
7. Insert path writes to `attendees`.
8. System displays aggregate metrics without private fields.

## Non-functional requirements

- Security-first backend controls with RLS.
- Demo-ready reliability under moderate live traffic.
- Auditability of policy behavior and test evidence.

## Skills used

- Scanned `~/.openclaw/skills` and found `antfarm-workflows/SKILL.md`.
- No PRD-specific skill exists there today.
- Applied repository requirements standards directly.