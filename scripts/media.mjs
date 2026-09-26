// What a repo's `media/` says about its demo, read by both hooks. Plain
// node, no dependencies, every function pure over injected reads so the
// evals run on a temp tree. `media/` is the convention the launch-kit and
// product-video skills write: `actions.json` (the click script), `doc.json`
// (the signed-off cut), `vos.json` (the vos it tracks on vos.so).
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

export const MEDIA_DIR = 'media'
export const SITE = 'https://vos.so'

/** The two commands that re-record the demo onto changed UI, in order. */
export const RE_RECORD = [
  'npx vos record --actions media/actions.json --out /tmp/take --strict',
  'npx vos plan /tmp/take --reuse --from media/doc.json',
]

export function readJson(path, opts = {}) {
  const exists = opts.exists ?? existsSync
  const read = opts.read ?? ((p) => readFileSync(p, 'utf8'))
  if (!exists(path)) return null
  try {
    return JSON.parse(read(path))
  } catch {
    return null
  }
}

/**
 * The repo's demo, as facts: whether media/ carries a script, a cut and a
 * tracked vos. Null when there is no media/actions.json at all, which is
 * the common case and the one both hooks must answer with silence.
 */
export function readMedia(cwd, opts = {}) {
  const exists = opts.exists ?? existsSync
  const dir = join(cwd, MEDIA_DIR)
  const actions = readJson(join(dir, 'actions.json'), opts)
  if (!actions) return null
  const sync = readJson(join(dir, 'vos.json'), opts)
  return {
    actions,
    hasCut: exists(join(dir, 'doc.json')),
    sync: sync && typeof sync.vosId === 'string' ? sync : null,
  }
}

/** A short id for a sentence: the first eight characters. */
export function shortId(id) {
  return typeof id === 'string' ? id.slice(0, 8) : ''
}

/** `2026-09-26` from an ISO stamp, or an empty string. */
export function dayOf(iso) {
  return typeof iso === 'string' && iso.length >= 10 ? iso.slice(0, 10) : ''
}
