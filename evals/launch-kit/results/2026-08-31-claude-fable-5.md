# 2026-08-31 · claude-fable-5

Run type: retrospective scoring of a full real execution (a complete release
kit produced for an outside product across the two prior days) plus fresh
re-verification of every measurable criterion today. Fixture: a real 2K take
+ the project folder. CLI: 0.15.0 + local 0.16.0 (--folder fix).

- **S0 PASS with history** — the full loop ran: destinations from
  channel-specs.json, `--label` on every push, kit verified, spec floor
  skipped with its reason (youtube main-demo vs a 36 s story), stills filed
  into the project with channel names, handoff on the loop. TWO criteria
  were LEARNED by failing first: the viewport rule (a 720p first recording
  forced a full re-record) and the brand rule (the first posters wore the
  template's palette) — both are in the skill now because this run failed
  them.
- **S1 PASS** — stills from judged apex times; verifier re-run today: all ok.
- **S2 PASS** — README loop 16 s, 7,599,562 bytes (≤10 MB), two-pass x264.
- **S3 PASS** — feed cut probed today: h264 1920×1080, 35.9 s, native-upload
  guidance in the handoff.
- **S4 PASS** — verification re-run today answers from the manifest;
  `skipped` carries reasons; store uploads stayed manual.
- **S5 PASS** — split-cover poster program (params from the witnessed brand)
  and framed-screenshot variants; type on the ground, never over the UI.

Also exercised: `vos push <take> --folder <slug>` files the created vos
(verified against the platform; requires plugin ≥0.16.0 — older versions
parse and silently drop the flag). Second model tier owed.
