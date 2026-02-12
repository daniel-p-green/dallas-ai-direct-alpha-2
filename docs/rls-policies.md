# Supabase RLS Policies and Public View SQL

## Schema and view

```sql
create extension if not exists pgcrypto;

create table if not exists public.attendees (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 120),
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
  linkedin_url,
  ai_comfort_level,
  help_needed,
  help_offered
from public.attendees;
```

## Enable RLS

```sql
alter table public.attendees enable row level security;
```

## Deny-by-default posture

Create no broad allow policies. Add only explicit policies below.

## Insert policy (anon/auth) with honeypot check

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

## No direct select from attendees for anon/auth

Do not create `for select` policy for `anon` or `authenticated` on `public.attendees`.

## Optional staff read policy (future beta)

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

## Strict target state and alpha note

- Target state: public select works only through `attendees_public`.
- Target state: no direct table read for public clients.
- Alpha may use transitional wiring in application code.
- Test plan must still enforce target-state assertions.

## Abuse controls

- Unique email constraint blocks duplicate spam by exact email.
- Honeypot field blocks unsophisticated bots.
- Server-side validation enforces required fields and value ranges.
- Optional throttling strategy:
  - Edge function or API route rate limits by IP and user-agent.
  - Sliding window: 5 submissions per 10 minutes per IP.
  - Temporary blocklist for repeated abuse signatures.

## Skills used

- manual policy update from user direction (no additional local skill file applied in this edit)
