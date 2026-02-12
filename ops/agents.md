# agents.md (ops)

## Folder Purpose
Provide operational checklists and incident response guidance for alpha deployment and live demo support.

## Output Standards
- Use checklist-first structure.
- Define clear ownership and escalation triggers.
- Include time-bound actions for live incidents.

## Update Rules
- Update runbook and incident response together when operational controls change.
- Keep go/no-go criteria explicit.

## Security Rules
- Never expose `email` in operational dashboards or shared logs.
- Directory reads only from `attendees_public`.
- Treat RLS validation as pre-demo gate.

## Skills Usage Instructions
- Discover environment skills locally.
- Apply skills for demo runbooks, threat modeling, and operational hardening.
- Record used skills in update notes.

## Definition of Done
- Operators can execute demo safely under time pressure.
- Incident procedures preserve privacy guarantees.
- Critical rollback steps are documented.
