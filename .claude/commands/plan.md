Read `.claude/context.md` and the active sprint backlog in `.claude/sprints/`.

Then:
1. State the active sprint and next actionable story ID.
2. Produce a concrete implementation plan with files to edit, data contracts, and verification steps.
3. Identify assumptions and unknowns that require code inspection before changes.
4. Wait for confirmation before making edits.

Constraints:
- Keep the plan MVP-first and end-to-end.
- Prefer smallest useful slice over broad refactors.
- Respect role-based access and Supabase RLS invariants.
