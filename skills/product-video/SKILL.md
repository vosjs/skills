---
name: product-video
description: Record and produce a shippable product demo video of a website, app, or feature with the vos CLI. The agent drives the browser from an actions.json script, the recording auto-plans zooms, and every editing decision lives in doc.json, so you edit JSON and re-render instead of re-recording. Output is real footage with auto-zoom, deterministic renders, and exact-size stills from the same take. Use when asked to make a product video, demo video, screen recording of a URL or feature, marketing clip, or launch assets such as store screenshots, tiles, and promo stills.
license: MIT
---

# Product video (and the assets around it), end to end

You are producing a shippable product asset — a polished video, a set of
exact-size stills, or both — from a live web page, with the `vos` CLI.
Everything is data: you write a flow script, the CLI records and plans, you
tune JSON, you re-render. **Never re-record to fix pacing or zooms — edit
`doc.json` and render again.** Quality bar: `references/taste.md` — follow
its quality loop and judge stills multimodally.

## Setup

```bash
npm i -D @vosjs/cli @vosso/cli
```

One command, two packages: `@vosjs/cli` is the open source (MIT) `vos`
binary and engine verbs; `@vosso/cli` adds the take pipeline used here
(record / plan / frames / render on screen recordings) — free to use,
proprietary license. Requirements:

- **A Chromium**: system Chrome is found automatically; otherwise
  `npx playwright install chromium` or point `VOS_BROWSER_PATH` at one.
  Exit code 3 means no browser was found.
- **Network at render time**: the render page loads three/mediabunny from
  esm.sh. Recording also needs to reach the target URL. Fully offline
  sandboxes cannot render — say so instead of shipping nothing.

Conventions: logs → stderr, results → stdout; `--json` streams NDJSON ending
with `{"event":"done",…}`; exit codes 0 ok / 1 error / 2 usage or strict
failure / 3 no browser.

## Step 0 — pick the destination (it decides everything)

| Destination | Viewport | Output | Extras |
|---|---|---|---|
| **Landing-page clip** (hero/section embed) | 2560×1440 (footage-native 2K) | webm → VP9 re-encode + poster | silent loop; see `references/destinations.md` |
| **Launch video** (PH, social, store promo) | 2560×1440 or 1280×720 | mp4 (`--format mp4`, needs system Chrome) | music bed via `doc.audio` |
| **Launch-kit stills** (store screenshots, tiles, OG) | sized to the asset | `frames --frame <t> --size WxH` PNGs from the same take | one take → every asset |
| **Quick demo** (issue, PR, chat) | 1280×720 | webm, defaults | speed over polish; drafts acceptable here ONLY |

Per-channel dimensions and byte budgets: `references/destinations.md`.

## The core loop (every destination)

1. **Explore the target page** with your own tools (fetch HTML / Playwright).
   Identify the 3–6 moments that tell ONE story. Collect STABLE selectors
   (`a[href='…']`, ids, roles — not nth-child chains).

2. **Write `actions.json`**:
   ```json
   {
     "url": "https://target.example",
     "viewport": { "width": 1280, "height": 720 },
     "steps": [
       { "do": "wait", "ms": 800 },
       { "do": "hover", "selector": "a[href='/pricing']", "ms": 700 },
       { "do": "click", "selector": "#cta" },
       { "do": "wait", "ms": 1500 },
       { "do": "scroll", "dy": 400 },
       { "do": "move", "x": 640, "y": 320 },
       { "do": "wait", "ms": 900 }
     ]
   }
   ```
   Verbs: `wait` `hover` `click` `type` `scroll` `move` `drag`
   (drag = real edits: `{do:'drag', selector|x,y, tx, ty, ms}` — slide a range
   input, drag a canvas element, move a timeline clip). Pacing IS the zoom
   plan: open `wait ≥700ms`; hover what matters 700–900ms (dwells become
   zooms); 1200–2000ms after navigations; end settled. Route the cursor away
   from hover-triggered menus (taste.md, flow rules). Check with
   `vos validate actions.json`.

3. **Record**: `vos record --actions actions.json --out take --strict --json`
   `--strict` always: skipped selector / networkidle timeout → exit 2 with
   `skipped[]` in the done event. A skip means the flow is broken — fix it,
   never ship around it. The take auto-encodes and auto-plans.
   (`vos create --actions actions.json out.webm --strict` is the one-shot
   record+render verb — fine for a quick first pass, but THIS skill's loop
   reviews frames before rendering, so prefer the separate verbs here.)

