# Product Requirements Document

## Problem
Organizers need real-time attendee visibility without relying on paid directory access or exposing attendee emails.

## Product Scope (Alpha)
- QR signup flow.
- Attendee insertion into secure table.
- Public directory read via `attendees_public`.
- Metrics: attendee count and AI comfort distribution.

## Functional Requirements
1. System stores fields: `name`, `linkedin_url`, `email`, `ai_comfort_level`, `help_needed`, `help_offered`.
2. System treats `email` as sensitive.
3. Public UI reads from `attendees_public` only.
4. System inserts attendee records into `attendees`.
5. System displays aggregate metrics without exposing private data.

## Non-Functional Requirements
- Security-first backend controls with RLS.
- Demo-ready reliability under moderate live traffic.
- Auditability of policy behavior.
