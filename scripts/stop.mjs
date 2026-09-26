#!/usr/bin/env node
// The Stop hook: when a session in a repo that carries `media/` edited a
// file the demo's click script touches, one line goes to stdout, which the
// host adds to the agent's context. It names the file, says media/ carries
// a demo of it, and gives the re-record command. It NEVER blocks (never
// exit 2): the cue is offered at the end of the turn, and the agent or the
// person decides. Silence when nothing matched, when the repo has no
// media/, or when this Stop was itself caused by a hook (stop_hook_active),
// so a cue can never loop.
//
// What "touches" means, deterministically: a step's selector carries
// tokens (an id, a class, a name, a data-testid, a :has-text phrase), and a
// file the session wrote contains one of them; or a step navigates to a
// path whose segment names the file's stem (/settings and Settings.tsx).
// Edited files come from the session transcript (the tool_use blocks named
// Edit, Write, MultiEdit or NotebookEdit), never from git, because a
// session's work is not always committed when it stops.
//
// Plain node, no dependencies. Exit 0 always.
import { existsSync, readFileSync } from 'node:fs'
import { basename, isAbsolute, join, relative } from 'node:path'
import { readMedia, RE_RECORD } from './media.mjs'

const EDIT_TOOLS = new Set(['Edit', 'Write', 'MultiEdit', 'NotebookEdit'])
const MIN_TOKEN = 3

/** The files a transcript says the session wrote, in order, deduped. */
export function editedFilesFromTranscript(text) {
  const out = []
  const seen = new Set()
  for (const line of text.split('\n')) {
    if (!line.includes('"tool_use"')) continue
    let entry
    try {
      entry = JSON.parse(line)
    } catch {
      continue
    }
    const content = entry?.message?.content
    if (!Array.isArray(content)) continue
    for (const block of content) {
      if (block?.type !== 'tool_use' || !EDIT_TOOLS.has(block.name)) continue
      const path = block.input?.file_path ?? block.input?.notebook_path
      if (typeof path !== 'string' || seen.has(path)) continue
      seen.add(path)
      out.push(path)
    }
  }
  return out
}

/**
 * The words a selector is made of, the ones a source file would carry:
 * ids, classes, attribute values, has-text phrases. Bare tags and
 * combinators are not evidence.
 */
export function selectorTokens(selector) {
  if (typeof selector !== 'string') return []
  const tokens = new Set()
  for (const m of selector.matchAll(/[#.]([A-Za-z_][\w-]*)/g)) tokens.add(m[1])
  for (const m of selector.matchAll(/\[[^\]=]+=\s*["']?([^"'\]]+)["']?\]/g))
    tokens.add(m[1].trim())
  for (const m of selector.matchAll(/:has-text\(\s*["']([^"']+)["']\s*\)/g))
    tokens.add(m[1].trim())
  for (const m of selector.matchAll(/text=["']?([^"'\]]+)/g))
    tokens.add(m[1].trim())
  return [...tokens].filter((t) => t.length >= MIN_TOKEN)
}

/** The path segments a step navigates to, for the stem match. */
export function routeSegments(step) {
  const url = typeof step?.url === 'string' ? step.url : null
  if (!url) return []
  let path = url
  try {
    path = new URL(url, 'http://x').pathname
  } catch {
    // a bare path
  }
  return path
    .split('/')
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length >= MIN_TOKEN)
}

function stem(file) {
  return basename(file)
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
}

/**
 * Which edited files the demo touches, and through which step. Pure over
 * the actions and a `read` of each file (null when unreadable: a deleted
 * file matches nothing).
 */
export function matchEditsToActions(files, actions, read) {
  const steps = Array.isArray(actions?.steps) ? actions.steps : []
  const top = routeSegments(actions)
  const hits = []
  for (const file of files) {
    const text = read(file)
    const fileStem = stem(file)
    let why = null
    for (const [i, step] of steps.entries()) {
      const tokens = selectorTokens(step?.selector)
      const token = text ? tokens.find((t) => text.includes(t)) : undefined
      if (token) {
        why = { step: i + 1, selector: step.selector, token }
        break
      }
      if (routeSegments(step).includes(fileStem)) {
        why = { step: i + 1, route: step.url }
        break
      }
    }
    if (!why && top.includes(fileStem)) why = { route: actions.url }
    if (why) hits.push({ file, ...why })
  }
  return hits
}

/** The line, or null. Paths print relative to the repo. */
export function stopLine(hits, cwd) {
  if (!hits.length) return null
  const names = hits.map((h) => {
    const rel =
      isAbsolute(h.file) && cwd ? relative(cwd, h.file) : h.file
    return rel.startsWith('..') ? h.file : rel
  })
  const first = hits[0]
  const via = first.selector
    ? `step ${first.step} clicks \`${first.selector}\``
    : `a step opens ${first.route}`
  const list =
    names.length === 1
      ? `\`${names[0]}\``
      : `${names
          .slice(0, 3)
          .map((n) => `\`${n}\``)
          .join(', ')}${names.length > 3 ? ` and ${names.length - 3} more` : ''}`
  return `This session changed ${list}; media/ carries a demo that touches it (${via}). Re-record it: ${RE_RECORD.join(', then ')}.`
}

async function main() {
  let input = ''
  for await (const chunk of process.stdin) input += chunk
  let parsed = {}
  try {
    parsed = JSON.parse(input || '{}')
  } catch {
    return
  }
  if (parsed.stop_hook_active) return
  const cwd = typeof parsed.cwd === 'string' && parsed.cwd ? parsed.cwd : process.cwd()
  const media = readMedia(cwd)
  if (!media) return
  const transcript =
    typeof parsed.transcript_path === 'string' && existsSync(parsed.transcript_path)
      ? readFileSync(parsed.transcript_path, 'utf8')
      : ''
  const files = editedFilesFromTranscript(transcript).filter(
    (f) => !f.split(/[\\/]/).includes('media'),
  )
  if (!files.length) return
  const read = (f) => {
    const p = isAbsolute(f) ? f : join(cwd, f)
    try {
      return readFileSync(p, 'utf8')
    } catch {
      return null
    }
  }
  const line = stopLine(matchEditsToActions(files, media.actions, read), cwd)
  if (line) process.stdout.write(`${line}\n`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(() => {}).finally(() => process.exit(0))
}
