// The plugin's two hooks, held on a temp tree with node's own test runner
// (no dependencies, the repo's rule): the SessionStart line for a tracked
// and an untracked demo and its silence elsewhere; the Stop hook's reading
// of a transcript, of selectors and of routes, its line, and its silence.
//
//   node --test evals/plugin
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { readMedia, RE_RECORD } from '../../scripts/media.mjs'
import { sessionStartLine } from '../../scripts/session-start.mjs'
import {
  editedFilesFromTranscript,
  matchEditsToActions,
  routeSegments,
  selectorTokens,
  stopLine,
} from '../../scripts/stop.mjs'

const here = new URL('.', import.meta.url).pathname
const SCRIPTS = join(here, '..', '..', 'scripts')

const ACTIONS = {
  url: 'https://app.example.com/settings',
  viewport: { width: 1280, height: 720 },
  steps: [
    { do: 'wait', ms: 800 },
    { do: 'click', selector: "button:has-text('New project')" },
    { do: 'type', selector: 'input[name=projectName]', text: 'Release v2' },
    { do: 'click', selector: '#save-settings' },
    { do: 'wait', ms: 600, url: 'https://app.example.com/billing' },
  ],
}

function repo({ vos = true, cut = true } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'vos-plugin-'))
  mkdirSync(join(root, 'media'))
  writeFileSync(join(root, 'media', 'actions.json'), JSON.stringify(ACTIONS))
  if (cut) writeFileSync(join(root, 'media', 'doc.json'), '{"source":{}}')
  if (vos)
    writeFileSync(
      join(root, 'media', 'vos.json'),
      JSON.stringify({
        vosId: 'a1b2c3d4-0000-4000-8000-000000000000',
        versionId: 'f9e8d7c6-0000-4000-8000-000000000000',
        pushedAt: '2026-09-20T10:00:00.000Z',
        title: 'Settings walkthrough',
      }),
    )
  return root
}

/** A transcript with the given files written, in the real line shape. */
function transcript(files) {
  return files
    .map((file_path, i) =>
      JSON.stringify({
        type: 'assistant',
        uuid: `u${i}`,
        message: {
          role: 'assistant',
          content: [
            { type: 'text', text: 'editing' },
            {
              type: 'tool_use',
              id: `t${i}`,
              name: i % 2 ? 'Write' : 'Edit',
              input: { file_path, old_string: 'a', new_string: 'b' },
            },
          ],
        },
      }),
    )
    .concat([
      JSON.stringify({
        type: 'assistant',
        message: {
          content: [
            { type: 'tool_use', name: 'Bash', input: { command: 'ls' } },
          ],
        },
      }),
      'not json at all',
    ])
    .join('\n')
}

function run(script, input) {
  const res = spawnSync('node', [join(SCRIPTS, script)], {
    input: JSON.stringify(input),
    encoding: 'utf8',
  })
  return { status: res.status, out: res.stdout, err: res.stderr }
}

describe('SessionStart', () => {
  it('names a tracked demo, its shelf, its version and the re-record pair', () => {
    const line = sessionStartLine(readMedia(repo()))
    assert.match(line, /"Settings walkthrough"/)
    assert.match(line, /https:\/\/vos\.so\/vos\/a1b2c3d4-0000/)
    assert.match(line, /version f9e8d7c6/)
    assert.match(line, /pushed 2026-09-20/)
    assert.match(line, /signed-off cut/)
    for (const cmd of RE_RECORD) assert.ok(line.includes(cmd), cmd)
    assert.doesNotMatch(line, /—/)
  })

  it('says when the demo is a script not yet on the shelf', () => {
    const line = sessionStartLine(readMedia(repo({ vos: false, cut: false })))
    assert.match(line, /not on vos\.so yet/)
    assert.doesNotMatch(line, /doc\.json is/)
  })

  it('is silent in a repo without media/, and the script exits 0 either way', () => {
    assert.equal(sessionStartLine(readMedia(mkdtempSync(join(tmpdir(), 'x-')))), null)
    const quiet = run('session-start.mjs', { cwd: mkdtempSync(join(tmpdir(), 'x-')) })
    assert.equal(quiet.status, 0)
    assert.equal(quiet.out, '')
    const loud = run('session-start.mjs', { cwd: repo() })
    assert.equal(loud.status, 0)
    assert.match(loud.out, /vos demo/)
  })
})

