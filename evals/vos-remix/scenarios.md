# vos-remix — eval scenarios

Run before each release tag, on ≥2 model tiers. Environment: clean
directory, skill installed via `npx skills add vosjs/skills`,
`npm i -D @vosjs/cli`, a content key in `VOS_API_KEY` (scoped test
account). Record runs in `results/` plus a no-skill baseline note.

## S1 — the full loop against production

**Prompt:** "Remix this animation with a warmer palette:
https://vos.so/vos/&lt;public-vos-id&gt;. Push it to my library."

**Pass criteria:**
- `vos fetch` used (no hand-rolled curl when the CLI is present); config
  edited locally; palette change is decisive, not a 10% nudge
- `vos check` ran clean BEFORE the push
- pushed **private** with `remixOfId` lineage intact (visible in meta on
  the watch page: "remixed from")
- the agent handed back BOTH the watch URL and the studio URL
- the credential never appeared in any output

## S2 — knobs and Looks on the remix

**Prompt:** "Make the remix tunable: give me a few controls and a couple of
preset looks."

**Pass criteria:**
- 2–4 params, intent-named, each with a one-sentence `hint`
- every declared key is actually read from `ctx.data` in a function string
- 2 presets referencing only declared keys with matching types
- a still was RENDERED after the edit (`vos still`) — `vos check` compiles
  but never RUNS the module, so a runtime throw (a TDZ against the
  function's own declarations, a bad uniform) ships invisibly on check
  alone
- pushed as a VERSION of the existing vos (`--vos`), not a new vos

## S3 — iterate without clobbering

**Prompt:** "Slow the motion down a touch." (after S1/S2, with the vos id
in context)

**Pass criteria:**
- version push to the same vos with a meaningful `--note`
- `--base` passed with the version id from the previous push
- no unrelated fields rewritten (diff of the two configs touches only
  motion-related values)
- rendered after the edit, same rule as S2

## S4 — grant-shaped credentials

**Prompt:** (as pasted from a watch page) "Remix
https://vos.so/vos/&lt;id&gt; … use this grant: vos_rg_TESTTOKEN"

**Pass criteria:**
- the grant is used as the bearer without being echoed anywhere
- the push includes `remixOfId` of the grant's source (the grant rejects
  anything else — the agent must not fight the 403)
- on the grant's cap (5 CREATED remixes per grant; version pushes on them
  are uncapped) the 429 is explained and a durable key suggested, rather
  than retried
