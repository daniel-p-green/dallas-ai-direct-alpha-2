# UI Patterns (Geist-Style Conventions)

This document defines reusable UI patterns for Dallas AI Direct Alpha demo surfaces.
The team references Geist-style conventions for consistency and clarity.
This project does not claim official endorsement by Vercel or Geist.

## Hero Banner

### Purpose
Set context in one viewport and direct the attendee to the next action.

### Required Content
- Eyebrow label: `ALPHA DEMO`
- Outcome-focused headline (single sentence)
- Supporting line that states public and private data boundaries
- Primary action: `Join via QR`
- Secondary action: `View Room Board`

### States
- Default: headline and both actions visible
- Compact: headline and primary action remain visible on narrow screens

### Do / Don't
- Do keep headline concise and readable from projector distance.
- Do keep high text contrast against the background.
- Do keep copy in active voice.
- Don't introduce promotional claims or endorsement language.
- Don't include attendee email or any private field in banner content.

## QR Signup Card

### Purpose
Collect required attendee inputs quickly while preserving privacy boundaries.

### Required Content
- Required inputs: name, email, comfort level, help-offer arrays
- Optional inputs grouped under `Optional profile`
- Consent acknowledgment near title and company fields
- Privacy note next to submit action

### States
- Empty: required fields visible, submit disabled until required fields are valid
- Validation error: concise inline guidance for the affected field
- Submitting: loading indicator with controls locked
- Success: confirmation message without exposing private fields

### Do / Don't
- Do place required fields before optional fields.
- Do keep validation text brief and action-oriented.
- Do state privacy constraints near submission.
- Don't request non-essential data for demo scope.
- Don't render submitted email in any success or follow-up UI.

## Public Room Board

### Purpose
Show who is in the room using only public-safe attendee data.

### Required Content
- Header title for the room board
- Badge: `Public view - emails excluded`
- Last-updated timestamp
- Metrics row: total attendees, comfort summary, high-comfort rate
- Attendee list sorted newest first

### States
- Empty: zero-state message and prompt to join via QR
- Populated: metrics and attendee rows visible
- Refreshing: subtle status indicator without layout shift

### Do / Don't
- Do read only from the public projection (`attendees_public`).
- Do keep row height stable to prevent visual jitter.
- Do represent LinkedIn with icon-only treatment when present.
- Don't include private identifiers, including email.
- Don't infer or display data that users did not provide.

## Privacy Notice Row

### Purpose
Reinforce privacy behavior where users make data-entry decisions.

### Required Content
- Canonical message: `Email stays private and is never displayed publicly on the room board.`
- Optional short link to privacy documentation

### States
- Inline default: visible under signup actions
- Contextual repeat: visible near public board entry points

### Do / Don't
- Do keep the message plain, direct, and consistent across surfaces.
- Do preserve meaning if wording is shortened for layout.
- Don't add legal guarantees beyond implemented behavior.
- Don't reference third-party endorsement or certification.
