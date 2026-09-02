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
verifier reads each asset's bytes against the channel specs; plugin
≥0.20.0). A judged PASS with a non-zero count is a FAIL. The procedure
for a tier, the blind A/B and the count script are in `RUN.md`; the count
is `node evals/count.mjs <run dirs>`.

## S0 — the release ask resolves and completes

**Prompt:** "We're shipping v2.1 on Friday — make the launch assets."

**Pass criteria:**
- THIS skill resolves (not product-video); the agent establishes the
  release facts first: what shipped, which destinations (asked, or last
  release's set), the `--label` for every push
- the viewport is chosen FROM the destination specs before anything
  records (a 720p recording against 1080p video specs is a fail)
- the brand is resolved BEFORE any asset is authored: `BRAND.md` read, or
  witnessed from the product's own site — a template's default palette on
  a deliverable is a fail
- the kit is verified against channel-specs.json; a spec floor the story
  cannot fill appears in `kit.json.skipped` with its reason, never padded
- the kit's stills are pushed into the release's project with CHANNEL
  names (`og-card.png`, not `frame-00-…png`)
- the handoff ends on the loop (watch page, studio, `vos pull`), not on a
  pile of files; store uploads are handed to the human, never attempted

## S5 — posters are compositions

**Prompt:** "Make the LinkedIn poster and the OG card for this release."

**Pass criteria:**
- the deliverable is a COMPOSITION, not a bare product frame: type sits in
  its own column or strip on a designed ground, never over the UI
- the default path is the split-cover program (params set from `BRAND.md`)
  or, for the framed-screenshot genre, a curated ground with generous
  padding and an editorial crop
- brand values come from `BRAND.md` (or the witnessed site brand), not the
  template's own palette
- rendered at the spec's exact dimensions and named for the channel

## S1 — the stills kit

**Prompt:** "Produce the Chrome Web Store and Product Hunt image assets
for this take."

**Pass criteria:**
- moments chosen from `frames --at-zooms` output (not arbitrary times)
- every image cut with `vos frames --frame <t> --size WxH` at the spec's
  exact dimensions, read from channel-specs.json (not hand-typed)
- `kit.json` written with real measured dims/bytes per file
- the verification loop ran and reported all-ok (or the agent fixed
  failures before finishing)

## S2 — the README loop under the ceiling

**Prompt:** "Make a GitHub README loop from the best 15 seconds."

**Pass criteria:**
- range chosen so first and last frames read as settled (loopable)
- two-pass H.264 encode with bitrate computed from the actual duration
- final file ≤10MB verified by measurement, `+faststart` set
- entry appears in kit.json and passes the spec check

## S3 — the feed cut's codec trap

**Prompt:** "Cut a 45 second version for X."

**Pass criteria:**
- output is H.264+AAC MP4 (probe verified) — a VP9/HEVC deliverable is an
  automatic fail regardless of how it looks
- duration within 30–60s; native-upload guidance (not a link post)
  appears in the handoff
- mute-legibility considered (the agent checked the cut reads without
  sound, or noted burned captions)

## S4 — manifest honesty

**Prompt:** (after S1–S3) "Is the kit ready to ship?"

**Pass criteria:**
- the agent re-runs the kit.json verification against channel-specs.json
  and answers FROM the result, listing any failing asset by
  channel/asset name
- no asset is claimed compliant without a measured entry in the manifest
- store uploads are handed to the human, never attempted

## S6 — store screenshots are the real page

**Prompt:** "Cut the Chrome Web Store screenshots for this take."

**Pass criteria:**
- every screenshot is the real page at its moment, FULL BLEED: no browser
  bar, no padding, no rounded corners, no camera zoom (store policy: real
  UX, square corners); a zoomed corner under a mac bar on a gradient is a
  fail (it reads as a marketing frame, and a text-heavy page zoomed to a
  corner reads as an empty page)
- when the 16:9 take cover-crops into 16:10 and the crop cuts an app's
  sidebar, the agent moves the crop with `--set frame.focus` rather than
  shipping a headless sidebar
- for a text-heavy product the agent notices that a 2K frame is mostly
  blank at store size and records a second take at 1280x800 (or says why
  not)
- `vos validate kit/kit.json` reports 0 problems

## S7 — the poster's shot is the feature

**Prompt:** "Make the OG card and the store marquee from the poster
program."

**Pass criteria:**
- the shot baked into the poster is a zoom apex named with
  `--shot-time <t>` (the cut's camera makes the shot the feature), never
  the cold open the first still time defaults to
- the poster's words are the release's (`kicker`, `title`, `brand`
  element contents edited; they are literal element fields, not `data`
  bindings), the ground is the brand's (`data.bgA/bgB/bgC`), the type
  colour is legible on that ground
- every card is a REAL PNG at the spec's pixels (`vos validate` reads the
  bytes: a WebP under a `.png` name is a fail) and under its byte ceiling

