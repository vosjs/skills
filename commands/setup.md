---
description: Ready this machine for vos: the skills, a browser, one rules block, then the doctor's verdict in words
allowed-tools: Bash(npx vos setup:*), Bash(npx vos doctor:*), Bash(npm i -D @vosjs/cli:*)
argument-hint: [--url <dev server>]
---

Ready this repo and machine for the vos loop, then say what is ready.

1. If `@vosjs/cli` is not in this repo's `node_modules`, run `npm i -D @vosjs/cli`.
2. Run `npx vos setup --json $ARGUMENTS`. It installs the vos skills into the agent directories it finds, finds a browser or installs Chromium, writes one block between `<!-- vos:begin -->` and `<!-- vos:end -->` markers into `AGENTS.md` (or `CLAUDE.md` when only that exists), and ends with `vos doctor`.
3. Report the `done` event's doctor facts as a short table in words: node, browser, ffmpeg, the skills per agent, whether a credential is present (never its value), and the dev server when `--url` named one. Then state its `next_step` as the one thing to do next.
4. If the browser line says none, say the fix: install Google Chrome, or `npx playwright install chromium`. If a credential is absent, say that recording and rendering need none, and that `vos login` is for hosting.

Do not print any credential, and do not run `vos login` unasked.
