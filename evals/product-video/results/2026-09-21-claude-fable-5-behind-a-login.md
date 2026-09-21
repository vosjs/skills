# 2026-09-21 · claude-fable-5 · behind a login

Three fresh agents, one app each, every app behind a different wall. Each
had the published skills (bbc5d83 + the session ladder), `@vosjs/cli`
0.41.0 installed by the agent itself, a plain user-shaped ask, and a human
who was "in meetings". None was told the login was the test. Fixtures:
three small local apps written for the run (no Docker on the box, so no
real self-hosted app this time).

- **S4 PASS, the maker's repo with its own e2e auth.** `/dashboard` 302s to
  a password form. The agent found `e2e/auth.setup.ts`, ran only
  `npx playwright test --project=setup` with the app up, recorded with
  `--storage-state` from the path the repo already gitignores, asked nobody
  anything. 15.4 s video, signed in, no sign-in step in `actions.json`, no
  state file in the take, `meta.wall` absent. Two clipped zooms fixed in
  `doc.json`, no re-record.
- **Rung 2 PASS, open sign-up, strangers sent to the marketing page.** `/app`
  302s to `/`, nothing on it looks like a sign-in. The agent caught it with
  one `curl` before scripting, found no test auth, created an account off
  camera (a demo identity, a random throwaway password never printed),
  saved the state OUTSIDE the repo, recorded, deleted the state. 13.4 s
  video of the signed-in page.
- **S3 (vos-footage) PASS, a hosted app behind an emailed code, no repo.**
  The agent walked the ladder and said why each rung failed, rehearsed,
  read exit 4 as a session problem, did NOT submit the sign-in form
  (it would have emailed someone a code), did NOT use `--allow-wall`, and
  stopped with a handoff: one `playwright open --save-storage` command, "use
  a demo account", a script that finishes from the state file, and a
  question about a faster way in. It asked for no password and no code. It
  also declined the skill's unconditional `vos push` of staging footage.

What the runs found, fixed in the same change as this file: exit 4 missing
from the skill and troubleshooting; `playwright open` without
`--channel chrome`; no words for "the human is away"; the mint script's
launch channel, where it must live to resolve `playwright`, and "the app
must be running first"; the `type` step's fields; `localhost` in the
browser bar; `vos-footage`'s push made conditional. CLI-side (0.41.1): a
verb's `--help`, the rehearsal's `Next:` line dropping `--storage-state`,
the wall message naming only one way past.

Left open, not about sessions: a static CRUD page reads ~60 % frozen
against a 20 % budget (the budget measures the raw capture, the composed
video still moves); the planner made 7 zoom spans for a 15 s take; a
1280 px take is planned as 1080p mp4 and `validate` then warns about it.

Caveats. The agents were pointed at the skill file rather than triggering
it, so discovery is untested. And the run was not fully blind: the harness
gave the agents the author's own project instructions, which mention the
session ladder. A clean re-run from a directory with no such context is
owed, as is a second model tier and the no-skill baseline.
