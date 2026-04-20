# ReHome Claude Code Guide

## Project Identity
- App: ReHome (donation + NGO matching platform)
- Frontend: React 18 + TypeScript + Vite + Tailwind + shadcn/ui
- Backend platform: Supabase (Auth, Postgres, RLS, Storage, Edge Functions)
- Mobile: Capacitor Android shell
- Web deploy: GitHub Pages

## First-Read Files (every coding session)
1. `PROJECT_INDEX.md`
2. `README.md`
3. `src/App.tsx`
4. `supabase/migrations/` (latest SQL files)
5. `.claude/context.md`

## Working Directories
- UI components: `src/components/`
- Route pages: `src/pages/`
- Hooks: `src/hooks/`
- Utility code: `src/lib/`
- Supabase client/types: `src/integrations/supabase/`
- Edge functions: `supabase/functions/<function>/index.ts`
- SQL migrations: `supabase/migrations/`

## Current Product Direction
- Target architecture follows 3-day MVP sprint docs (donor + NGO loop first)
- Focus on end-to-end working flows over broad feature breadth
- Non-MVP features should be hidden/guarded, not deleted

## Core Invariants (do not break)
1. Keep `HashRouter` routing compatible with GitHub Pages.
2. Preserve authenticated route protection for private pages.
3. Keep TensorFlow-heavy flows lazy-loaded where practical.
4. Do not bypass Supabase RLS with client-side privileged writes.
5. Use Edge Functions for sensitive transitions and side effects.
6. Keep changes incremental and verifiable; avoid unrelated refactors.

## Data and Security Rules
- Any new table requires:
  - primary key, relevant foreign keys, useful indexes
  - RLS enabled with explicit policies
  - timestamps (`created_at`, `updated_at`) and update trigger when applicable
- Validate all user inputs at UI boundary and server/edge boundary.
- Never hardcode secrets; use env variables.
- Keep PII exposure minimal on NGO-facing surfaces.

## Frontend Standards
- Use existing shadcn/ui primitives before introducing new UI libraries.
- Prefer TanStack Query for remote data and caching.
- Keep loading, empty, and error states explicit.
- Preserve existing style direction unless task explicitly requests redesign.

## Supabase Standards
- SQL migrations use timestamped filenames under `supabase/migrations/`.
- Edge Functions should:
  - validate auth and role
  - validate payload shape
  - return stable JSON shapes
  - write audit events for sensitive actions
- Storage uploads should use deterministic foldering by user/resource id.

## Validation Checklist
Run after non-trivial changes:
1. `npm run lint`
2. `npm run build`
3. If TypeScript errors are suspected: `npx tsc --noEmit`
4. For schema/function changes, verify expected behavior in Supabase Studio/local CLI.

## Git and Change Hygiene
- Prefer small, focused commits.
- Do not revert unrelated user changes.
- If unexpected modifications appear, pause and confirm before proceeding.
- Document notable behavior or workflow changes in `docs/` when relevant.

## Useful Claude Commands
- `.claude/commands/plan.md`
- `.claude/commands/spec.md`
- `.claude/commands/audit.md`
- `.claude/commands/audit-check.md`
- `.claude/commands/continue.md`
- `.claude/commands/remember.md`
- `.claude/commands/deploy-server.md`
