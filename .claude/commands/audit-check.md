Run a quick health check of the current branch and report only high-signal results:

1. `npm run lint`
2. `npm run build`
3. if needed, `npx tsc --noEmit`

Output:
- pass/fail for each command
- top errors grouped by file
- likely root cause for each group
- minimal fix order suggestion

Do not edit files unless explicitly asked.
