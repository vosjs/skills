# S8, run on the release: one prompt, a second game, three apps

2026-11-13, Claude Fable 5.2, `@vosjs/cli` 0.94.1 over `@vosjs/driver`
0.4.0, skills 0.32.0 (installed from npm, not a checkout). Not a cold
run: the agent that ran it had written the reference. It is recorded
because it is the first run of what 0.94 added, on a real product.

**The ask:** another round, with a new game.

**What it made:** a 65 s film (1920x1080 at 60, a bed with its swell on
the moment the ride starts) from THREE takes joined: one take of the
chat app from the prompt to the finished session (18 min 26 s, one
`expect` that waited 1,083 s), a terminal starting the dev server, and a
browser where the game is opened and ridden for 24 s by a play.

**What 0.94 did, on a real film:**

- the long task was one take, all nine steps held, 129 MB
- `vos record --play` played the game on its first ride (24.0 s alive),
  and wrote the take's steps with their marks
- the planner proposed nothing over the ride (the round before: ten
  proposals, each rejected by hand), and a re-plan proposed nothing back
- `vos music pick` found the payoff by itself, on the third take, from
  the play step's mark
- the join put the chat app's captions at the top and said so

**What the skill did not have, and has now:**

- the screen locked during the long take (a take that waits is idle to
  the system), and the next take could not start until the person
  unlocked it: keep the display awake
- the appearance went from light to dark between the first take and the
  rest: read it before every take
- the terminal reopened the previous round's window, with the person's
  own shell and a title naming them, and `--pid` picked it: name the
  window, and close the stage window from inside before quitting
- the chat app was restarted before the end of the stage, so the window
  the take had resized could not be put back by the script: undo right
  after the take
- the reference's own long-wait example carried a `zoom` mark that
  `vos validate` refuses on an `expect`
- "about 7 KB a second" is a still window; a working app was about 120
- the digest had one moment for the whole wait: a contact sheet was the
  eyes
- the player was proven in a headless browser before it had the pointer

**Still wrong in the tools:** the typed-line lint reads a terminal at
its press, not its caret, and does not see typing done inside a play;
the helper does not keep the display awake or say that the screen is
locked; the digest does not look inside a wait.
