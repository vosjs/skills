# launch-kit — running a tier

A tier is one model family run through the frozen scenarios in
`scenarios.md`, judged against their pass criteria, and COUNTED. A release
tag needs a green run on two tiers (Claude, Codex). The scenarios never
change between runs, so every run's number is comparable with the last
one; what changes is the skill, the CLI and the model.

## 1. The fixtures

- A finished take with a tuned `doc.json`, recorded at 2560×1440 (the
  skill's own viewport rule), in a directory the agent can write to.
  `vos pull <vosId> --media <dir>` brings a hosted take home with its
  footage. The 2026-09-02 run used the two adopter takes (Harper v2.9 and
  Karakeep v0.33) from the runner's shelf; name your takes in the results
  file, because a different fixture is a different number.
- A vos.so project the pushes land in, holding a `BRAND.md`, or none:
  S0 requires the agent to witness the brand from the product's site
  (`vos brand <url>`), and whether it did is a finding either way.
- In the run directory: `npm i -D @vosjs/cli`
  (plugin ≥ 0.20.0, the version `vos validate <kit.json>` arrived in),
  ffmpeg on PATH, system Chrome, a content key in `VOS_API_KEY`. Record
  the two package versions in the results file.

## 2. The skill, installed for the agent under test

Project scope, inside the run directory, so the copy under test is the one
the agent reads and the other copy (§3) reads nothing:

```
npx skills add vosjs/skills -a claude-code -y
npx skills add vosjs/skills -a codex -y
```

## 3. Blind A/B

The loop this copies (Vercel's `design.md` evals) compared runs with and
without the file, judged blind, and published both counts. Ours compares
with and without the skill:

- two copies of the fixture directory, `a/` and `b/`;
- a coin decides which copy gets the skill installed; write the answer to
  a `key.txt` OUTSIDE both copies and do not open it until the judging is
  done;
- run every scenario prompt, verbatim from `scenarios.md`, in both copies,
  same model, same day, same package versions;
- judge each copy's kit against the pass criteria without knowing which
  side made it; then open `key.txt`.

The no-skill side is the baseline the scenario file asks for, and its
count is what the skill's count is measured against. A run without the
baseline is still a run; say so in the results file.

## 4. Running a prompt

Non-interactive, so a run is cheap to repeat and nothing is typed between
the prompt and the kit. Use a disposable directory: the agent runs
unattended.

Claude Code:

```
claude -p "<prompt>" --dangerously-skip-permissions
```

Codex (`codex login` once; the sandbox must be allowed to write the run
directory and reach the network, because the run pushes to vos.so):

```
codex exec -C <dir> --skip-git-repo-check \
  -s workspace-write -c sandbox_workspace_write.network_access=true \
  "<prompt>"
```

An interactive run counts too. Say which mode the results file describes.

## 5. The count

```
node evals/count.mjs a b
```

One line per kit, then the total, in the form the results file ends on:

```
a/media/kit/kit.json: 0 problems across 11 assets
b/media/kit/kit.json: 3 problems across 11 assets
  - og card: named .png, the bytes are webp
  ...
3 problems across 22 assets on 2 kits
```

The script runs `vos validate <kit.json> --json` on every kit it finds
(the verifier reads each asset's bytes against the channel specs: px,
bytes, duration, set count, and what the file really is) and exits 1 when
the total is not zero, so a CI step or a judge cannot pass a run by not
looking. A judged PASS with a non-zero count is a FAIL.

## 6. The results file

`results/YYYY-MM-DD-<model>.md`, one per run:

- a header: run type (A/B or single), fixtures, package versions, the
  agent and its mode, and the A/B key once opened;
- one line per scenario, `PASS`, `FAIL` or `not run`, with the finding;
- findings that should become scenarios (S6 and S7 were findings first);
- the LAST line: the count from `count.mjs`, verbatim, one per side when
  the A/B ran.

## 7. Publishing

The release's changelog entry on vos.so carries the count of the run made
on it, and the results file is the receipt. Corrections to the skill from
a run land only after a human has read the kits; the number says whether
they helped.
