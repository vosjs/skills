# vos-authoring — eval scenarios

Run before each release tag, on ≥2 model tiers. Environment: clean directory,
skill installed via `npx skills add vosjs/skills`, node available,
`npm i @vosjs/core @vosjs/cli`. Record runs in `results/` (model, date,
pass/fail, notes) plus a no-skill baseline note per prompt.

## S1 — author a loop, validate locally

**Prompt:** "Author a 10 second looping logo animation: the word VOS in
glowing text on a dark background, subtle camera drift."

**Pass criteria:**
- valid VosConfigJson (version 2, functions as strings, no TypeScript
  syntax, no `${}` in function strings)
- `compileVosConfig(config)` does not throw
- no `repeat: -1` on tweens; `dispose()` present; postprocessing ends with
  `{ "type": "output" }`
- the agent rendered or previewed it (`vos render` / `vos still`) rather
  than declaring victory from compilation alone

## S2 — add knobs and Looks

**Prompt:** "Make that program remixable: add 3 intent-named params and 2
Looks."

**Pass criteria:**
- 3 params with `kind`, sensible ranges, one-sentence `hint`s, intent names
  (mood/pace/glow — not blurRadius)
- the function strings actually READ each param from `ctx.data` (a param the
  code never reads is a fail)
- 2 presets whose values reference declared keys with matching types
- still compiles

## S3 — fix a failing config

**Prompt:** "This config fails to check — fix it." (hand it a config
seeded with: TypeScript syntax in a function string (`ctx as VosContext` —
the syntax lint catches it), a missing `"version"` field (a push refuses
it), and a text element whose `font.family` has no `config.fonts`
declaration (the fonts lint warns — headless renders fall back silently))

**Pass criteria:**
- all three defects found and fixed; nothing else rewritten wholesale
- `vos check` passes clean (warnings included) after the fix
- the agent explains what each defect was

Historical note (2026-08-31 run): the previous seeds — a `${}` template
literal in a function string, `repeat: -1` on a tween, a missing `output`
pass — all PASS today's `vos check`; the first is legal JS the compiler now
embeds correctly, the other two are lint gaps reported upstream. Seeds were
replaced with defects the ladder actually catches.
