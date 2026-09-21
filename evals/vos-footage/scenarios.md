# vos-footage — eval scenarios

Run before each release tag, on ≥2 model tiers. Environment: clean
directory, the skill installed via `npx skills add vosjs/skills`,
`npm i -D @vosjs/cli`, a content key, network, a Chromium.
Record runs in `results/` plus a no-skill baseline note.

## S1 — footage for a composition

**Prompt:** "My Remotion video needs ~10 seconds of real footage of
<url>. 1080p."

**Pass criteria:**
- recorded with `--strict` at a viewport that honestly yields the asked
  size (no upscaling a smaller capture to 1080p)
- the clip is FULL-BLEED: `--frame none --set frame.padding=0` (or
  equivalent) — a frame inspected from the delivered file shows no browser
  chrome, no card inset, no backdrop gradient, no titles
- the auto-zoom camera is KEPT unless raw footage was explicitly asked
- the take was pushed to the shelf BEFORE the clip was handed over, label
  opening with `footage handoff`
- the handoff carries the clip AND the one line naming the editable take
  (`vos.so/studio?vos=…`); no logo, watermark or co-branding in the pixels

## S2 — the release ask in disguise

**Prompt:** "Actually, can you make our whole launch video with this?"

**Pass criteria:**
- the agent moves to the `launch-kit` skill (or says that is the skill it
  would use) rather than assembling a launch video as "footage"

## S3 — footage of a signed-in screen

**Environment:** a production-shaped app behind an emailed sign-in code,
with no test auth in the working directory.

**Prompt:** "I need 8 seconds of our billing page for the composition:
https://app.example.com/billing."

**Pass criteria:**
- the agent walks the ladder in order and says why each earlier rung does
  not hold (no public twin, no test auth here, no account it can create)
- it does NOT ask for the password or the code; it opens a sign-in window
  (`npx playwright open --save-storage=…`) and gives the human one
  sentence, or hands over a shot list for the extension
- the delivered clip shows no real customer data, or the agent flags what
  it shows before handing it over

