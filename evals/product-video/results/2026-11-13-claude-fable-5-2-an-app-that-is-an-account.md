# S7, before it was a scenario: Claude Design in the Claude app

2026-11-13, Claude Fable 5.2, `@vosjs/cli` 0.92.1 over `@vosjs/driver`
0.3.0, skills 0.30.1. Not a cold run: the agent that ran it had written
the desktop reference. It is recorded because it is where S7 came from.

**The ask:** record the person's signed-in Claude app and make a product
video of its Design feature for a post.

**What it made:** a 34 s film (1920x1080 at 60, a bed) from two scripted
takes joined: the ask (the Design tile, the prompt typed and sent, the
session working) and the result (the finished page, its accent changed in
the Tweaks panel, the page opened full and scrolled). Every step of both
takes held, `--strict` exit 0. One generation was spent, by a guarded
step the command confirmed.

**What the skill did not have, and has now:**

- no section for an app with no throwaway instance. The agent said what
  would show only in its report; a desktop take had no `mask`
- no `teardown` on a desktop script: each of about twenty walks needed a
  hand-written undo script (clear the prompt, put the accent back,
  collapse the pane)
- nothing on a result that arrives later. Two takes and `vos join` was
  worked out on the spot
- `vos digest` listed the first take's moments alone, so the second half
  was cut from step times and by eye
- a selector with `^=` passed `vos validate` and stopped a walk at its
  fifth step
- `vos music pick` put the payoff on the last zoomed step, not the reveal
- the end card's title landed on the page's own headline, and was moved
  later by hand
