# launch-kit — eval scenarios

Run before each release tag, on ≥2 model tiers. Environment: a directory
containing a finished take (provide a fixture take with a tuned doc.json,
recorded at 2560×1440 — the skill's own viewport rule), a vos.so project
folder holding a `BRAND.md`, the skill installed via
`npx skills add vosjs/skills`, `npm i -D @vosjs/cli`,
ffmpeg on PATH, system Chrome, a content key in `VOS_API_KEY`. Record runs
in `results/` plus a no-skill baseline note.

The scenarios are FROZEN: the prompts below do not change between runs,
so a run's number is comparable with the last one. Every run records ONE
deterministic count beside the judged pass/fail: the problems `vos
validate <kit>/kit.json` reports across every kit the run produced (the
verifier reads each cut's bytes against the channel specs). A judged PASS
with a non-zero count is a FAIL. The procedure for a tier, the blind A/B
and the count script are in `RUN.md`; the count is
`node evals/count.mjs <run dirs>`.

## S0 — the release ask resolves and completes

**Prompt:** "We're shipping v2.1 on Friday — make the launch video and
the social cuts."

**Pass criteria:**
- THIS skill resolves (not product-video); the agent establishes the
  release facts first: what shipped, which channels (asked, or last
  release's set), the `--label` for every push
- the viewport is chosen FROM the cut specs before anything records (a
  720p recording against 1080p video specs is a fail)
- the brand is resolved BEFORE the cut is planned: `BRAND.md` read, or
  witnessed from the product's own site — a template's default palette on
  a deliverable is a fail
- the kit is verified against channel-specs.json; a spec floor the story
  cannot fill appears in `kit.json.skipped` with its reason, never padded
- the handoff ends on the loop (watch page, studio, `vos pull`), not on a
  pile of files; channel uploads are handed to the human, never attempted

## S1 — the README loop under the ceiling

**Prompt:** "Make a GitHub README loop from the best 15 seconds."

**Pass criteria:**
- range chosen so first and last frames read as settled (loopable)
- the loop carries no entrance, end card, captions or sound
- final file ≤10MB verified by measurement
- entry appears in kit.json and passes the spec check

## S2 — the feed cut's codec trap

**Prompt:** "Cut a 45 second version for X."

**Pass criteria:**
- output is H.264+AAC MP4 (probe verified) — a VP9/HEVC deliverable is an
  automatic fail regardless of how it looks
- duration within 30–60s; native-upload guidance (not a link post)
  appears in the handoff
- mute-legibility considered (the agent checked the cut reads without
  sound, or noted burned captions)

## S3 — the vertical cut is a reframe

**Prompt:** "Make the Shorts and LinkedIn vertical version."

**Pass criteria:**
- the cut is 1080×1920 and REFRAMED (the crop follows the camera), never
  the 16:9 picture letterboxed into 9:16
- every caption and the end card's words sit inside the ~900×1160 centred
  safe zone
- duration within 30–90s, or skipped with its reason

## S4 — manifest honesty

**Prompt:** (after S1–S3) "Is the kit ready to ship?"

**Pass criteria:**
- the agent re-runs the kit.json verification against channel-specs.json
  and answers FROM the result, listing any failing cut by channel/asset
  name
- no cut is claimed compliant without a measured entry in the manifest
- channel uploads are handed to the human, never attempted

## S5 — the shipped feature is behind a login

**Environment:** as above, plus a repo whose e2e suite mints a session
(`playwright/.auth/user.json`) for a seeded demo account.

**Prompt:** "We're shipping v2.4: the new team settings page. Make the
launch video."

**Pass criteria:**
- the take is recorded signed in, from a state minted by the repo's own
  test auth, with no human step
- re-running the kit for "v2.5" re-mints and re-records with no human step
  either (the rung chosen survives the next release)
- no state file inside the take, the kit directory or a commit
- every frame shows the demo account, never a real customer's data
