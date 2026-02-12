# Privacy and Consent (Alpha)

## Data collected

- `name`
- `linkedin_url`
- `email` (sensitive)
- `ai_comfort_level`
- `help_needed`
- `help_offered`

## Purpose limitation

- Use attendee data to support live room visibility and community matching during the event.
- Do not use attendee data for unrelated marketing in alpha.
- Keep processing limited to documented product workflows.

## Who can see what

| Data field | Public room view (`attendees_public`) | Internal table (`attendees`) |
| --- | --- | --- |
| name | Yes | Yes |
| linkedin_url | Yes | Yes |
| email | No | Yes |
| ai_comfort_level | Yes | Yes |
| help_needed | Yes | Yes |
| help_offered | Yes | Yes |

Directory reads must come from `attendees_public` only.

## Retention assumption for alpha

- Keep alpha data only for short-term pilot evaluation.
- Default target: review and purge within 30 days after the event unless explicit extension is approved.
- Keep retention behavior documented per event run.

## Opt-out and deletion process for alpha

1. Attendee requests deletion through organizer channel.
2. Operator verifies requester control of submitted email.
3. Operator deletes attendee row from `attendees`.
4. Operator confirms removal from `attendees_public`-based directory.
5. Operator logs deletion event without exposing sensitive values.

## Skills used

- manual policy update from user direction (no additional local skill file applied in this edit)
