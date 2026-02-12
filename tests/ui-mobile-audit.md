# UI Mobile Audit (Manual)

Use this checklist on iPhone Safari and Android Chrome.
Target viewport: 375px width.

1. Scan QR code and confirm it opens `/signup`.
2. Confirm `/signup` has no horizontal scroll at 375px width.
3. Confirm email helper text is visible near the form submit area.
4. Confirm consent checkbox defaults to unchecked.
5. Submit a valid signup and confirm submit works.
6. Confirm redirect or clear navigation button to `/room` works.
7. Confirm `/room` shows newest entries first.
8. Confirm `/room` shows `Updated Xs ago`.
9. Confirm LinkedIn icon is visible and clickable.
10. Confirm no email appears anywhere on `/room`.

## Playwright audit

Automated companion test exists at `tests/ui-mobile-audit.spec.ts`.
