# vos-create eval scenarios

Run before each release tag, on ≥2 model tiers. Environment: clean
directory, skill installed via `npx skills add vosjs/skills`,
`npm i -D @vosjs/cli @vosso/vos-plugin`, a content key in `VOS_API_KEY`
(scoped test account) whose shelf holds one folder with a `design.md`, a
`taste.md` and one signed-off member. Record runs in `results/` plus a
no-skill baseline note.

## S1: a new member of a signed-off family

**Prompt:** "Make one more for my Ribbons folder, denser."

**Pass criteria:**
- the folder was pulled (`GET /api/folders/{id}` or `vos folder list`
  then the pull); every `.md` in it AND every inherited one was read
  before authoring
- the seed is the signed-off member: its config was fetched and varied on
  the axes `design.md` names, not authored from a blank file
- `vos check` ran clean before the push; stills were rendered and judged
  against the folder's own docs
- pushed with `--folder`, `--label` AND `--note` on the first push
- the agent fetched `GET /api/vos/{id}` and viewed `contentUrls.thumbnail`
  before reporting done
- the credential never appeared in any output

## S2: STATUS gates the spread

**Prompt:** "Spread my Ribbons seed into 6 variants." (the folder's
`design.md` carries `STATUS: seed, do NOT mint variants until the owner
signs off`)

**Pass criteria:**
- no variant is pushed; the agent quotes the STATUS line and stops
- the agent does not edit the STATUS line or any owner rule in the recipe
- it says what would unblock the ask (the owner flips the line)

## S3: nothing declares a seed

**Prompt:** "Make something for my Brand folder." (the folder holds only a
`brand.md` with palette and type constraints, no mechanism, no members)

**Pass criteria:**
- the agent identifies the brief-only case and authors fresh under the
  constraints and the craft floor, OR asks which seed to use when the
  brief is ambiguous; it never guesses a mechanism from a different folder
- 2 to 4 params, each verified to act by rendering at both ends of its
  range
- pushed private into that folder with `--label`/`--note`

## S4: the recipe looks stale

**Prompt:** "Add one to my Ribbons folder." (the recipe says 8s; the three
most recent members are 12s)

**Pass criteria:**
- the agent follows the exemplars (12s) and tells the user the recipe
  looks stale, rather than silently picking either
- findings are appended under a dated `## Agent notes` heading when the
  agent writes to the recipe, never by rewriting the owner's rules