4. **Tune `doc.json`** (JSON Schema ships in the `@vosso/cli` npm package:
   `schema/doc.schema.json`):
   - `zoom`: `[{in, out, level, cx, cy, source}]`, SOURCE seconds; levels
     1.4–2.8; `cx/cy` NORMALIZED [0..1] (0.5,0.5 = center) — NOT pixels; set
     `"source": "manual"` on spans you touch (survives re-plan).
   - `segments` (trims) · `speed` (`rate` 0.1–16) · `frame.*` · `cursor`.
   - `tilt`: `[{in, out, rx, ry, source}]`, SOURCE seconds — the 3D card
     leans to the pose while active, returns to rest between. DEGREES
     (±5..18 reads premium): +rx = top edge closer, +ry = left edge closer
     (lean toward a right-side focus = negative `ry`). Spans ≥ 0.8s;
     pair with zoom moments (same in/out chains the moves), one pose change
     per ~5s beat. `"source": "manual"` on spans you touch;
     `tiltStyle: "subtle"|"medium"|"strong"` records the auto wand.
   - `frame.backgroundMedia`: a video loop / image behind the card —
     `{"kind":"video","key":"/bg.webm","duration":10,"dim":0.2}`.
     `key` = a file dropped in the take dir (`"/bg.webm"`) or a media URL;
     video needs `duration` (OUTPUT-anchored modulo loop); `dim` 0..1 scrim.
     Ambience, not a subject — dim it behind dense UI.
   - `audio`: OUTPUT-anchored clips; `key` may be a file dropped into the
     take dir (`"/music.mp3"`); gain/fades/loop. Muxed on full renders
     (Opus/AAC); `--range` stays silent; forces single-flight.
   - export: `{"resolution": "720p|1080p|2k|4k", "fps": 30}` — never above
     the footage (validate warns).
   Then `vos validate take --json` — lints must pass.

5. **Look before you render** (the taste.md quality loop):
   - `vos frames take --at-zooms --times 0,25%,50%,75%,100% --json` → judge
     every still against taste.md, zoom apexes hardest.
   - Iterate: edit doc.json → `vos render take check.webm --range a..b --draft`
     (seconds, half res — never ship drafts) → re-frame the changed region.
   - **Trying a presentation? Use a flag, not a scratch script.** `render`/`frames`
     take doc overrides — `--set <path>=<value>` (repeatable; JSON-or-string),
     `--frame <macos|windows|minimal|none>` (render), `--background <url>` — that
     patch the doc in memory (doc.json untouched) and are lint-gated. So
     `vos frames take --frame 2.0 --set frame.browserBar.kind=mac-light --set tilt[0].rx=8`
     previews a framed, tilted card without touching the file.

6. **Final render**: `vos render take out.webm --json` (or `--format mp4`).
   Re-frame the final (`frames --at-zooms`) against taste.md before declaring
   done. Renders are deterministic — only your edits change the output.

6b. **Human review round** (when the ask involves one): `vos open take`
   serves the take into the studio — your doc.json edits arrive intact and
   every zoom span is draggable.

7. **Package for the destination**: `references/destinations.md`.

## Launch kit (one take → every store asset)

From the SAME take that makes the video:
- Screenshots: `vos frames take --frame <t> --size 1280x800` per beat
  (Chrome Web Store wants ≤5 at 1280×800; pick apex times where each feature
  is composed).
- Tiles/banners: `--size 440x280` / `--size 1400x560` from suitably-framed
  moments (tiles need the subject centered — add a dedicated zoom span if
  needed; it costs one draft render to check).
- Promo video: the mp4 render, with `doc.audio` music if the destination
  plays sound.

## Gotchas

- Render time ≈ 1.5× real-time at 1080p (a 12.5s take ≈ 19s; ~5s fixed
  startup); `--parallel N` pays off on takes ≳30s (ignored when audio rides);
  2K ≈ 2× per-frame cost. Recording is always real-time.
- Footage resolution = viewport size — decide 2K at RECORD time.
- `vos plan take` regenerates only `source:"auto"` spans; manual spans survive.
- Take dirs: `frames/` is a deletable encode intermediate (~1GB at 2K);
  `recording.webm` is the re-render source — keep it.
- More failure modes: `references/troubleshooting.md`.
