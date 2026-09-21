# Sessions: recording a product behind a login

A recorder with no session records the wall: the sign-in page, or wherever
the site sends a stranger (often a public page, with nothing on it that
looks like a sign-in), and the only symptom is a skipped selector. Settle
the session BEFORE you write the script.

Walk the ladder top to bottom and stop at the first rung that holds. It is
ordered by who pays. Rungs 0 to 2 cost the human nothing and survive every
re-record; rung 3 costs one sign-in; rung 4 costs a recording. Jumping to
rung 3 because it is the most general turns a loop that re-makes itself
into a chore someone has to show up for.

## 0. No wall

A public page, a demo mode, a local dev server with auth off, a preview
deployment. If the feature shows the same there, record there.

## 1. Mint, from the test auth the project already has

You are usually standing in the maker's repo, and its e2e suite very often
signs in with no human. Look before you ask anyone anything:

- `playwright/.auth/*.json`, an `auth.setup.ts`, a `storageState` in
  `playwright.config.*`
- `@clerk/testing`; a Supabase service key in `.env.test`
  (`auth.admin.generateLink`); a Firebase custom token
- a seed script, a test-only sign-in route, a session table plus a signing
  secret in the dev env

Run what is there, WITH THE APP ALREADY RUNNING: a project's auth setup
signs in through the real page, so it needs the server up first (usually
`npx playwright test --project=setup`, or whatever the repo's README names).
The artifact is a Playwright storage state, which is exactly what
`--storage-state` takes:

```bash
vos record --actions actions.json --out take --storage-state "$STATE" --dry-run
vos record --actions actions.json --out take --storage-state "$STATE" --strict --json
```

This is the only rung that works in CI, and the only one that survives take
fifty. A Firebase session lives in IndexedDB, which a plain state file
drops: save it with `context.storageState({ path, indexedDB: true })`
(Playwright 1.51 and later).

## 2. Script the form, off camera

A local or self-hosted instance where you can create the account, or a
seeded user whose password is in an env var. Sign in with a few lines of
Playwright, save the state, record with it:

`playwright` is already installed: it arrives with `@vosjs/cli`, so no
second install. Two things about the script below. Launch the SYSTEM Chrome
(`channel: 'chrome'`): `npm i` does not download Playwright's own Chromium.
And run it from INSIDE the project (a dotfile you delete afterwards is
fine), because `import 'playwright'` resolves from the script's own
location; only the STATE FILE has to live outside the repo.

```js
import { chromium } from 'playwright'
const browser = await chromium.launch({ channel: 'chrome' })
const context = await browser.newContext()
const page = await context.newPage()
await page.goto('http://localhost:3000/login')
await page.fill('input[name=email]', 'demo@acme.test')
await page.fill('input[name=password]', process.env.DEMO_PASSWORD) // or, for an account you are creating, a random throwaway you never print
await page.click('button[type=submit]')
await page.waitForURL('**/dashboard')
await context.storageState({ path: process.env.STATE })
await browser.close()
```

Never put the sign-in in `actions.json`. Every step there is IN the
footage, and a typed value is logged.

## 3. The human signs in once

A production app behind an emailed code, SSO, a passkey or a CAPTCHA:

```bash
npx playwright open --channel chrome --save-storage="$STATE" https://app.example.com
```

Tell the human one sentence: a browser window opened, sign in and close it.
The state is written when the window closes, and ONLY then: the command
returns to their prompt at that moment, which is how they know it worked.
Say that, because "I signed in" and "the session is saved" are different
things and a person will reasonably report the first. Before you use the
file, check it exists; if it does not, the window is still open. `--channel chrome` uses the
system Chrome; without it the command wants Playwright's own Chromium,
which is usually not installed.

**The human is not there right now?** Do not open a window nobody will see
and do not block on it. Get everything else ready (the script written and
validated, a rehearsal that exits 4 to prove the wall is the only thing
left), then STOP and leave the ask in the words you would say: the one
command above, "sign in with a demo account and close the window", and a
script that finishes the job from the state file with no further help from
you. Ask, in the same note, whether there is a faster way in you cannot see
(a seeded account, a test sign-in route): that turns the next re-record
into rung 1. Google sign-in usually refuses
an automated browser ("this browser or app may not be secure"). When it
does, go to rung 4; do not fight it.

## 4. The human records, you cut

Hand them a shot list: the beats in order, one line each, about forty
seconds, the viewport you want. They record it with the vosso extension in
their own signed-in Chrome and save it; you `vos pull` it and cut it (the
`vos-cut` skill). This is a rung, not a failure. "I cannot get in; here are
the six beats, record them and I will cut it" is the honest best thing.

## Rules, at every rung

- **Never type, ask for, or accept a production password, code or token.**
  If a human offers one in chat, decline and use rung 3.
- **The state file holds live credentials.** Keep it outside every take
  directory and outside git: a temp dir, or the gitignored path the project
  already uses. `vos push` uploads the recording and `doc.json`, never a
  state file, and nothing about a session ever goes to vos.so.
- **Delete the state file when the video is done**, unless the project
  keeps one on purpose (a gitignored `playwright/.auth`). It is cheap to
  mint again and it is a live credential for as long as it sits there.
- **A session expires.** When a re-record that worked last week skips its
  first selector, re-walk the ladder before touching the script.
- **A person signing in will use their REAL account**, whatever you asked
  for: it is the one they have. The recorder looks for you (`@vosjs/cli`
  0.42 and later): the rehearsal ends with `EXPOSED in the frame`, naming
  the KIND and the place of what it saw (an email address, something shaped
  like a key, a card number or its visible tail; addresses on `example.com`
  or a `.test` domain are demo data and are not reported). Read that list
  BEFORE you record. It also lands in the done event's `exposures`, in
  `vos validate <take>` and in the digest.
- **Hide it before the camera rolls, with `mask` in `actions.json`.** The
  selector in each report reaches that element and no other, so paste it:
  ```json
  "mask": [
    { "selector": "nav > span", "as": "text", "text": "jane@acme.test" },
    { "selector": ".card-number" }
  ]
  ```
  `as: "text"` swaps the words, which reads as a product where a blur reads
  as a redaction; the default blurs. It is applied before the first frame
  and re-applied after every navigation and re-render, so the real value is
  never in the recording. Use `text` for IDENTIFIERS only (an email, a
  name, an account id). NEVER substitute product copy or a number: the
  video stays true to the product, and that judgment is yours, no check
  makes it for you. Rehearse again: the list should be empty, and a mask
  that reached nothing fails the rehearsal by name.
- A recording a HUMAN made (the last rung) has no mask: the scan needs the
  page. Look at the frames yourself and say what they show.
- The list is a floor, not a verdict. It reads text: a face, a logo, a
  customer's name in a table, a private chart are yours to notice. Offer
  the re-record from a demo account; do not decide for them.
- **What the account shows ships in the video.** Use a demo or seeded
  account, never a real customer's. Before you push, look at a frame for
  email addresses, names, keys and card numbers, and re-record from an
  account that does not show them.
