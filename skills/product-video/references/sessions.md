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

Run what is there. The artifact is a Playwright storage state, which is
exactly what `--storage-state` takes:

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

```js
import { chromium } from 'playwright'
const browser = await chromium.launch()
const context = await browser.newContext()
const page = await context.newPage()
await page.goto('http://localhost:3000/login')
await page.fill('input[name=email]', 'demo@acme.test')
await page.fill('input[name=password]', process.env.DEMO_PASSWORD)
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
npx playwright open --save-storage="$STATE" https://app.example.com
```

Tell the human one sentence: a browser window opened, sign in and close it.
The state is written when the window closes. Google sign-in usually refuses
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
- **A session expires.** When a re-record that worked last week skips its
  first selector, re-walk the ladder before touching the script.
- **What the account shows ships in the video.** Use a demo or seeded
  account, never a real customer's. Before you push, look at a frame for
  email addresses, names, keys and card numbers, and re-record from an
  account that does not show them.
