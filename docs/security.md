# Security Overview

## Security Principles
- Enforce backend controls first.
- Minimize exposed fields.
- Validate every public read path.
- Treat alpha access controls as convenience, not trust boundary.

## Core Controls
- Supabase RLS enabled on sensitive tables.
- `attendees_public` view excludes `email` and any private notes.
- Directory endpoint queries `attendees_public` only.
- Abuse controls: unique email, honeypot, server-side validation, optional throttling.

## Alpha Password Gate
Use an optional password gate to reduce random traffic during demos. Do not treat this gate as primary security. RLS and view-based data minimization remain primary controls.

## Beta Migration
- Move to authenticated sessions with role-based access.
- Add verified organizer/staff roles.
- Add audit logging and policy regression checks in CI.
