---
name: launch-kit
description: Turn one product recording into the full launch asset kit with the vos CLI. From a single take, produce the YouTube main demo and thumbnail, X and LinkedIn video cuts, Chrome Web Store screenshots, tiles, marquee and icon, Product Hunt thumbnail and gallery, GitHub README loop and social preview, and OG cards. Exact per-channel dimensions, byte and duration ceilings ship as data, and the last step verifies every produced asset against them in a kit.json manifest. Use when asked to make launch assets, store screenshots, a launch video kit, social cuts of a demo, or a Product Hunt or Chrome Web Store listing refresh.
license: MIT
---

# Launch kit — one take, every channel

You are turning ONE finished take (recorded and tuned with the
`product-video` skill) into the complete set of launch assets. Everything
derives from the same document, so every asset shows the same real
product, and re-running after a product change regenerates the whole kit.

## Setup

```bash
npm i -D @vosjs/cli @vosso/cli    # the vos CLI (take pipeline included)
```

Plus `ffmpeg` on PATH for re-encodes. MP4 renders need system Chrome
(`--format mp4`). The per-channel specs ship as data in the CLI package
(`@vosso/cli` ≥0.3):

```
node_modules/@vosso/cli/schema/channel-specs.json
```

`references/channel-specs.md` is the same data as a table (and the
fallback if your installed CLI predates the JSON). **Treat the spec sheet
as the source of truth and loop over it — never hand-type dimensions.**

## The procedure

Work in a `kit/` directory beside the take. Track every produced file in
`kit.json` as you go (schema below).

### 1. Pick the moments

```bash
vos frames take --at-zooms --json
```

Judge the stills (the product-video skill's taste rubric applies). Pick:
- 3–5 **feature moments** (zoom apexes where one feature is composed) →
  CWS screenshots, PH gallery
- 1 **hero moment** (the money shot, subject centered) → thumbnails,
  tiles, OG, social preview
- a 10–20s **loopable range** (starts and ends settled) → README loop

### 2. Cut the stills

For every `kind: "image"` spec, render from the chosen moment:

```bash
vos frames take --frame <t> --size <w>x<h>
```

- Wide/short formats (440×280 tile, 1400×560 marquee, 1280×640 social
  preview) crop aggressively — the subject must sit centered. If it
  doesn't, add a dedicated `source:"manual"` zoom span for that moment
  and re-frame; one draft render checks it.
- CWS screenshots must be REAL UX — no mockups, no misleading composites
  (removal-grade violation).
- The Product Hunt 240×240 thumbnail may be a GIF (animates on hover
  only): encode a 2–4s loop from the hero range, and make sure the FIRST
  frame stands alone.

### 3. Render the video cuts

- **Main demo** (60–120s, 1920×1080 H.264): the full take —
  `vos render take main-demo.mp4 --format mp4`. Captions burned in
  (overlay text in the doc, not a separate track). Upload public to
  YouTube; CWS promo and Product Hunt both take that YouTube URL.
- **Feed cut** (30–60s): tighten the doc (segments/speed spans), or use
  `--range <a>..<b>` on the strongest stretch. **X accepts H.264+AAC
  ONLY** — HEVC/VP9/AV1 uploads are rejected.
- **Vertical cut** (1080×1920): a 9:16 recut, not a center-crop
  afterthought — re-record at a 9:16 viewport or reframe the doc for
  portrait, and keep critical text inside the centered ~900×1160 safe
  zone (platform chrome covers the rest).
- **README loop** (10–20s, ≤10MB): two-pass ffmpeg with the bitrate
  computed from duration:
  ```bash
  # target_kbps ≈ (10 * 8192 / duration_s) * 0.93   (7% container overhead)
  ffmpeg -y -i in.webm -c:v libx264 -b:v <target>k -pass 1 -an -f mp4 /dev/null
  ffmpeg -i in.webm -c:v libx264 -b:v <target>k -pass 2 -movflags +faststart -an readme-loop.mp4
  ```

### 4. Write and verify `kit.json` (the manifest IS the deliverable)

One entry per produced asset:

```json
{
  "take": "path/to/take",
  "produced": "<date>",
  "assets": [
    { "channel": "cws", "asset": "screenshot", "path": "kit/cws-shot-1.png",
      "w": 1280, "h": 800, "bytes": 231423, "seconds": null, "frameTime": 4.2 }
  ]
}
```

**The last step is always verification** — check every entry against the
spec sheet and report failures by name:

```bash
node -e '
const specs = require("./node_modules/@vosso/cli/schema/channel-specs.json").specs
const kit = require("./kit/kit.json")
let bad = 0
for (const a of kit.assets) {
  const s = specs.find((x) => x.channel === a.channel && x.asset === a.asset)
  if (!s) { console.log("? no spec:", a.channel, a.asset); continue }
  const errs = []
  if (a.w !== s.w || a.h !== s.h) errs.push(`dims ${a.w}x${a.h} != ${s.w}x${s.h}`)
  if (s.maxBytes && a.bytes > s.maxBytes) errs.push(`bytes ${a.bytes} > ${s.maxBytes}`)
  if (s.maxSeconds && a.seconds > s.maxSeconds) errs.push(`length ${a.seconds}s > ${s.maxSeconds}s`)
  if (s.minSeconds && a.seconds < s.minSeconds) errs.push(`length ${a.seconds}s < ${s.minSeconds}s`)
  if (errs.length) { bad++; console.log("FAIL", a.channel, a.asset, "—", errs.join("; ")) }
  else console.log("ok  ", a.channel, a.asset)
}
process.exit(bad ? 1 : 0)'
```

Read actual dims/bytes from the files (`ffprobe` for video, any image
tool for stills) — never copy them from intent.

## Performance rules (bake these into the cuts)

- **Hook in the first 3 seconds** — the product doing the impressive
  thing; no logo sting.
- **Design for mute** — most feed playback is silent; zooms and captions
  carry the story, audio is a bonus.
- **Completion beats length** — a 30s cut people finish outranks a 90s
  cut they abandon.
- **Native upload always** — feeds demote link posts hard.
- Copy ceilings: Product Hunt tagline ≤60 chars, description ≤500.
- **C2PA caution**: LinkedIn and X auto-badge C2PA content credentials.
  Don't embed them in exports unless a visible "CR" badge on the post is
  intended.

## Notes

- There is deliberately no `vos kit` verb yet — this skill IS the
  procedure. If you find yourself scripting the same loop a third time,
  that's the signal the verb should exist; say so in your handoff.
- Platform specs drift. The JSON carries a `verified` date; if it's more
  than a quarter old, spot-check the channel docs before shipping.
- Store uploads stay manual by policy (a bad listing is expensive) — hand
  the human the kit directory and the manifest, never push to a store.
