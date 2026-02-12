# Supabase RLS policies and public view SQL

## Schema and view

```sql
create extension if not exists pgcrypto;

create table if not exists public.attendees (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null,
  linkedin_url text,
  title text,
  company text,
  ai_comfort_level int not null check (ai_comfort_level between 1 and 5),
  help_needed text[] not null default '{}',
  help_offered text[] not null default '{}',
  other_help_needed text,
  other_help_offered text,
  honeypot text not null default ''
);

create unique index if not exists attendees_email_unique_idx
  on public.attendees (lower(email));

create index if not exists attendees_created_at_idx
  on public.attendees (created_at desc);

create or replace view public.attendees_public as
select
  id,
  created_at,
  name,
  linkedin_url,
  title,
  company,
  ai_comfort_level,
  help_offered
from public.attendees;
```

## Enable RLS

```sql
alter table public.attendees enable row level security;
```

## Deny-by-default policy posture

Do not create broad allow policies.
Add only the explicit policies below.

## Insert policy for anon and authenticated

```sql
create policy attendees_insert_anon_auth
on public.attendees
for insert
to anon, authenticated
with check (
  honeypot = ''
  and position('@' in email) > 1
  and char_length(name) > 0
  and ai_comfort_level between 1 and 5
);
```

## Select policy design for direct table reads

```sql
-- Intentionally omit select policies for anon/authenticated users
-- on public.attendees to block direct table reads.
```

## Optional admin/staff select policy

```sql
create policy attendees_select_admin_or_staff
on public.attendees
for select
to authenticated
using (
  auth.jwt() ->> 'role' in ('admin', 'staff')
);
```

## View grants and table revocation

```sql
grant select on public.attendees_public to anon, authenticated;
revoke all on public.attendees from anon, authenticated;
```

## Alpha pattern (explicit)

- UI reads directory data only from `attendees_public`.
- Inserts go to `attendees`.
- RLS remains deny-by-default on `attendees`.
- Alpha password gate is convenience only.

## Service role guidance

- Use service role only in trusted server-side code.
- Never expose service role key in frontend bundles.

## Abuse controls

- Unique email constraint blocks duplicate submissions.
- Honeypot field blocks simple bot traffic.
- Server-side validation enforces required fields and ranges.
- Optional throttling strategy:
  - Rate limit by IP and user-agent.
  - Sliding window, e.g. 5 submissions per 10 minutes per IP.
  - Temporary blocklist for repeated abuse signatures.

## Skills used

- Scanned `~/.openclaw/skills` and found `antfarm-workflows/SKILL.md`.
- No Supabase/RLS-specific skill exists there today.
- Applied repository RLS standards directly.