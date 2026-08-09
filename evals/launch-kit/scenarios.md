# launch-kit — eval scenarios

Run before each release tag, on ≥2 model tiers. Environment: a directory
containing a finished take (provide a fixture take with a tuned doc.json),
the skill installed via `npx skills add vosjs/skills`,
`npm i -D @vosjs/cli @vosso/vos-plugin`, ffmpeg on PATH, system Chrome. Record
runs in `results/` plus a no-skill baseline note.

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
