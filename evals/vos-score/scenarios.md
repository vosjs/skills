# vos-score: eval scenarios

Run before each release tag, on at least two model tiers. Environment: a
clean directory holding the program (`config.json`, and `doc.json` when it
has one), the skill installed via `npx skills add vosjs/skills`, python3
3.9+, ffmpeg with libmp3lame, `npm i -D @vosjs/cli`, network. Record runs
in `results/` plus a no-skill baseline note (the baseline usually picks a
catalog track by mood and never checks where its beats fall).

## S1: a dance program on a beat grid

**Environment:** a one-minute program whose motion is keyed to a grid in
its own code (`const P = 60 / <bpm>`, a plan table of sections by bar), a
catalog track on its `doc.json`.

**Prompt:** "The music on this one is not right. Can you make it a proper
soundtrack?"

**Pass criteria:**
- the spec's `bpm` and `bars` are the program's, read from its code, and
  its sections are the program's sections by bar, each with a `picture` line
- the riff and the hook are new (not the example's, not a known record's),
  and the push note names the genre and the harmony
- `analyze.py score.mp3 --spec score.json --lufs -16` passes every check:
  the fit within 0.05 BPM and beat 1 within 0.02 s of t = 0, the energy
  order, one biggest section, no holes, the ring-out
- the MP3 was made with `master.py` (or an equivalent constant gain), not a
  single-pass dynamic normalizer
- `doc.json` carries the score with `start: 0`, `in: 0`, `out` and
  `duration` equal to the program's length, the name `<title>, composed for
  this film`, and no artist credited
- a preview was rendered and one frame looked at
- the handoff asks the person to LISTEN before promoting it, and says the
  numbers cannot judge whether it is good music

## S2: a product reveal with scenes and no beat

**Environment:** a 20 s program with five `tl.addLabel` scenes at times
chosen by eye, no tempo anywhere.

**Prompt:** "Add some background music that hits the scene changes."

**Pass criteria:**
- the agent picks a BPM whose bar lines fall near the scene times and says
  how far off each lands; when it owns the program it offers (or makes) a
  retime of the labels onto the bars
- each scene change gets an entrance (a crash, a hit) or a fill into it,
  and the biggest scene gets the most energy
- the checks pass as in S1

## S3: a fix after listening

**Environment:** S1's result, and the person's reply: "the drop does not
hit hard enough, and the end feels cut off".

**Pass criteria:**
- the agent edits the SPEC (the drop's `energy`, the ending's hits or
  ring), never the master gain or the MP3, composes again, and the analyzer
  shows the drop's step over the groove grew
- the push is a new version of the same vos with a note saying what
  changed, and the agent asks the person to listen again
