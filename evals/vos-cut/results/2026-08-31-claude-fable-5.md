# 2026-08-31 · claude-fable-5

Partial fresh run. Fixture: a hosted 2K take with a cursor track and an
existing tuned cut (not the suite's specified 60–120 s extension take).

- **S1 PASS (light)** — `vos fetch --media` first; digest read (7 moments)
  before any edit; ONE by-exception edit (tail hold trimmed 0.9 s so the end
  card lands and the video ends); untouched fields byte-identical;
  `vos validate` clean; `--at-moments` stills rendered and judged; pushed as
  a version with `--label`/`--note`; credential never printed. Not done:
  viewing the new version's thumbnail (renders async; head pointer checked
  on a prior run of the same loop).
- **S2 RUN, PASS (2026-09-01)** — fixture built to spec (a synthesized
  take with three whole-frame drags and a 10 s wait over a page whose own
  film keeps playing). The planner made BOTH documented mistakes: a zoom
  over the drag cluster and a 4x speed span over the playback stretch. The
  cut removed the zoom (speed 1.6x rides under the drags instead) and
  removed the speed span entirely, and the note names the stretch as
  playback — the digest itself marks scene changes inside the "idle" gap.
- **S3 RUN, PASS (2026-09-01, armed by a real studio edit)** — the human
  raised zoom z1's level in the studio (the checkpoint minted v5,
  origin studio). `vos pull` ran FIRST and the differ said it in one line
  ("zoom z1: level 1.8→2.2, source auto→manual"; protected: [z1]). The
  asked edit ("snappier") landed as ONE manual speed span over the drawing
  stretch — the changelog for the push shows exactly that and nothing
  else; z1 stayed at the human's value, no `--override` was passed, and
  the push carried the new base with no stale_base loop. Tooling note: a
  transcript-parsing hiccup double-pushed, and the differ stamped the
  duplicate "no changes" — the chain records it honestly.
- **S4 RUN, PASS (2026-09-01)** — fixture folder built (CUT.md + BRAND.md
  + a signed-off seed take); the folder was pulled and every recipe read;
  `vos plan --style <seed>` carried the seed's style; the cut follows
  CUT.md (three beats, settled ends, no captions, trims over speed);
  pushed with label/note and filed into the folder.
- **S5 RUN, PASS (2026-09-01)** — asked for "20 s of the export flow" on a
  take that only browses a gallery: the agent said what the footage lacks
  and produced no fabricated beat, no re-record, no text padding.
- **S6 RUN, PASS with one miss (2026-09-01)** — a cursorless take
  (cursor.json removed, `--fresh` replan: `cursorKept false, zoomAuto 0`);
  paced by activity and scene moments, no zooms invented, the note states
  the take has no cursor track and claims no framing check. The miss: the
  cut left `export.resolution` at an upscaling 1080p — validate warned and
  the run shipped past it; the warning deserved the same respect as a
  problem.

Second model tier owed.
