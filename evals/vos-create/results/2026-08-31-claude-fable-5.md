# 2026-08-31 · claude-fable-5 (fixtures built and run 2026-09-01)

Fixture shelf built to spec: a Ribbons folder (DESIGN.md naming the axes,
TASTE.md the judging bar, the signed-off warm-split program as seed) and a
brief-only Brand folder (BRAND.md, no mechanism, no members).

- **S1 PASS** — folder pulled, every recipe read; the seed's config varied
  on DESIGN.md's axes (8 rows at tighter spacing, ember redistributed, 12 s
  per the recipe); `vos check` clean; the still judged against TASTE.md
  before the push; pushed with `--folder`/`--label`/`--note`.
- **S2 PASS, and the judging caught real failures** — DESIGN.md carried
  "seed only, do not make variants yet"; the run said so in one line and
  followed the ask: six variants on density x palette together (never just
  hues). Judging the stills against TASTE.md failed BOTH sparse variants
  (no ribbon crossing at the judged frame — rows sat too far apart to
  intersect); fixed and pushed as v2 of each. The dense-teal member's
  ground reads slightly teal — borderline against the dim rule, noted, not
  reshipped.
- **S3 PASS, one brand violation caught and fixed** — brief-only folder:
  authored fresh under BRAND.md (violet on near-black, Lexend, calm), two
  intent-named params each verified BY RENDERS at both ends. The first
  render's ground came out mid-grey against the brand's #17161d floor: the
  canvas texture missed its sRGB colorSpace and read as linear (the
  documented linearization trap, in its other direction). Fixed, verified
  near-black, pushed as v2.
- **S4 PASS** — recipe made stale (says 8 s; the recent members run 12 s):
  the new member follows the exemplars at 12 s, the staleness is told to
  the user and appended to the recipe under a dated `## Agent notes`
  heading via replace-in-place — the owner's rules untouched.

CLI notes from the runs, reported upstream: a bare `vos push config.json`
after a program CREATE minted a remix chain instead of versioning the
tracked vos (explicit `--vos` is correct); version pushes with a key and no
tracked base are refused (by design) and want `--base <head>`.

Second model tier owed.
