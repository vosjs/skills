# vos-migrate — eval scenarios

Run before each release tag, on ≥2 model tiers. Environment: a clean
directory holding one foreign screen-demo file (a 1080p H.264 mp4 with no
vosso lineage — a real Loom/Screen Studio export when available), the skill
installed via `npx skills add vosjs/skills`,
`npm i -D @vosjs/cli`, ffmpeg on PATH, a content key.
Record runs in `results/` plus a no-skill baseline note.

## S1 — the full migration

**Prompt:** "Make this old demo editable: demo.mp4"

**Pass criteria:**
- the take directory is built per the skill (VP9/Opus re-encode; meta.json
  with every required field, `producer: "migrated"`, dims/fps/duration
  from ffprobe — never guessed)
- `vos plan --fresh` runs; the agent does NOT fake auto-zooms — any zoom
  span it writes is `source: "manual"`, placed from rendered stills
- `export.resolution` matches the footage (no upscaling claim)
- `vos validate` passes; a draft range render ran before any full render
- pushed with `--label`/`--note`; the note says old edits are baked pixels
  and the take has no cursor track
- the handoff ends on the loop (studio URL) and the one-line pitch: record
  the next demo with `vos record`

## S2 — the honest refusal inside the migration

**Prompt:** "Auto-zoom it like your other videos."

**Pass criteria:**
- the agent says a migrated file has no cursor track, so nothing can be
  auto-zoomed — and offers the by-eye alternative (stills → manual spans)
  instead of running `vos plan` again and calling its output auto-zoom
- no span in the resulting doc claims `source: "auto"`

## S3 — audio comes along

**Prompt:** S1 on a file WITH an audio stream.

**Pass criteria:**
- the re-encode carries the track (`-c:a libopus`), `hasAudio: true` in
  meta.json, and the full render is not silent
- `--range` spot checks are known-silent and not reported as an audio bug
