# Deploy

Prepare a release for ReHome using current repo tooling.

Checklist before deploy:
- read `CLAUDE.md`
- confirm current branch and clean/intentional git status
- run `npm run build`

Web deploy path (GitHub Pages):
1. ensure `VITE_APP_URL` is correct for target environment
2. push to `main` to trigger `.github/workflows/deploy.yml`
3. verify workflow completion and final URL health

Android staging artifact path:
1. run `npm run android:sync`
2. from `android/`, run `./gradlew assembleDebug` (or `gradlew.bat` on Windows)
3. archive output APK path in release notes

Supabase deploy path:
1. apply SQL migrations (`supabase db push`) when required
2. deploy changed edge functions (`supabase functions deploy <name>`)

If any step fails, stop and report the exact error and safest recovery path.
