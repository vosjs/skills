---
name: launch-kit
description: Ship the media with the release — one take of the real product becomes the demo video, the store listing (Chrome Web Store screenshots, tile, marquee), the Product Hunt gallery, the social cuts and the OG card, each composed in the brand's look, verified against per-channel specs and against the picture itself, judged beside a reference set, and pushed as a version labelled for the release. Use when asked "we're launching / shipping vN", "update the Chrome Web Store (Play, Shopify) listing", "make the launch video", "cut a changelog / what's-new clip", "PR to video", "refresh the demo for the new version", "make the Product Hunt gallery", or to produce a launch week's batch of clips in one style.
license: MIT
---

# Launch kit — ship the media with the release

You are producing a RELEASE's media, not a video: one take of the shipped
feature becomes every asset the release needs, composed, sized and verified
per destination, kept as an editable document so the NEXT release is a
re-render, not a re-shoot. Everything is data; the preview is the render;
export is free at every resolution up to 4K, no watermark; the engine is MIT.

The kit is made in ONE verb, `vos deliver`, and the verb carries the taste:
every card is a composition (a headline column beside the shot, or the shot
alone on a mesh), every cut opens on a move and closes on an end card, the
still moments come from the story, and two verifiers say what is wrong in
words. Your judgment goes into three files (`BRAND.md`, `LAUNCH.md`,
`actions.json`) and one decision (which moments are the story), never into
hand-cropping.

## Setup

```bash
npm i -D @vosjs/cli    # the vos CLI (take pipeline included)
```

`ffmpeg` on PATH covers what the CLI does not emit (the PH hover-GIF) and
lets `vos validate --picture` read a video's first and last frame. MP4
renders need system Chrome (`--format mp4`).

## 1. Establish the release

Four facts before any recording:

- **What shipped** — the feature, the version string, the URL where it runs.
- **Which destinations** — the per-channel spec table ships as data:
  `node_modules/@vosjs/cli/schema/channel-specs.json` (CWS, Product Hunt,
  X, LinkedIn, GitHub, OG, YouTube; sizes, counts, byte and duration
  ceilings, the word policy and the safe rect per destination, the poster
  template each card renders from; `references/channel-specs.md` is the
  same data as a table). **Loop over it, never hand-type dimensions.** Ask
  which channels this release ships to; default to last release's set. The
  JSON carries a `verified` date; if it is more than a quarter old,
  spot-check the channel docs before shipping.
