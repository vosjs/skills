#!/usr/bin/env node
// The SessionStart hook (matcher startup|resume): when the repo the
// session opens in carries `media/`, one line goes to stdout, which the
// host adds to the agent's context. It says what the demo is, where it
// lives on vos.so, and the one command pair that re-records it, so an
// agent that changes the UI this session already knows the demo exists
// and how to bring it up to date. Silence otherwise: a hook that speaks in
// every repo is noise, and noise gets uninstalled.
//
// Plain node, no dependencies. Exit 0 always: context is offered, never
// forced, and a hook that errors would print a notice in every session.
import { dayOf, readMedia, RE_RECORD, shortId, SITE } from './media.mjs'

/** The line, or null when the repo carries no demo. Pure over `media`. */
export function sessionStartLine(media) {
  if (!media) return null
  const { sync, hasCut } = media
  const re = `Re-record it after a UI change: ${RE_RECORD.join(', then ')}.`
  if (sync) {
    const title = sync.title ? `"${sync.title}"` : 'a demo'
    const version = sync.versionId
      ? ` at version ${shortId(sync.versionId)}`
      : ''
    const when = dayOf(sync.pushedAt)
    return `This repo's media/ carries ${title}, a vos demo of this product, on the shelf at ${SITE}/vos/${sync.vosId}${version}${when ? ` (pushed ${when})` : ''}; ${hasCut ? 'media/doc.json is the signed-off cut' : 'there is no committed cut yet'}. ${re}`
  }
  return `This repo's media/ carries a vos demo script (media/actions.json${hasCut ? ' and the cut media/doc.json' : ''}) that is not on vos.so yet. ${re}`
}

async function main() {
  let input = ''
  for await (const chunk of process.stdin) input += chunk
  let cwd = process.cwd()
  try {
    const parsed = JSON.parse(input || '{}')
    if (typeof parsed.cwd === 'string' && parsed.cwd) cwd = parsed.cwd
  } catch {
    // no JSON on stdin: read the working directory
  }
  const line = sessionStartLine(readMedia(cwd))
  if (line) process.stdout.write(`${line}\n`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(() => {}).finally(() => process.exit(0))
}
