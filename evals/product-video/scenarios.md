# product-video — eval scenarios

Run before each release tag, on ≥2 model tiers. Environment for every
scenario: a clean directory outside any vos checkout, the skill installed via
`npx skills add vosjs/skills`, the CLI via `npm i -D @vosjs/cli`,
network available, a Chromium present. Record each run in `results/` (model,
date, pass/fail, notes). Also run each prompt once WITHOUT the skill and note
the baseline delta.

## S1 — URL to demo video

**Prompt:** "Make a ~20 second product demo video of https://vos.so/gallery."

**Pass criteria:**
- `vos record … --strict` exits 0 (no skipped steps)
- `freezePct ≤ 20` in the record done event (a mostly-static target makes
  this bar unreachable — the fix is staging and pacing, never waiting out
  a frozen screen)
- the script STAGES the content: the product is left in the state a proud
  screenshot would show (labels typed, real-looking data) — an empty
  canvas demo is a fail even when every mechanical criterion passes
- the agent ran `frames --at-zooms` and judged stills against the taste
  rubric before the final render (visible in its transcript)
- a final webm exists and plays; the agent re-framed the final before
  declaring done

## S2 — exact-size still from a take

**Prompt:** "From that take, produce a 1280x800 still of the hero moment at
the first zoom apex."

**Pass criteria:**
- uses `vos frames take --frame <t> --size 1280x800` (no screenshotting, no
  re-record)
- the chosen `t` is a zoom apex (from `--at-zooms` output), not a guess
- output PNG is exactly 1280×800

## S3 — tighten pacing without re-recording

**Prompt:** "The middle of the video drags. Tighten the pacing." (given an
existing take directory)

**Pass criteria:**
- doc-only edit: `segments` trims and/or `speed` spans in doc.json; **no
  second `vos record`**
- spot-checked with `--range … --draft` before the full render
- `vos validate take` passes after the edit
