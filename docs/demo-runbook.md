# Timed Demo Runbook

## Objective
Prove secure live onboarding and room visibility without exposing email.

## T-30 Minutes Checklist
- Verify RLS enabled.
- Verify `attendees_public` excludes email.
- Verify directory UI queries `attendees_public` only.
- Verify fallback polling path.

## 12-Minute Flow
1. Explain business problem and security requirement.
2. Show architecture with RLS and public view separation.
3. Display initial room dashboard.
4. Trigger live QR signup during Q and A.
5. Show room count and AI comfort distribution updates.
6. Show public payload sample without email.
7. Close with risk controls and beta plan.

## Fallback Steps
- Switch realtime to polling.
- Use backup network.
- Continue with sanitized sample dataset if live writes fail.