- **The brand** — resolve it BEFORE authoring any asset, and never default
  to a template's own palette. The project folder's `BRAND.md` is the brand
  kit (frontmatter carries the colour roles `bgA bgB bgC ink accent`, the
  face roles `fontDisplay fontBody`, `logoUrl`, `wordmark`, and `look`, the
  presentation the site's own ground asks for: `plate` for a paper site,
  `dark` for a dark one, else `gradient`). Absent one, `vos brand <url>`
  witnesses it from the site's `/design.md`, `/llms.txt` and the page
  itself, and writes every role with its provenance; read it, correct what
  a page cannot say, and file it with `vos recipe push BRAND.md --folder
  <slug>`. Place it BESIDE the take (or in the take's parent folder):
  `deliver` reads it there with no flag.
- **The words** — `LAUNCH.md` beside the take carries the release's roles
  in its frontmatter, and `deliver` reads them with no flag:

  ```yaml
  headline: "Two to six words\nover up to three lines"   # the cards and the end card
  kicker: "PRODUCT  V2.1"       # absent = the wordmark plus --release
  music: upbeat                 # a catalog slug or mood; none = silent
  entrance: tilt-in             # tilt-in | pull-out | rise | none
  endCard: on                   # none switches it off
  captions: on                  # none switches the beat captions off
  look: plate                   # overrides BRAND.md's look role
  ```

  A headline is the ONE line the release says; write it over its lines with
  `\n`. With no headline the headline templates stand down for the
  headline-less one, and `deliver` says so.

The destinations decide the VIEWPORT, before anything records: footage
resolution = viewport, and a 1280×720 take cannot honestly fill a 1920×1080
video spec. Record at 1920×1080 for a 1080p kit, 2560×1440 when a
destination is larger.

If the work lands in a vos.so project (folder), pull it first and read every
`.md` recipe in it — `LAUNCH.md` binds this loop the way `CUT.md` binds a
cut. Recipes override this skill's defaults.

## 2. Source: one take of the real thing

The kit is made FROM the product, never from a mockup (store policy agrees:
misleading listing images are a removal-grade violation).

**Stage the content like a set before recording.** Half of what separates a
premium launch image from a screen grab is what is ON the screen. The
actions.json must leave the product in the state a proud screenshot would
show — labels typed, real-looking data, the feature mid-story — before any
poster or store still is cut. `deliver` drops a blank moment (a wallpaper,
an empty canvas) and says so, but it cannot stage the set for you.

**Write the story into `actions.json`.** Give steps an `id` (the moments
and the re-render loop address them by it) and a `caption` where a beat
deserves one (two to eight words; `deliver` lands it as a lower-third at
that step's moment on the cuts that take words). After a click that
navigates, put a `wait` for the load: the still is read at the END of that
wait, so the frame shows the page, never the spinner.

- **Fresh recording**: the `product-video` skill's loop (explore →
  `actions.json` → `vos record --strict` → tune `doc.json`). Keep
  `actions.json` in the repo — it is the next release's script.
- **Existing take**: cut it with the `vos-cut` skill. A hosted take comes
  home with `vos fetch <vosId|watch-url> --out dir --media`.
- **New version of a shot product**: re-record with `vos record` into the
  SAME take (the footage is replaced, the cut survives as `doc.prev.json`),
  then `vos plan take --reuse` re-times the cut onto the new recording and
  names what could not follow. Never start from scratch; every fix is an
  edit to `doc.json`.

A motion-graphic segment rendered elsewhere is an INPUT: it drops in as a
media overlay clip or a backdrop in the document, never the other way round.

## 3. Deliver

```bash
vos deliver take --to cws,producthunt,x,linkedin,og,github,youtube --release v2.1
```

One pass, and the verb decides what you used to decide by hand:

- **The moments.** Still times come from the STORY: every step's end plus a
  settle (the end of the wait that follows a click), then the zoom apexes,
  then a spread. Each candidate is read once as the real page; blanks are
  dropped, two of one frame collapse to one, every drop said in
  `skipped[]`. `--times step:<id>[+offset]` names one; `--shot-time <t>`
  picks the poster's shot.
- **The look.** `BRAND.md`'s `look` role (or `--look plate|gradient|dark`)
  presents the card on a ground at ~84% of the width with headroom, an
  ambient plus a contact shadow, a hairline when card and ground are both
  light; wide frames run the card off the bottom. Screenshot-genre stills
  never take a look: the store still is the real page, full bleed.
- **The cards compose.** Each card destination renders from its default
  template (`split-cover`: the headline column beside the shot, bled off
  the right and the bottom, the wordmark low-left; `card-on-gradient`: the
  shot alone on a mesh, the store's tile rule), filled with the brand's
  colours and faces and the release's words, the shot baked as an object
  (padded, rounded, shadowed). `--poster <split-cover|card-on-gradient|
  config.json|vosId|none>` overrides; your own template carries a
  `config.template` block (the contract `vos validate <dir>` checks).
- **The cuts move.** Every cut but the README loop opens on an entrance
  (tilt-in by default) and closes on an end card (the last frame holds while
  the headline, the release line and the wordmark rise, in the brand's ink).
  Destinations that play sound (the X cut, the YouTube demo, the vertical
  cut) take a music bed from `LAUNCH.md`'s `music` role and a click sound on
  every press when the take has no mic. The 9:16 cut is a reframe whose
  crop follows the camera, not a letterbox. A loop destination the take
  outruns takes the take's first seconds up to its cap.
- **The manifest.** `kit.json` beside the assets records every asset with
  its destination, the moment it came from, the template and the text boxes
  of every card, and `skipped[]` with every reason.

## 4. Verify: the specs, then the picture

```bash
vos validate kit/kit.json --picture
```

The spec pass re-measures every asset from its bytes (px, bytes, duration,
count, a WebP under a `.png` name). The picture pass says what each asset
LOOKS like, every finding with a code, a severity, a fix hint and a box:

| code | what fires |
| --- | --- |
| `blank` | a card whose subject is under the ink floor: a wallpaper, an empty canvas |
| `duplicate` | cards of one frame (two is a note; three or more fails) |
| `subject` | a card off the 60 to 92% band, or a crop where a card was asked for |
| `separation` | a light card on a light ground with no shadow and no drawn edge |
| `halfsize` | a tile that loses its edges when the store shrinks it |
| `sliced` | a headline crossing the frame edge |
| `safe` | words outside the destination's safe rect, or words where none are wanted |
| `contrast` | a text box under APCA Lc 60 (headline) or 75 (body) |
| `firstlast` | a cut that opens or ends on nothing, or bled on all four sides |

A problem is redone by fixing the INPUT (a moment, a word, the set, a
recipe line), never by hand-editing a PNG. Self-check by these names before
you render: a cold-open hero is `blank`, eight crops of one frame is
`duplicate`, a template's white words on a paper ground is `contrast`.

## 5. Judge beside the references

```bash
vos judge kit/kit.json --against <MANIFEST.json>
```

The manifest names the maker's reference set (a private folder: id, file,
role, layout, facts, rule per asset; the public evals reference it by
role). For every still with a reference of its role the verb writes two
sheets (the asset left, then right) and the rubric beside them, and leaves
`judge.json` with a slot per pair. Judge every pair BOTH ways, with the
rubric's numbered rules and the three positive tests (would you post it as
a still; does it read at half size; name three ways it acknowledges THIS
product), and write `win` true, false or null (a tie) with the rule
numbers. Parity with the references is 50%; a kit under 40% is not ready
to market, said in the handoff, never shipped around.

Skip the judge for a re-render whose inputs did not change (the same take,
the same words); run it when a template, a look, a headline or the set of
moments changed. Do not re-run `validate` or `judge` after a push unless
the human asks.

## 6. Push the release, file the kit

Push the source labelled for the release, and FILE the kit's stills into the
release's project so the human can retrospect without a terminal:

```
vos push take --label "v2.1 launch" --note "<what shipped, one line>"
vos folder move <vosId> --to <project-slug>
vos asset push kit/*.png --folder <project-slug>
```

End by handing the human the loop, not the files: the watch page plays the
latest version, the studio edits it, and `vos pull` brings their edits back
down. Next release, start at step 2's third bullet.

**Preserve the human's changes.** They edit the take in the studio outside
this conversation. If `vos pull --check` or the differ's `protected` set
shows a change you did not make, assume it was intentional or ask; never
overwrite it, and never re-plan over a manual span.

## Launch week (5-12 clips, one style)

A launch week is a series: cut and sign off ONE seed clip with the human
first, then cut every other feature's take with
`vos plan <take> --style <seed doc.json|vosId>` so the batch shares its look
by data. Never spread before the seed is signed off.

## Notes

- `deliver` is the procedure; this skill is the judgment around it (the
  set, the words, the moments, the verdicts). If you find yourself cropping
  a PNG by hand, the fix is a recipe line or a template, and you should say
  so in the handoff.
- Platform specs drift. The JSON carries a `verified` date; if it is more
  than a quarter old, spot-check the channel docs before shipping.
- The template family is two layouts today (`split-cover`,
  `card-on-gradient`). A perspective on the shot, a serif display face and
  a dark collage are the next rungs; a maker's own template is a program
  with a `template` block, pushed to the shelf and named by vos id.

## Avoid (the traps that shipped)

- A 720p recording against a 1080p spec: the destinations pick the viewport
  before anything records. Cost a full re-record once.
- A template's own palette on a deliverable: resolve `BRAND.md` (or
  witness the site) before any asset is authored, and put it beside the take.
- A cold-open hero (`blank`): the first frame is the marketing page's
  headline with the product nowhere; `deliver` reads the steps, but a
  script with no gestures gives it nothing to read.
- Eight crops of one frame (`duplicate`): a script with one moment. Give the
  story steps, and waits after the clicks that navigate.
- A store screenshot under the frame chrome or the camera zoom: the store
  still is the real page, full bleed (deliver's default, and `--composed`
  is refused by the picture pass).
- The loading plane as the hero: a click that navigates settles when the
  wait after it ends; a click with no wait after it is read 0.4 s later,
  mid-load.
- White words on a paper ground (`contrast`): the end card takes the brand's
  ink; a template's kicker softened too far reads under the floor.
- A card that is WebP under a `.png` name: `vos still` writes WebP; convert,
  then `vos validate` reads the bytes and says so.
- Padding a spec floor: a 36 s story is a skipped 60 s demo, with its reason.
- A hand-typed dimension: every size comes from `channel-specs.json`.
- The save beat on a demo instance that disables writes: say so in
  `skipped`, never fake the click.
