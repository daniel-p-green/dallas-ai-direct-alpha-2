# Plan of Record: Dallas AI Direct Alpha

## Goal
Deliver a secure, low-friction attendee directory experience that answers "Who is in the room?" in near real time without exposing emails.

## Hero Moment
Attendees scan a QR code during Q and A, complete signup, and appear on the live room dashboard within seconds with aggregate room metrics.

## Audience and Stakes
- Primary audience: CISOs, security leaders, and technical decision makers.
- Stakes: privacy trust, live demo reliability, and enterprise adoption confidence.

## Non-goals
- Full CRM replacement.
- Advanced social networking features.
- Multi-event analytics warehouse.

## Minimal Steps
1. Create data model with sensitive field separation.
2. Enable RLS and implement deny-by-default policies.
3. Create `attendees_public` view excluding email.
4. Build QR signup write path into `attendees`.
5. Build directory read path from `attendees_public` only.
6. Add basic abuse controls and rehearsed demo fallback.

## Key Decisions
| Decision | Choice | Rationale |
|---|---|---|
| Data store | Supabase Postgres | Strong RLS and fast setup |
| Security model | RLS-first | Enforce backend access control |
| Public reads | `attendees_public` view | Prevent accidental email leakage |
| Alpha access | Optional password gate | Convenience only, not primary security |

## Failure Modes and Pivots
- Realtime lag -> switch to short polling.
- QR traffic spike -> enable throttling and staff-assisted check-in.
- RLS test failure -> stop demo and use sanitized static data.

## Tomorrow Morning Timebox (CST)
- 07:30-08:00 Security preflight and RLS verification.
- 08:00-08:30 QR flow rehearsal.
- 08:30-09:00 Live dashboard and metric checks.
- 09:00-09:20 Failure-path rehearsal.
- 09:20-09:40 Go/no-go review.
