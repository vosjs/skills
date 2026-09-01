# launch-kit — eval scenarios

Run before each release tag, on ≥2 model tiers. Environment: a directory
containing a finished take (provide a fixture take with a tuned doc.json,
recorded at 2560×1440 — the skill's own viewport rule), a vos.so project
folder holding a `BRAND.md`, the skill installed via
`npx skills add vosjs/skills`, `npm i -D @vosjs/cli @vosso/vos-plugin`,
ffmpeg on PATH, system Chrome, a content key in `VOS_API_KEY`. Record runs
in `results/` plus a no-skill baseline note.

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
