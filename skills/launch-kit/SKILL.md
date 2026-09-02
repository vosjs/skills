---
name: launch-kit
description: Ship the media with the release — one take of the real product becomes the demo video, the store listing (Chrome Web Store screenshots, tile, marquee), the Product Hunt gallery, the social cuts and the OG card, each verified against per-channel specs in a kit.json manifest and pushed as a version labelled for the release. Use when asked "we're launching / shipping vN", "update the Chrome Web Store (Play, Shopify) listing", "make the launch video", "cut a changelog / what's-new clip", "PR to video", "refresh the demo for the new version", "make the Product Hunt gallery", or to produce a launch week's batch of clips in one style.
license: MIT
---

# Launch kit — ship the media with the release

You are producing a RELEASE's media, not a video: one take of the shipped
feature becomes every asset the release needs, sized and verified per
destination, kept as an editable document so the NEXT release is a re-render,
not a re-shoot. Everything is data; the preview is the render; export is free
at every resolution up to 4K, no watermark; the engine is MIT.

## Setup

```bash
npm i -D @vosjs/cli @vosso/vos-plugin    # the vos CLI (take pipeline included)
```

`ffmpeg` on PATH covers what the CLI does not emit (the PH hover-GIF,
re-encodes to a byte ceiling); without it, ship the PNG/mp4 set and say what
was skipped. MP4 renders need system Chrome (`--format mp4`).

## 1. Establish the release

Three facts before any recording:

- **What shipped** — the feature, the version string, the URL where it runs.
- **Which destinations** — the per-channel spec table ships as data:
  `node_modules/@vosso/vos-plugin/schema/channel-specs.json` (CWS, Product
  Hunt, X, LinkedIn, GitHub, OG, YouTube; sizes, counts, byte and duration
  ceilings, format notes; `references/channel-specs.md` is the same data as
  a table). **Loop over it, never hand-type dimensions.** Ask which channels
  this release ships to; default to last release's set. The JSON carries a
  `verified` date; if it is more than a quarter old, spot-check the channel
  docs before shipping.
- **The label** — every push in this loop carries the release's name:
  `--label "v2.1 launch"`.
- **The brand** — resolve it BEFORE authoring any asset, and never default
  to a template's own palette. The project folder's `BRAND.md` is the brand
  kit (frontmatter carries colour roles, font roles, a logo asset; prose
  carries the voice). Absent one, WITNESS the brand from the product's own
  site — CSS custom properties, computed heading faces, `theme-color`, the
  logo link rels — and write the `BRAND.md` while you are there.

The destinations decide the VIEWPORT, before anything records: footage
resolution = viewport, and a 1280×720 take cannot honestly fill a 1920×1080
video spec or a 1400×560 marquee. Read the video specs in the set first and
record at 2560×1440 (2K, downscales to every spec) unless every destination
is smaller.

If the work lands in a vos.so project (folder), pull it first and read every
`.md` recipe in it — a `LAUNCH.md` (per-channel house rules) binds this loop
the way `CUT.md` binds a cut. Recipes override this skill's defaults.

## 2. Source: one take of the real thing

The kit is made FROM the product, never from a mockup (store policy agrees:
misleading listing images are a removal-grade violation).

**Stage the content like a set before recording.** Half of what separates a
premium launch image from a screen grab is what is ON the screen. The
actions.json must leave the product in the state a proud screenshot would
show — labels typed, real-looking data, the feature mid-story — before any
poster or store still is cut.

- **Fresh recording**: the `product-video` skill's loop (explore →
  `actions.json` → `vos record --strict` → tune `doc.json`). Keep
  `actions.json` in the repo — it is the next release's script.
- **Existing take**: cut it with the `vos-cut` skill. A hosted take comes
  home with `vos fetch <vosId|watch-url> --out dir --media`.
- **New version of a shot product**: re-record into a NEW take directory
  (`--out take-v2`), then `vos plan take-v2 --style take-v1/doc.json`
  carries the look; re-cut by exception. Never record into an existing take
  directory — it is destroyed, edits included. Two traps: coordinate steps
  (`x`/`y`/`drag`) are VIEWPORT pixels, so a viewport change means scaling
  every coordinate (selectors survive — prefer them); and `--style` copies
  the seed's `export` verbatim, so check `export.resolution` matches the
  NEW footage after it runs.

A motion-graphic segment rendered elsewhere is an INPUT: it drops in as a
media overlay clip or a backdrop in the document, never the other way round.

## 3. Pick the moments

```bash
vos frames take --at-zooms --json
```

