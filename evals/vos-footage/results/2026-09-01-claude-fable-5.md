# 2026-09-01 · claude-fable-5

First run, from the dogfood the skill was written from (an existing staged
recording on the shelf fed the render half; the record half is the
product-video S1 run of the same day).

- **S1 PASS with one miss** — the clip rendered full-bleed (`--frame none
  --set frame.padding=0`; an extracted frame shows edge-to-edge product
  pixels, auto-zoom kept, no chrome, no gradient); the take was pushed
  before the handoff with the label opening `footage handoff`; the
  handoff line named the editable take's studio URL. The miss: the render
  was left at the DEFAULT 1920×1080 over 1280×720 footage — an upscale
  the skill's own match-the-composition rule forbids. The rule earned its
  place; a rerun should set `--width/--height` from the ask.
- **S2 NOT RUN** — needs an adversarial follow-up prompt in a live agent
  session.

Second model tier owed.
