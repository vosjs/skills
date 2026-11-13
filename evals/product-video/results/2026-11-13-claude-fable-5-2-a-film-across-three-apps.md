# S8, before it was a scenario: one prompt, a game, three apps

2026-11-13, Claude Fable 5.2, `@vosjs/cli` 0.93.1 over `@vosjs/driver`
0.4.0, skills 0.31.0. Not a cold run: the agent that ran it had written
the desktop reference. It is recorded because it is where S8 and
`references/multi-app.md` came from.

**The ask:** use a chat app to make a web 3D game, open the game in a
browser, play it, and make the product video.

**What it made:** a 51 s film (1920x1080 at 60, a bed, its swell on the
moment play begins) from five takes joined: the ask typed and sent, the
session working, the session done, a terminal starting the dev server,
and a browser where the game is opened and played for 26 s. Every
scripted step held.

**What the skill did not have, and has now:**

- nothing on a film that crosses apps: one take per app, joined, was
  worked out on the spot
- nothing on what answers back. The game could not be played from a
  list of steps; it was played by a program on the driver's own API that
  read the running page over the browser's debugging port and moved the
  real pointer, and the take's steps were then written by hand. That is
  `vos record --play` from 0.94
- no terminal stage. The title bar showed the launching shell's
  environment once `npm` ran, and the resized window left the prompt a
  third of the way down
- no browser stage. A fresh profile suggested searches as the address
  was typed, and the first typing landed inside the address already
  there
- nothing on a server the agent's own session had left running on the
  port the film needed
- a long wait was taken as clips on a clock, and three of four caught
  the same moment. One take that waits inside itself was untried; it is
  measured now (a still window costs about 7 KB a second)
- the planner proposed ten zooms on 26 s of play, each rejected by hand,
  and one late rejection was refused by `vos validate` (fixed in 0.94)
- captions over the chat app sat on its composer and were moved by eye

**Left behind, and said:** one session in the account, the game on
disk; a terminal, a throwaway browser and two dev servers started and
closed; one line of the person's own app in the picture for two seconds,
not masked.