Judge the stills (the product-video skill's taste rubric applies). Pick 3–5
feature moments (zoom apexes) for screenshots and the gallery, 1 hero moment
for thumbnails/tiles/OG, and a 10–20s loopable range for the README loop.

## 4. Cut the stills

For every `kind: "image"` spec: `vos frames take --frame <t> --size <w>x<h>`.
Wide formats (440×280 tile, 1400×560 marquee) crop aggressively — the
subject must sit centered; add a dedicated `source:"manual"` zoom span if it
doesn't. The PH 240×240 thumbnail may be a 2–4s hover-GIF via ffmpeg; its
FIRST frame must stand alone.

### Posters (the stills that carry the message)

A bare product frame is a screenshot; a POSTER is a COMPOSITION. Premium
launch imagery is one of three genres — know which you are making:

1. **Brand moment** — giant type over cinematic art, no product UI. Needs
   brand equity and art direction; last resort, never the default.
2. **Recomposed product moment** — the UI rebuilt as staged graphic
   elements on a rich gradient. This is a PROGRAM, never a capture.
3. **Framed real screenshot** — the real UI cropped editorially, floated or
   bled off-edge on a designed ground, type in its OWN column or strip,
   never over the UI. The honest default.

**The default poster is a split-cover PROGRAM** (a vos config: gradient
ground with grain drawn in `createContent`, kicker + display headline +
wordmark as text elements, the real screenshot as an image element bled off
two edges — every value a param: `kicker, headline, brand, shotUrl, palette,
fontDisplay, logoUrl`, set from `BRAND.md`). Reuse your team's poster
program if one exists; else author it once with the `vos-authoring` skill —
it renders every size (`vos still poster --width W --height H` recomposes
the layout at any aspect) and doubles as a short MOTION card
(`vos render poster --format mp4`).

The take-native END CARD (OUTPUT-anchored text overlays over the final
~3 s) survives for two jobs: the video cuts end on an animated title card,
and the simplest framed-screenshot poster falls out of that frame — curated
backdrop as the ground, generous `frame.padding`, type on the GROUND, never
over the UI. Keep the bare product frames as alternates in the kit.

**Name what you push.** `vos frames`/`vos still` write `frame-NN-…` files;
rename to channel names (`linkedin-poster.png`, `og-card.png`) before
uploading, or six posters share one label on the shelf.

## 5. Render the video cuts

- **Main demo** (60–120s, 1920×1080 H.264): `vos render take main-demo.mp4
  --format mp4`, captions burned in (overlay text in the doc). Upload public
  to YouTube; the CWS promo and the Product Hunt video both take that
  YouTube URL.
- **Feed cut** (30–60s): tighten the doc (segments/speed spans) and render
  full-length — `--range` renders are SILENT by design, so a sound-bearing
  cut-down trims `segments`, never `--range`. **X accepts H.264+AAC ONLY.**
- **Vertical cut** (1080×1920): a 9:16 recut, not a center-crop; keep
  critical text in the centered ~900×1160 safe zone.
- **README loop** (10–20s, ≤10MB): two-pass ffmpeg, bitrate from duration
  (`target_kbps ≈ 10*8192/duration_s * 0.93`).

Performance rules baked into every cut: hook in the first 3 seconds; design
for mute; completion beats length; native upload always.

## 6. Verify the kit, push the release

Write `kit.json` beside the take — one entry per produced asset, plus a
`skipped` list — and VERIFY every entry against the spec sheet as the last
step, reading actual dims/bytes/durations from the files (`ffprobe` for
video), never from intent:

```json
{
  "release": "v2.1",
  "take": "take-v2",
  "produced": "<date>",
  "skipped": ["youtube main-demo: spec wants 60-120s, the take is 36s"],
  "assets": [
    { "channel": "cws", "asset": "screenshot", "path": "kit/cws-shot-1.png",
      "w": 1280, "h": 800, "bytes": 231423, "seconds": null, "frameTime": 4.2 }
  ]
}
```

```bash
node -e '
const specs = require("@vosso/vos-plugin/schema/channel-specs.json").specs
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

An asset that misses its spec is redone, not shipped with a caveat — with
ONE exception: a spec FLOOR the story cannot honestly fill (a 60 s minimum
against a 35 s take) is a SKIPPED asset with its reason in `skipped`, never
padding. Store uploads stay manual by policy (a bad listing is expensive):
hand the human the kit directory and the manifest, never push to a store.

Then push the source labelled for the release, and FILE the kit's stills
into the release's project so the human can retrospect without a terminal:

```
vos push take-v2 --label "v2.1 launch" --note "<what shipped, one line>"
vos folder move <vosId> --to <project-slug>
vos asset push kit/posters/*/*.png kit/ph/*.png --folder <project-slug>
```

End by handing the human the loop, not the files: the watch page plays the
latest version, the studio edits it, and `vos pull` brings their edits back
down. Next release, start at step 2's third bullet.

## Launch week (5-12 clips, one style)

A launch week is a series: cut and sign off ONE seed clip with the human
first, then cut every other feature's take with
`vos plan <take> --style <seed doc.json|vosId>` so the batch shares its look
by data. Never spread before the seed is signed off.

## Notes

- There is deliberately no `vos kit` verb yet — this skill IS the procedure.
  If you script the same loop a third time, that is the signal the verb
  should exist; say so in your handoff.
- Platform specs drift. The JSON carries a `verified` date; if it is more
  than a quarter old, spot-check the channel docs before shipping.


## Avoid (the traps that shipped)

- A 720p recording against a 1080p spec: the destinations pick the viewport
  before anything records. Cost a full re-record once.
- A template's own palette on a deliverable: resolve `BRAND.md` (or
  witness the site) before any asset is authored.
- The poster's shot at the cold open: name a zoom apex with `--shot-time`;
  `--poster-time` is the poster's own clock, not the take's.
- A store screenshot under the frame chrome or the camera zoom: the store
  still is the real page, full bleed (deliver's default); for a text-heavy
  product record a second take at 1280x800, a 2K frame is blank at store size.
- A card that is WebP under a `.png` name: `vos still` writes WebP; convert,
  then `vos validate <kit.json>` reads the bytes and says so.
- Padding a spec floor: a 36 s story is a skipped 60 s demo, with its reason.
- A hand-typed dimension: every size comes from `channel-specs.json`.
- `frame-NN-…` names on the shelf: rename to channel names before pushing.
- The save beat on a demo instance that disables writes: say so in
  `skipped`, never fake the click.
