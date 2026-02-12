# UI Patterns (Geist-Style Conventions)

This document defines reusable UI patterns for Dallas AI Direct Alpha.
The team references Geist-style conventions for clarity and consistency.
This project does not claim official endorsement by Vercel or Geist.

## Hero Banner Pattern

Purpose:
- Frame the problem, boundary model, and call to action in one viewport.

Structure:
- Eyebrow: `ALPHA DEMO`
- Title: one sentence outcome
- Subtext: privacy boundary statement
- CTA row: `Join via QR`, `View Room Board`

Rules:
- Keep heading weight medium or semibold for projector readability.
- Keep line length short.
- Keep contrast high.

## QR Signup Card Pattern

Purpose:
- Collect required data quickly with low friction.

Structure:
- Required fields first: name, email, comfort, help arrays.
- Optional fields grouped under "Optional profile".
- Consent row near title/company.
- Privacy note adjacent to submit button.

Rules:
- Keep inline validation concise.
- Keep helper text calm and precise.
- Never display submitted email after submit.

## Public Room Board Pattern

Purpose:
- Answer "Who is in the room?" using public-safe fields.

Structure:
- Header: board title, badge `Public view – emails excluded`, updated timestamp.
- Metrics row: total count, comfort summary, high-comfort percentage.
- List row: newest-first entries.

Rules:
- Read only from `attendees_public` projection.
- Keep layout static and non-jittery.
- Use soft tint only for just-joined indicator.
- Show LinkedIn as icon only.

## Privacy Notice Row Pattern

Purpose:
- Reinforce privacy boundary where user decisions occur.

Canonical text:
- `Email stays private and never appears on the public board.`

Rules:
- Use this exact intent on signup and nearby public board context.
- Avoid legal/compliance claims.
- Avoid external endorsement claims.

## Skills used

- Source: `~/.openclaw/skills`
- Applied: `webapp-testing`, `verification-before-completion`
- Notes: Used to standardize deterministic UI checks and delivery rules.
