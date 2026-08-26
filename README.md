# vos skills

Agent skills for [vos](https://github.com/vosjs/vos), the open source
deterministic video engine, and the `vos` CLI. Install once and your coding
agent can record product demo videos of real websites, cut launch stills
from the same take, and author vos animation programs.

```bash
npx skills add vosjs/skills
```

Works with any agent that reads the [Agent Skills](https://agentskills.io)
format (Claude Code, Cursor, Codex, and friends). Claude Code users can also
add the repo as a plugin marketplace: `/plugin marketplace add vosjs/skills`.

## The catalog

| Skill | What it does | Needs |
| --- | --- | --- |
| [`product-video`](skills/product-video/SKILL.md) | Record and produce a shippable product demo video of a website, app, or feature: the agent drives the browser from a JSON script, the recording auto-plans zooms, and every edit is a JSON patch on `doc.json`. One take also yields exact-size store screenshots, tiles, and social stills. | `npm i -D @vosjs/cli @vosso/vos-plugin`, a Chromium, network |
| [`vos-authoring`](skills/vos-authoring/SKILL.md) | Author vos animation programs (VosConfigJson) from scratch: schema, dialect rules, params/presets knobs, local validation with `@vosjs/core`. | `npm i @vosjs/core` (validation), `@vosjs/cli` (render) |
| [`vos-remix`](skills/vos-remix/SKILL.md) | Remix a program from the vos.so gallery: fetch its config, edit knobs or code, validate locally, push a private copy back with lineage — then iterate it as versions. Ships the params/Looks doctrine (2–4 intent-named knobs, every knob verified to act). | `npm i -D @vosjs/cli @vosso/vos-plugin`, a content key or remix grant |
| [`vos-create`](skills/vos-create/SKILL.md) | Create vos programs in the user's own style: pull their vos.so folder, read every recipe (`.md`) and exemplar in it, find the declared seed, author work that follows them, check and render and judge locally, and push into that folder as attributed private versions. Recipes carry the style; the user's ask decides what gets made. | `npm i -D @vosjs/cli @vosso/vos-plugin`, a content key, a folder on vos.so |
| [`vos-cut`](skills/vos-cut/SKILL.md) | Cut a screen recording somebody made into a product video, from its evidence: `vos digest` lists the moments the cursor track says mattered with a footage frame and a crop each, the agent narrates them into beats, edits `doc.json` by exception over the planners, verifies with stills, pushes an attributed version, and iterates with the human through the version chain. A signed-off take becomes a series' seed: its folder's `CUT.md` carries the judgment, `vos plan --style` carries the numbers. | `npm i -D @vosjs/cli @vosso/vos-plugin`, a Chromium, a content key for hosted takes |
| [`launch-kit`](skills/launch-kit/SKILL.md) | One take → the full launch asset kit: YouTube demo + thumbnail, X/LinkedIn cuts, Chrome Web Store screenshots + tiles, Product Hunt gallery, GitHub README loop, OG cards. Per-channel specs ship as data and every asset is verified against them in a `kit.json` manifest. | `npm i -D @vosjs/cli @vosso/vos-plugin`, ffmpeg, a finished take |

One CLI, two packages: `@vosjs/cli` is the MIT `vos` binary and the engine
verbs (local, no account); `@vosso/vos-plugin` adds everything else — the
take pipeline (record, plan, frames, render on screen recordings) and the
vos.so platform verbs (fetch, push, pull, login). Both are free to use;
`@vosso/vos-plugin` is proprietary, source-available. (It was previously
published as `@vosso/cli`; that name keeps working as a forwarding shim.)

## Why these are different

- **Real footage, witnessed.** `product-video` drives a real browser over a
  real page. The output is a recording of software actually working, not a
  synthesized imitation of it.
- **Edits are data.** A take's every decision (zoom spans, trims, speed,
  tilt, audio) lives in `doc.json`. Agents patch JSON and re-render; nothing
  re-runs the browser.
- **Deterministic renders.** Same take, same doc, same frames, on any
  machine. Video work becomes reviewable the way code diffs are.

## Quality

Every skill ships with eval scenarios in [`evals/`](evals/), run before each
release on two model tiers. The `product-video` skill carries the taste
rubric its outputs are judged against; if a run ships something ugly, that
failure becomes a new eval scenario.

## Links

- Engine: [github.com/vosjs/vos](https://github.com/vosjs/vos) · [vos.so/engine](https://vos.so/engine)
- Agent docs: [vos.so/llms.txt](https://vos.so/llms.txt) · [vos.so/agents](https://vos.so/agents)
- The gallery (every video is a program): [vos.so/gallery](https://vos.so/gallery)

## Contributing

Issues and PRs welcome. Keep SKILL.md under 500 lines, references one level
deep, and run `node scripts/check.mjs` before pushing. Skill text must match
what the released CLI actually does; a claim the CLI can't honor is a bug.
