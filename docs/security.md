# Security overview

## Security principles

- Enforce backend controls first.
- Minimize exposed fields by default.
- Validate every public read path.
- Treat alpha access controls as convenience, not trust boundary.

## Primary control plane

- Supabase RLS enforces data access in the database.
- `attendees_public` excludes `email` and other private fields.
- UI reads directory data from `attendees_public` only.
- Inserts go to `attendees` with validation.

## Abuse controls

- Unique index on normalized email.
- Honeypot field must remain empty.
- Server-side validation for schema and range checks.
- Optional throttling by IP and user-agent.

## Alpha password gate

Use an optional password gate to reduce random traffic during demos.
Treat this gate as convenience only. Keep RLS and view-based data
minimization as primary controls.

## Service role usage

- Use service role key only in trusted server runtime.
- Never expose service role key to browser clients.
- Restrict privileged operations to server-side code paths.

## Beta migration

- Move to authenticated sessions with role-based access.
- Add verified organizer and staff roles.
- Add policy regression tests in CI.
- Add optional SSO for enterprise admins.

## STRIDE threat model (alpha)

| Threat | Example | Primary control | Evidence |
| --- | --- | --- | --- |
| Spoofing | Bot submits fake attendee | Honeypot + validation + optional auth in beta | Abuse tests |
| Tampering | Client alters payload shape | Server-side validation + DB constraints | API tests |
| Repudiation | User denies action | Server logs and event timestamps | Observability tests |
| Information Disclosure | Email leaks in public view | `attendees_public` + RLS deny-by-default | Privacy leak tests |
| Denial of Service | Signup flood during talk | Rate limits + fallback flow | Load tests |
| Elevation of Privilege | Non-admin reads base table | No public select policy on `attendees` | RLS policy tests |

## Skills used

- Scanned `~/.openclaw/skills` and found `antfarm-workflows/SKILL.md`.
- No dedicated security/threat-model skill exists there today.
- Applied repository security standards directly.