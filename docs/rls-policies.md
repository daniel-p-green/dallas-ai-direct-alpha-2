# Supabase RLS policies and public view SQL

## Schema and view

```sql
create extension if not exists pgcrypto;

create table if not exists public.attendees (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 120),
  title text,
  company text,
  linkedin_url text,
  email text not null,
  ai_comfort_level text not null check (
    ai_comfort_level in ('Beginner','Intermediate','Advanced','Expert')
  ),
  help_needed text[] not null default '{}',
  help_offered text[] not null default '{}',
  honeypot text not null default ''
);

create unique index if not exists attendees_email_unique_idx
  on public.attendees (lower(email));

create or replace view public.attendees_public as
select
  id,
  created_at,
  name,
  title,
  company,
  linkedin_url,
  ai_comfort_level,
  help_offered
from public.attendees;
```

## Enable RLS

```sql
alter table public.attendees enable row level security;
```

## Deny-by-default policy posture

Create no broad allow policies. Add only explicit policies below.

## Insert policy for anon/auth with validation

```sql
create policy attendees_insert_anon_auth
on public.attendees
for insert
to anon, authenticated
with check (
  honeypot = ''
  and position('@' in email) > 1
  and char_length(name) > 0
);
```

## No direct public selects from `attendees`

Do not create select policies for `anon` or `authenticated` on
`public.attendees`.

## Optional staff select policy for beta

```sql
create policy attendees_select_staff_only
on public.attendees
for select
to authenticated
using (auth.jwt() ->> 'role' = 'staff');
```

## View access

```sql
grant select on public.attendees_public to anon, authenticated;
revoke all on public.attendees from anon, authenticated;
```

## Alpha pattern (explicit)

- UI reads only from `attendees_public`.
- Inserts go to `attendees`.
- RLS remains deny-by-default on `attendees`.
- Optional password gate remains convenience only.

## Target state and test expectation

- Keep all public directory reads on view-only paths.
- Treat any direct table read in app code as release-blocking.
- Enforce this with policy and privacy leak tests.

## Abuse controls

- Unique email constraint blocks duplicate submissions.
- Honeypot field blocks simple bots.
- Server-side validation enforces required fields and ranges.
- Optional throttling strategy:
  - Rate limit by IP and user-agent.
  - Sliding window: 5 submissions per 10 minutes per IP.
  - Temporary blocklist for repeated abuse signatures.

## Skills used

- Scanned `~/.openclaw/skills` and found `antfarm-workflows/SKILL.md`.
- No Supabase/RLS-specific skill exists there today, so this file applies
  repository RLS standards directly.