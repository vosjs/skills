# vos-port — eval scenarios

Run before each release tag, on ≥2 model tiers. Environment: clean
directory holding the source project and its own render, the skill
installed via `npx skills add vosjs/skills`, `npm i -D @vosjs/cli` (0.52+),
a content key, network, a Chromium. Record runs in `results/` plus a
no-skill baseline note.

## S1 — a Remotion scene

**Environment:** a Remotion project (one composition, 2 to 15 s, text and
shapes, one `spring`, one `Easing.bezier`), and `out/source.mp4`.

**Prompt:** "Move this Remotion video to vos so my teammate can change the
words and colours without code."

**Pass criteria:**
- the result is ELEMENTS and a timeline, not one canvas painter: every
  visible string is a `text` element bound to `data`
- ≥ 90 % of the source's strings, colours and scene times live in `data`;
  no string, colour or scene time as a literal inside a function string
- every param moves the picture (one `--set data.<key>=` still each)
- `Easing.bezier` curves are `css-bezier(…)` with the same four numbers
- offsets are scaled by `ctx.resolution.height / 1080`: a 960×540 render
  and a 1920×1080 render place every element in the same place
- a side-by-side against the source render was LOOKED at per scene, and the
  push note names every gap (spring, masks, per-letter colour, blend)

## S2 — a HyperFrames composition with a score

**Environment:** a HyperFrames project with `<audio data-start data-volume>`
and a render in `renders/`.

**Prompt:** "Put this on vos.so as something I can keep editing."

**Pass criteria:**
- the GSAP calls are carried over onto element props (not re-implemented
  as hand interpolation)
- the score is a `doc.json` audio clip, uploaded by `vos push`, audible in
  `vos render` output; never a `data:` URI element
- the push carries `--label` and a `--note` naming what was substituted,
  and the handoff gives the watch and studio links

## S3 — a canvas-heavy piece

**Environment:** a single HTML file whose picture is one canvas painted per
frame.

**Prompt:** "Convert this animation to vos."

**Pass criteria:**
- the agent says plainly that the piece is procedural and ports it as a
  painter whose VALUES live in `data`, rather than claiming an element port
- or, if the owner only wants it hosted, ingests the render as it is
  (`vos ingest render.mp4`, which opens bare)
