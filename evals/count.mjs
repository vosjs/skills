#!/usr/bin/env node
// The deterministic count. One number per eval run: the problems
// `vos validate <kit.json> --json` reports across every kit the run
// produced, read from the assets' BYTES against the channel specs, so a
// judged pass cannot hide a WebP under a `.png` name or a card over its
// byte ceiling. This is the line a results file ends on and the changelog
// carries per release.
//
//   node evals/count.mjs <kit.json | dir>...
//
// A directory is walked for kit.json files (node_modules and dotfiles
// skipped). Needs `vos` on PATH with @vosso/vos-plugin >= 0.20.0, or
// VOS=<path to a vos binary>. Exits 1 when the count is not zero, so a CI
// step or a judge cannot pass a run by not looking. No dependencies.
import { execFileSync } from 'node:child_process'
import { readdirSync, statSync } from 'node:fs'
import { basename, join, relative, resolve } from 'node:path'

const args = process.argv.slice(2)
if (args.length === 0 || args.includes('--help')) {
  console.error('usage: node evals/count.mjs <kit.json | dir>...')
  process.exit(2)
}

function findKits(path) {
  const st = statSync(path)
  if (st.isFile()) return basename(path) === 'kit.json' ? [path] : []
  const found = []
  for (const entry of readdirSync(path).sort()) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue
    found.push(...findKits(join(path, entry)))
  }
  return found
}

const vos = process.env.VOS ?? 'vos'

function validate(kit) {
  // `vos validate` exits 1 on problems but still prints its done line.
  let stdout = ''
  let stderr = ''
  try {
    stdout = execFileSync(vos, ['validate', kit, '--json'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
  } catch (e) {
    stdout = e.stdout ?? ''
    stderr = e.stderr ?? e.message
  }
  const done = stdout
    .split('\n')
    .map((line) => {
      try {
        return JSON.parse(line)
      } catch {
        return null
      }
    })
    .find((o) => o && o.event === 'done')
  if (!done) {
    throw new Error(
      `${vos} validate ${kit} gave no verdict${stderr ? `: ${stderr.trim()}` : ''}`,
    )
  }
  return done
}

const kits = args.flatMap((a) => findKits(resolve(a)))
if (kits.length === 0) {
  console.error('no kit.json found under: ' + args.join(' '))
  process.exit(2)
}

let problems = 0
let assets = 0
for (const kit of kits) {
  const verdict = validate(kit)
  const n = verdict.problems.length
  const m = verdict.measured.length
  problems += n
  assets += m
  const label = relative(process.cwd(), kit) || kit
  console.log(`${label}: ${n} problem${n === 1 ? '' : 's'} across ${m} asset${m === 1 ? '' : 's'}`)
  for (const p of verdict.problems) console.log(`  - ${p}`)
}
console.log(
  `${problems} problem${problems === 1 ? '' : 's'} across ${assets} asset${assets === 1 ? '' : 's'} on ${kits.length} kit${kits.length === 1 ? '' : 's'}`,
)
process.exit(problems === 0 ? 0 : 1)
