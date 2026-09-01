# 2026-08-31 · claude-fable-5

Fresh run. Fixture: none needed (S1 records live). CLI: local build of
@vosso/vos-plugin 0.16.0 (unreleased --folder fix; verbs otherwise 0.15.0).

- **S1 PASS** — first attempt: `--strict` exited 2 on a bad tag-chip
  selector (the discipline working); fixed the flow, re-recorded: 0 skipped,
  `freezePct 20` (at the bar), zoom apex judged from `--at-zooms` before the
  final render, final re-framed. Note: cut ran 14.2 s against the ~20 s ask.
- **S2 PASS** — 1280×800 still at the apex (t=4.01 s from `--at-zooms`),
  measured exactly 1280×800.
- **S3 PASS** — doc-only: one manual speed span (6..10 @2×), `vos validate`
  clean, spot-checked with `--range 5..11 --draft`; no second record.

Not done this run: the no-skill baseline. Second model tier owed.