describe('Stop: reading the session', () => {
  it('collects the files Edit and Write wrote, once each, ignoring other tools and bad lines', () => {
    const files = editedFilesFromTranscript(
      transcript(['/r/src/Settings.tsx', '/r/src/Billing.tsx', '/r/src/Settings.tsx']),
    )
    assert.deepEqual(files, ['/r/src/Settings.tsx', '/r/src/Billing.tsx'])
    assert.deepEqual(editedFilesFromTranscript(''), [])
  })

  it('reads the words out of a selector and the segments out of a route', () => {
    assert.deepEqual(selectorTokens("button:has-text('New project')"), ['New project'])
    assert.deepEqual(selectorTokens('input[name=projectName]'), ['projectName'])
    assert.deepEqual(selectorTokens('#save-settings'), ['save-settings'])
    assert.deepEqual(selectorTokens('.btn.primary'), ['btn', 'primary'])
    assert.deepEqual(selectorTokens('button'), [])
    assert.deepEqual(selectorTokens(undefined), [])
    assert.deepEqual(routeSegments({ url: 'https://app.example.com/billing?x=1' }), ['billing'])
    assert.deepEqual(routeSegments({ url: '/a/settings/' }), ['settings'])
    assert.deepEqual(routeSegments({}), [])
  })
})

describe('Stop: the verdict', () => {
  const sources = {
    '/r/src/NewProjectButton.tsx': '<button>New project</button>',
    '/r/src/Billing.tsx': 'export const Billing = () => null',
    '/r/src/Unrelated.tsx': 'nothing here',
    '/r/src/gone.tsx': null,
  }
  const read = (f) => sources[f] ?? null

  it('matches a file by a selector word, or by a route naming its stem, and skips the rest', () => {
    const hits = matchEditsToActions(Object.keys(sources), ACTIONS, read)
    assert.deepEqual(
      hits.map((h) => [h.file, h.selector ?? h.route]),
      [
        ['/r/src/NewProjectButton.tsx', "button:has-text('New project')"],
        ['/r/src/Billing.tsx', 'https://app.example.com/billing'],
      ],
    )
  })

  it('writes one line naming the file and the step, with the re-record pair, or nothing', () => {
    const hits = matchEditsToActions(['/r/src/NewProjectButton.tsx'], ACTIONS, read)
    const line = stopLine(hits, '/r')
    assert.match(line, /changed `src\/NewProjectButton\.tsx`/)
    assert.match(line, /step 2 clicks `button:has-text\('New project'\)`/)
    for (const cmd of RE_RECORD) assert.ok(line.includes(cmd), cmd)
    assert.equal(stopLine([], '/r'), null)
  })

  it('the script speaks on a match, exits 0, and is silent on a nested stop, no media, or no match', () => {
    const root = repo()
    mkdirSync(join(root, 'src'))
    writeFileSync(join(root, 'src', 'Save.tsx'), 'id="save-settings"')
    writeFileSync(join(root, 'src', 'Other.tsx'), 'plain')
    const t = join(root, 'transcript.jsonl')
    writeFileSync(t, transcript([join(root, 'src', 'Save.tsx')]))
    const hit = run('stop.mjs', { cwd: root, transcript_path: t, stop_hook_active: false })
    assert.equal(hit.status, 0)
    assert.match(hit.out, /changed `src\/Save\.tsx`/)
    assert.match(hit.out, /step 4 clicks `#save-settings`/)

    const nested = run('stop.mjs', { cwd: root, transcript_path: t, stop_hook_active: true })
    assert.equal(nested.out, '')

    writeFileSync(t, transcript([join(root, 'src', 'Other.tsx')]))
    const miss = run('stop.mjs', { cwd: root, transcript_path: t })
    assert.equal(miss.status, 0)
    assert.equal(miss.out, '')

    const bare = run('stop.mjs', { cwd: mkdtempSync(join(tmpdir(), 'x-')), transcript_path: t })
    assert.equal(bare.out, '')
    assert.equal(run('stop.mjs', 'not json').status, 0)
  })
})
