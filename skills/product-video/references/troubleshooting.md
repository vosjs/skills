# Troubleshooting

## Exit codes

| Code | Meaning | Fix |
|---|---|---|
| 0 | ok | |
| 1 | error | read stderr; `--json` puts the message in the done event |
| 2 | usage error, or `--strict` failure | see below |
| 3 | no browser | `npx playwright install chromium`, or set `VOS_BROWSER_PATH` to a Chrome/Chromium binary |

## Strict-mode failures (exit 2)

`vos record --strict` exits 2 when a selector was skipped or a navigation
never reached networkidle, with `skipped[]` in the `--json` done event.

- A skipped selector means the flow is broken: the element wasn't there, the
  selector is unstable (nth-child chains), or the page needed more settle
  time. Fix the actions.json — never ship a take that silently skipped steps.
- Networkidle timeouts on pages with long-polling/websockets: add explicit
  `wait` steps after navigation instead of relying on networkidle.
- Always pass `--strict`. The lenient default exits 0 over broken flows,
  which is how bad takes ship.

## Freeze budget violations

The record done event reports `freezes[]` and `freezePct` (the screencast
only emits frames on visual change, so a static page records as
freeze-then-bang). Budget: ≤20% frozen, no single freeze >1.5s.

1. Pick flows where something in frame animates.
2. Hover things that respond with motion — those dwells become zooms too.
3. Trim dead heads/tails with `segments`; compress slow stretches with
   `speed` spans.

## Browser and environment

- **MP4 output needs system Chrome** (`--format mp4`); Playwright's bundled
  Chromium lacks the H.264 encoder. WebM works everywhere.
- **Headless WebGL**: if a render hangs at scene init on a CI box, the
  browser may lack GPU/SwiftShader flags. Prefer system Chrome; file an
  issue with the `--json` output if it persists.
- **Network**: the render page imports three/mediabunny from esm.sh —
  rendering needs outbound network. A fully offline sandbox can record
  nothing and render nothing; surface that limitation rather than shipping a
  broken artifact.
- Recordings served to a render page must come from a server that supports
  HTTP Range/206 (the CLI's own take server does) — video seeking hangs
  forever without it.

## Performance expectations

- Recording is always real-time (it drives a real browser).
- Render ≈ 1.5× real-time at 1080p with ~5s fixed startup; 2K is ~2× the
  per-frame cost; `--parallel N` pays off past ~30s of footage (ignored when
  audio is muxed).

## Take directory anatomy

| Path | What | Keep? |
|---|---|---|
| `recording.webm` | the re-render source footage | KEEP |
| `doc.json` | every editable decision | KEEP — this is the document |
| `actions.json` | the recipe that recorded it | keep for re-records |
| `frames/` | encode intermediate (~1GB at 2K) | deletable |
| `meta.json` | capture geometry | keep |

## Determinism

Renders are deterministic: same take + same doc.json = same frames, on any
machine. If two renders differ, the doc changed (diff it) — not the weather.
