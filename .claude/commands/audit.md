Perform a focused MVP readiness audit for this repository.

Read first:
- `CLAUDE.md`
- `.claude/context.md`
- `PROJECT_INDEX.md`
- `README.md`
- `src/App.tsx`
- `supabase/migrations/*.sql`
- `supabase/functions/**/index.ts`

Then produce `docs/MVP_AUDIT.md` with exactly these sections:
1. FEATURES ALREADY WORKING
2. SCAFFOLDED BUT INCOMPLETE
3. MISSING FOR MVP
4. CUT LIST (hide/guard only, do not delete)

Rules:
- cite file paths for each finding
- prioritize end-to-end behavior over UI-only checks
- do not modify code during this audit
