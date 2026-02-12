# Asset and Icon Policy

## Approved icon usage

Use lightweight, open icon assets for UI indicators in alpha.

Approved categories:
- Privacy lock icon
- LinkedIn glyph icon
- Status/check icon
- Info tooltip icon

Rules:
- Use icons from permissive licenses only.
- Keep icon stroke and size consistent.
- Keep icon color restrained for projector readability.

## LinkedIn icon policy

- Show icon only on room board.
- Open in new tab.
- Include `aria-label` for accessibility.
- Do not display raw LinkedIn URL text.

## Fallback strategy

If the preferred icon set fails:
1. Use inline SVG fallback in the component.
2. Use Unicode/text fallback as last resort.
3. Keep behavior and accessibility labels unchanged.

## Security and privacy guardrails

- Never use icons or badges that imply false compliance claims.
- Never expose email through tooltip, title attribute, or hidden text.
- Keep public text aligned with projection boundary language.

## Non-endorsement

This repository references Geist-style conventions for design direction.
It does not claim official endorsement by Vercel or Geist.

## Skills used

- Source: `~/.openclaw/skills`
- Applied: `verification-before-completion`
- Notes: Used to keep asset policy concise and audit-friendly.
