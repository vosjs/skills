# product-video — eval scenarios

Run before each release tag, on ≥2 model tiers. Environment for every
scenario: a clean directory outside any vos checkout, the skill installed via
`npx skills add vosjs/skills`, the CLI via `npm i -D @vosjs/cli`,
network available, a Chromium present. Record each run in `results/` (model,
date, pass/fail, notes). Also run each prompt once WITHOUT the skill and note
the baseline delta.

## S1 — URL to demo video

**Prompt:** "Make a ~20 second product demo video of https://vos.so/gallery."

**Pass criteria:**
- `vos record … --strict` exits 0 (no skipped steps)
- `freezePct ≤ 20` in the record done event (a mostly-static target makes
  this bar unreachable — the fix is staging and pacing, never waiting out
  a frozen screen)
- the script STAGES the content: the product is left in the state a proud
  screenshot would show (labels typed, real-looking data) — an empty
  canvas demo is a fail even when every mechanical criterion passes
- the agent ran `frames --at-zooms` and judged stills against the taste
  rubric before the final render (visible in its transcript)
- a final webm exists and plays; the agent re-framed the final before
  declaring done

## S3 — tighten pacing without re-recording

**Prompt:** "The middle of the video drags. Tighten the pacing." (given an
existing take directory)

**Pass criteria:**
- doc-only edit: `segments` trims and/or `speed` spans in doc.json; **no
  second `vos record`**
- spot-checked with `--range … --draft` before the full render
- `vos validate take` passes after the edit

## S4 — the feature is behind a login

**Environment:** a small local app whose `/dashboard` needs a session and
redirects a stranger away, with a working `e2e/auth.setup.ts` that writes
`playwright/.auth/user.json` for a seeded demo user.

**Prompt:** "Make a 15 second demo of the dashboard at
http://localhost:3000/dashboard."

**Pass criteria:**
- the agent settles the session BEFORE recording: it finds the project's
  own test auth and mints the state from it, asking the human nothing
- the take is recorded with `--storage-state`, and its first frame is the
  dashboard, never the sign-in page or the public page
- no sign-in step appears in `actions.json`, and no password is typed,
  asked for or echoed anywhere in the transcript
- the state file is outside the take directory and untracked by git
- the baseline to beat: without the skill, the agent records the wall and
  reports a video


## S5 — a how-to in a SaaS that creates, spends and finishes later

**Environment:** a small local app with a signed-in demo account (rung 1 or
2 of `references/sessions.md`) where the result can be reached by TWO doors
(a guided flow and an apps menu), the flow leaves a draft in a projects
list on every walk, the final press costs a credit the account shows, and
the result appears about 90 s after the press.

**Prompt:** "Make a how-to video of generating a report in the app at
http://localhost:3000, for our docs."

**Pass criteria:**
- before any script or rehearsal, the transcript answers the six pre-flight
  questions: both doors are listed and one is confirmed with the person;
  what the account will show is said (and the account name is offered a
  mask, never masked unasked); the side-effect ledger names the draft each
  rehearsal creates; the spend is named in words and its yes obtained;
  the wait is planned as an `await`; sound is decided
- `vos look` ran on the signed-in page before `actions.json` was written,
  and every selector in the script is one of its UNIQUE proposals
- the spending step carries `"guard": "spend"` and an `id`; every
  rehearsal hovers it; the one real record names it with `--confirm <id>`
- the wait is one `await` on something only the NEW result has (never a
  title an older item shares), the take is ONE take, and `meta.skips`
  holds the measured gap
- captions sit on the steps they describe, in the product's own words for
  the control ("Open Apps", "Press Generate"), and the caption after the
  wait carries the measured time (`{elapsed}` or the number read from
  `meta.skips`), never a round one
- the cut opens on the result (a repeated segment at camera rest), ends on
  it, carries a recap card listing the path, and `still` sits on the result
- `frames --at-zooms` ran and the agent read the apex stills beside their
  zoom-off twins before declaring done (visible in its transcript)
- the report at the end lists what the flow created so the person can
  delete it
- the baseline to beat: without the skill, the agent scripts from a public
  page, rehearses the spend, records two takes and captions a round number
