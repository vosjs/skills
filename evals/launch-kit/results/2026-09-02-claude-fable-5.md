# 2026-09-02 · claude-fable-5

Run type: two full real executions as an outside maker on the published
pair (`@vosjs/cli` 0.8.4 + `@vosso/vos-plugin` 0.19.0 from npm), each a
complete Chrome Web Store + OG + GitHub kit for an open-source product with
a live browser demo: Harper v2.9 (writewithharper.com) and Karakeep v0.33
(try.karakeep.app). Scored retrospectively against S0 to S5 plus the two
scenarios this run added (S6, S7). Deterministic count: the kit verifier
(`vos validate kit.json`, plugin 0.20.0) re-run on both final kits today.

- **S0 PASS** — destinations from channel-specs.json, 2K viewport chosen
  from the video specs before recording, `BRAND.md` witnessed from each
  product's site before any asset, `--label` on both pushes, both kits
  filed into a project with channel names, handoff on the loop.
- **S1 PASS with a finding** — moments from the apexes, exact spec pixels,
  `kit.json` with measured dims/bytes. FINDING (now S6): the store
  screenshots came out ZOOMED and under the frame chrome, because deliver
  applied the cut's camera and the mac bar to screenshot-genre stills;
  and a 2K frame of a text editor is mostly blank at store size. Fixed in
  the plugin (0.20.0: screenshot genre is the real page, full bleed, no
  zoom, `--composed` opts back in); the honest store still for a
  text-heavy product was a second take at 1280x800.
- **S2 PASS** — README loops 16 s, 0.9 MB and 6.2 MB, under the ceiling.
- **S3 not run** — no X cut was asked for.
- **S4 PASS by the verifier, FAIL by hand** — the verification answered
  from the manifest, but the hand-assembled Harper kit carried four cards
  that were WebP bytes under `.png` names (`vos still` writes WebP; the
  conversion step was skipped once). `vos validate kit.json` (0.20.0) reads
  the bytes and caught it; `vos still` now refuses a `.png` name
  (vosjs/vos #105). Deterministic count after the fix: Harper 0 problems
  across 11 assets, Karakeep 0 across 11.
- **S5 PASS with a finding** — split-cover poster program re-skinned from
  the witnessed brand; type in its own column. FINDING (now S7): the shot
  baked into the poster was the first still time (the cold open), and
  `--poster-time` is the poster's own clock, so there was no way to name
  the take moment; the shot had to be cut and baked by hand. Fixed:
  `--shot-time <t>` (0.20.0). Second finding: the seed's words and image
  are literal element fields, not `data` bindings; the skill says so now.
- **S6 (new) PASS after the fix** — store screenshots are the real page,
  full bleed, no zoom, no chrome; `--set frame.focus` keeps an app's
  sidebar in the 16:10 crop.
- **S7 (new) PASS after the fix** — the poster shot is a zoom apex named
  with `--shot-time`, not the cold open.

Not an S-scenario but recorded: deliver's card PNGs carry grain and ran
over the 1 MB OG/social ceiling on one product; the `vos still` route lands
at 60 to 850 KB. Second model tier owed.

Count (`node evals/count.mjs`, re-run on the two final kits with plugin
0.21.1): `0 problems across 22 assets on 2 kits`.
