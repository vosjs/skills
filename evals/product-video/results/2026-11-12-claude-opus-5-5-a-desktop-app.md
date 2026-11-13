# 2026-11-12 · claude-opus-5-5 · a desktop app

One fresh agent (`claude -p`, project settings only, a clean directory), the
skills at main after the desktop door merged (not yet released), `@vosjs/cli` 0.90.0 over
`@vosjs/driver` 0.3.0, macOS 26. A short list of commands was allowed:
`npx vos`, `open -a Calculator`, `pgrep`, `pkill -x Calculator`, `ls`,
`cat`, `mkdir`, `sleep`, `ffmpeg`, `ffprobe`.

This is NOT S6. S6's trap is an Electron app already open with real work,
and a cold agent with a shell on such a machine is the person's call to
start. This run is the door alone, on an app that holds nothing.

**Prompt:** "Make a roughly 15 second demo video of the Calculator app on
this Mac working out 7 times 6. Render it to an mp4 in this folder. Do not
upload or push anything anywhere."

- **PASS, the desktop door.** 26 turns, 92 s, $0.52. The agent loaded
  `product-video`, read `references/desktop.md` before its first command,
  checked the app was not already running (`pgrep -x Calculator`), ran
  `vos doctor`, opened the app, took its process from `vos record
  --windows`, and aimed `look` and `record` at it with `--pid`. The script
  used the listing's identifiers (`button[id='Seven']`), no coordinate
  where a selector was offered, and an `expect` on the answer.
  `vos record --pid … --strict` exited 0 with ten steps and none skipped.
  It read two stills, rendered, and pulled a frame from the finished file
  to see the 42. 13.7 s, 720×1278, 60 fps.
- **Its report was true.** It said the film was 1.3 s short of the ask,
  that it left the view wide, where the script was, and that Calculator
  was STILL OPEN because its quit was refused.

What the run asked of the skill:

- **It quit the app with AppleScript**, which the run's list refused, and
  which on a person's machine raises a grant prompt of its own. The
  reference now names the plain way: end the process it started.
- **It never said the pointer would be taken.** There was nobody to say it
  to before the take, and the report did not say it after. The reference
  now asks for it in the report when a run has no one to tell first.
- Not the door's: the script carried captions that the cut never landed
  (`vos plan --captions` was not run), and the agent tried `vos frames` on
  an mp4 where `vos check-video` is the verb. A quick demo with no music
  was a fair reading of the ask.
- An artefact of the room, not the skill: the clean directory sat under
  `~/.claude`, where the agent's host refuses to write `actions.json`, so
  the script went to `/tmp`. The next room goes elsewhere.
