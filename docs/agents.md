# agents.md (docs)

## Folder Purpose
Maintain product, architecture, security, and roadmap documentation for the alpha.

## Output Standards
- Use concise enterprise language.
- Include tables for decisions, risks, and controls.
- Link related documents explicitly.

## Update Rules
- Keep PRD, JTBD, user stories, and use cases aligned.
- Update `docs/PLAN.md` when delivery sequence changes.
- Update `docs/security.md` and `docs/rls-policies.md` together.

## Security Rules
- Never expose `email` in examples, screenshots, or payload samples.
- Directory reads only from `attendees_public`.
- Document RLS as primary control.

## Skills Usage Instructions
- Discover environment skills through local skills directories or platform tooling.
- Apply task-specific skills for markdown doc generation, threat modeling, Supabase RLS patterns, and demo runbooks.
- Cite applied skill names in doc change notes.

## Definition of Done
- Docs provide executable guidance.
- Security controls are explicit and testable.
- Cross-doc contradictions do not exist.
