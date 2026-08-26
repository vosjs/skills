# vos-cut eval scenarios

Run before each release tag, on ≥2 model tiers. Environment: clean
directory, skill installed via `npx skills add vosjs/skills`,
`npm i -D @vosjs/cli @vosso/vos-plugin`, a Chromium, a content key in
`VOS_API_KEY` (scoped test account) whose shelf holds one hosted take
(60-120s, recorded with the extension, a cursor track) and one folder with
a signed-off take, a `cut.md` and a `brand.md`. Record runs in `results/`
plus a no-skill baseline note.

## S1: cut a take with no ask

**Prompt:** "Cut https://vos.so/vos/<id> into a product video."

**Pass criteria:**
- `vos fetch <id> --media` (or `vos pull --media`) ran before anything else;
  the recording was never opened as a video by the agent
- `vos digest` ran; the agent read `digest.json` and `sheet.png` before
  editing `doc.json`, and read at most a handful of crops
- the version note STATES the ask the agent cut to (where, which flow, how
  long, voice or not) and lists the beats with source seconds
- `doc.json` was edited, not rewritten: fields the agent did not touch are
  byte-identical; every span the agent wrote carries `"source": "manual"`;
  no pixel values in `cx`/`cy`/`transform`
- `vos validate` ran clean, framing warnings included; `vos frames
  --at-moments --at-zooms` ran and the stills were judged before the push
- pushed with `--label` (≤60 chars) AND `--note`; the agent fetched
  `GET /api/vos/{id}` and viewed `contentUrls.thumbnail` before reporting
- the credential never appeared in any output

## S2: the planner's proposals are wrong in the two known ways

**Prompt:** same as S1, on a take whose cursor track has (a) a click cluster
of drags spanning most of the frame and (b) a 10s gap with sustained frame
activity (the recording's own video playing).

**Pass criteria:**
- the whole-canvas cluster got NO zoom; the agent put speed under the drags
  and, if the recording is an editor, a zoom on the lane where the result
  appears
- the "idle" gap got NO speed span; the agent named it as playback in the
  note
- neither decision required the human to point it out

## S3: the human corrected a draft

**Prompt:** "Make the export part snappier." (the human has meanwhile
changed one zoom span's level in the studio, creating a newer version)

**Pass criteria:**
- `vos pull` ran first and the agent read the differ's summary of the
  human's change
- the human's changed span was left at the human's value; a push that
  touched it would have 409ed and the agent did not use `--override`
- only the moments of the named beat were edited; the note names them
- the push carried the new base (no `stale_base` retry loop)

## S4: a series member from a folder

**Prompt:** "Cut https://vos.so/vos/<id> like the others in my Product
videos folder."

**Pass criteria:**
- the folder was pulled and every `.md` (own and inherited) was read
- `vos plan <take> --style <seed>` ran before the cut; the member's style
  fields equal the seed's; no recipe number was retyped into the doc
- the cut follows `cut.md`'s beat list and text rule (captions per beat at
  the recipe's cadence, boxed where the recipe says)
- pushed `--folder <slug>` with `--label`/`--note`

## S5: the footage cannot carry the ask

**Prompt:** "Make a 20s video of the export flow." (the recording never
reaches an export)

**Pass criteria:**
- the agent says so, in the note or the reply, naming what the footage
  lacks, and does not fabricate a beat, re-record, or pad with text
- at most a best-effort cut of what the footage does show, clearly labelled

## S6: a browser-recorder take (no cursor track)

**Prompt:** same as S1, on a take with `hasCursor: false`.

**Pass criteria:**
- the agent paced by `activity` and the scene moments, added zooms only
  where the ask named a place, and said in the note that the take had no
  cursor track
- no framing warning was possible and none was claimed
