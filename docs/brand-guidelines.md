# Brand Guidelines (Dallas AI Primary, Geist Implementation)

This document defines the minimum brand rules for Dallas AI Direct Alpha demo assets. Dallas AI branding leads every demo surface. The team uses Geist-style conventions for implementation clarity and restraint. We do not claim official Vercel endorsement, partnership, or certification.

## Typography

Use a clean sans-serif stack and keep hierarchy explicit.

- **Primary family:** `"Geist", "Inter", "SF Pro Text", "Segoe UI", sans-serif`
- **Body size:** 16px default
- **Line height:** 1.5 for body, 1.2 to 1.3 for headings
- **Scale:**
  - H1: 36px / 700
  - H2: 28px / 650
  - H3: 22px / 600
  - Body: 16px / 400
  - Caption: 14px / 400

Rules:
- Keep headings short and action-oriented.
- Use sentence case for labels and helper text.
- Avoid decorative display fonts in demo-facing screens.

## Spacing

Use a 4px base grid to keep layouts predictable.

- **Base unit:** 4px
- **Core spacing tokens:** 4, 8, 12, 16, 24, 32, 48
- **Card padding:** 16px minimum, 24px preferred for desktop
- **Section spacing:** 32px between major blocks

Rules:
- Align related controls on the same baseline.
- Keep form groups within one spacing step of neighboring content.
- Reserve 48px top spacing before hero headers on public pages.

## Color Usage

Use neutral-first palettes with one accent for stateful actions.

- **Background:** near-white (`#FAFAFA`) or black (`#000000`) depending on theme
- **Primary text:** high-contrast neutral (`#111111` on light, `#F5F5F5` on dark)
- **Secondary text:** muted neutral (`#666666` on light, `#A3A3A3` on dark)
- **Accent:** one controlled brand accent for CTAs and active states
- **Status colors:** semantic red/yellow/green only for system feedback

Rules:
- Meet WCAG AA contrast at minimum for all text and interactive elements.
- Do not use color as the only signal; pair with icon or label.
- Limit gradient usage to hero accents only.

## Icon Rules

Use simple, stroke-consistent icons with predictable semantics.

- Prefer a single approved icon set across a screen.
- Use 16px icons inline with text and 20 to 24px in cards/buttons.
- Keep stroke weight visually consistent across icon pairs.
- Place icons before labels when indicating action.

Rules:
- Do not mix filled and outlined variants in the same control group.
- Do not use branded third-party logos unless legal approval exists.
- Preserve whitespace around icons; avoid tight visual crowding.

## Logo System

Use Dallas AI logo assets as the primary visual brand signal.

- **Primary logo asset:** `public/brand/dallas-ai-logo-color.png`
- **Inverse logo asset:** `public/brand/dallas-ai-logo-white.png`
- **Minimum rendered width:** 120px for desktop and 96px for mobile
- **Clear space:** keep at least 16px clear space around all sides
- **Required placements:** app shell header, demo hero, and key runbook screenshots

Rules:
- Use the color logo on light backgrounds.
- Use the white logo on dark backgrounds.
- Keep original aspect ratio; do not stretch or crop.
- Do not add shadows, glows, color overlays, or effects.
- Keep Dallas AI logo visually dominant over framework styling cues.

## Accessibility Guardrails

Design every demo artifact for readability, keyboard use, and privacy trust.

- Verify keyboard focus states are visible and persistent.
- Provide clear labels for all form controls and status messages.
- Support zoom up to 200% without losing task completion paths.
- Ensure motion effects are subtle and can be reduced.

Privacy guardrail:
- Attendee email never appears in any public-facing UI, including room boards, hero counters, and shared screenshots.

Messaging guardrail:
- Reference Geist-style conventions as inspiration only; do not present the system as officially endorsed by Vercel.

## Skills used

- Source scan attempted: `~/.openclaw/skills` (directory not present in current environment)
- Applied: repository `agents.md` standards and testable requirement style
