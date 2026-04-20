# Sprint 01 Backlog - Day 1 Foundation

## S1-01 Repo Audit and Cut List
- Write `docs/MVP_AUDIT.md`
- Sections: working features, incomplete scaffolds, missing MVP features
- Add cut list (hide/guard only, no deletes)

## S1-02 Database Schema Migration
- Create new migration in `supabase/migrations/`
- Add MVP tables, keys, indexes, RLS, updated_at trigger
- Create `supabase/seed.sql` with demo NGOs/partners/rewards placeholder users

## S1-03 Auth and Role Routing
- Role selection during signup
- Ensure profile role persistence
- Add role-gated routing wrappers for donor/ngo/admin zones

## S1-04 Donor Scan and Review Flow
- Build `/donor/scan` and `/donor/review`
- In-memory draft store for captured items
- Compression and thumbnail strip UX

## S1-05 AI Classification Wiring
- Worker-based classification pipeline
- Prefill category/condition and confidence chips
- Timeout/manual fallback behavior

## S1-06 NGO Picker and Submit
- Build `/donor/pick-ngo` and `/donor/schedule`
- Add `fn_submit_donation`
- Persist images + donations + items + audit

## S1-07 NGO Inbox MVP
- Build `/ngo/inbox` and detail page
- Add `fn_ngo_accept`
- Realtime update + donor email notifications
