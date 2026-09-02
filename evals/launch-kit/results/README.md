# Results

One file per run: `YYYY-MM-DD-<model>.md` with scenario pass/fail and notes.
A release tag requires a green run on two model tiers. The procedure is
[`../RUN.md`](../RUN.md): fixtures, the skill installed for the agent under
test, the blind A/B against a no-skill copy, the non-interactive commands.
Each file ends with the deterministic count: the problems `vos validate`
reported across the run's kits, printed by `node evals/count.mjs <dirs>`
in the form `N problems across M assets on K kits` (0 is the bar).
