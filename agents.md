# agents.md (Root)

## Folder Purpose
Define global delivery standards for Dallas AI Direct Alpha repository outputs.

## Output Standards
- Use enterprise tone.
- Use active voice only.
- Use structured bullets and tables.
- Keep requirements testable.
- Keep docs implementation-ready.

## Update Rules
- Update docs and tests in the same change when requirements shift.
- Preserve security invariants.
- Add change rationale in commit message body.

## Security Rules
- Never expose `email` in any public view or response.
- Directory reads only from `attendees_public`.
- Enforce Supabase RLS on sensitive tables.
- Treat password gate as convenience layer only.
- Do not store secrets in repo.

## Skills Usage Instructions
- Discover skills from local OpenClaw skill directories in this environment.
- Use relevant skills for repo scaffolding, markdown standards, threat modeling, test planning, and operational runbooks.
- Reference the applied skill names in updated docs or PR notes.
- Prefer the most specific skill for each task.

## Definition of Done
- Security docs include concrete RLS SQL.
- Test plans cover privacy leak prevention and abuse controls.
- Runbook supports timed live demo execution.
- All required files exist and remain internally consistent.
