# Claude Context

## Current Task

- Active sprint: ReHome 3-Day MVP Sprint
- Current focus: Day 1 foundation work
- Immediate next story: Task 1.1 - Repo audit and MVP cut list

## Key Facts

- Root instruction file: `CLAUDE.md`
- Slash commands live in `.claude/commands/`
- Sprint plan source: `03_SPRINT_PLAN.md` (external planning attachment)
- Tech spec source: `02_TECH_SPEC.md` (external planning attachment)
- Local project map: `PROJECT_INDEX.md`
- Main router: `src/App.tsx`
- Database migrations: `supabase/migrations/`
- Edge functions: `supabase/functions/`

## Repository Snapshot

- Frontend: React 18 + TypeScript + Vite + Tailwind + shadcn/ui
- Routing: `HashRouter` in `src/App.tsx`
- Data/Auth: Supabase client + RLS-backed Postgres
- Mobile shell: Capacitor Android project under `android/`
- Deploy target: GitHub Pages for web

## Sprint Progress

### Completed
- Bootstrap Claude Code scaffolding (`.claude/` + `CLAUDE.md`)

### In Progress
- Build reusable command prompts aligned to ReHome workflows

### Not Started
- Task 1.1 MVP audit report at `docs/MVP_AUDIT.md`

## Checks Run

- Workspace scan for existing `.claude` and `CLAUDE.md`
- Read key files: `PROJECT_INDEX.md`, `README.md`, `src/App.tsx`, `package.json`, `.env.example`

## Blockers

- No functional blocker currently
- Planning docs (`01/02/03`) are external attachments and not versioned in repo yet

## Next Action

- Execute Task 1.1: produce `docs/MVP_AUDIT.md` with working/incomplete/missing MVP features and a non-destructive cut list
