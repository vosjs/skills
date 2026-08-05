#!/usr/bin/env node
// Repo lint: frontmatter validity, name/dir match, line-count ceilings,
// reference depth, relative-link integrity, marketplace.json shape.
// No dependencies — plain node.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'

const root = resolve(dirname(new URL(import.meta.url).pathname), '..')
const errors = []
const fail = (msg) => errors.push(msg)

const CLAUDE_INTERNAL_KEYS = ['disable-model-invocation', 'allowed-tools', 'argument-hint']
const MAX_SKILL_LINES = 500
const MAX_DESCRIPTION = 1024

function parseFrontmatter(text, file) {
  if (!text.startsWith('---\n')) {
    fail(`${file}: missing frontmatter`)
    return null
  }
  const end = text.indexOf('\n---', 4)
  if (end === -1) {
    fail(`${file}: unterminated frontmatter`)
    return null
  }
  const block = text.slice(4, end)
  const fm = {}
  let current = null
  for (const line of block.split('\n')) {
    const m = line.match(/^([A-Za-z-]+):\s*(.*)$/)
    if (m) {
      current = m[1]
      fm[current] = m[2]
    } else if (current && /^\s+/.test(line)) {
      fm[current] += ' ' + line.trim()
    }
  }
  return fm
}

const skillsDir = join(root, 'skills')
const skillDirs = readdirSync(skillsDir).filter((d) => statSync(join(skillsDir, d)).isDirectory())
if (skillDirs.length === 0) fail('skills/: no skills found')

for (const dir of skillDirs) {
  const skillPath = join(skillsDir, dir, 'SKILL.md')
  if (!existsSync(skillPath)) {
    fail(`skills/${dir}: missing SKILL.md`)
    continue
  }
  const text = readFileSync(skillPath, 'utf8')
  const lines = text.split('\n').length
  if (lines > MAX_SKILL_LINES) fail(`skills/${dir}/SKILL.md: ${lines} lines (max ${MAX_SKILL_LINES})`)

  const fm = parseFrontmatter(text, `skills/${dir}/SKILL.md`)
  if (fm) {
    if (fm.name !== dir) fail(`skills/${dir}: frontmatter name "${fm.name}" != directory name`)
    if (!fm.description || fm.description.length < 40) fail(`skills/${dir}: description missing or too short`)
    if (fm.description && fm.description.length > MAX_DESCRIPTION) fail(`skills/${dir}: description exceeds ${MAX_DESCRIPTION} chars`)
    if (!fm.license) fail(`skills/${dir}: missing license field`)
    for (const key of CLAUDE_INTERNAL_KEYS) {
      if (key in fm) fail(`skills/${dir}: internal frontmatter key "${key}" must not ship`)
    }
  }

  // References: exactly one level deep — files directly in references/, no subdirs.
  const refsDir = join(skillsDir, dir, 'references')
  if (existsSync(refsDir)) {
    for (const entry of readdirSync(refsDir)) {
      if (statSync(join(refsDir, entry)).isDirectory()) {
        fail(`skills/${dir}/references/${entry}: references must be one level deep (no subdirectories)`)
      }
    }
  }

  // Relative links in SKILL.md and references must resolve.
  const mdFiles = [skillPath, ...(existsSync(refsDir) ? readdirSync(refsDir).filter((f) => f.endsWith('.md')).map((f) => join(refsDir, f)) : [])]
  for (const md of mdFiles) {
    const body = readFileSync(md, 'utf8')
    for (const m of body.matchAll(/\]\((?!https?:|#|mailto:)([^)\s]+)\)/g)) {
      const target = join(dirname(md), m[1].split('#')[0])
      if (!existsSync(target)) fail(`${md.replace(root + '/', '')}: broken link → ${m[1]}`)
    }
    // Backtick path references to references/ files must resolve too.
    for (const m of body.matchAll(/`references\/([A-Za-z0-9._-]+)`/g)) {
      if (!existsSync(join(skillsDir, dir, 'references', m[1]))) {
        fail(`${md.replace(root + '/', '')}: referenced file missing → references/${m[1]}`)
      }
    }
  }

  // Every skill needs eval scenarios.
  if (!existsSync(join(root, 'evals', dir, 'scenarios.md'))) {
    fail(`evals/${dir}/scenarios.md: missing (every skill ships with evals)`)
  }
}

// marketplace.json: valid JSON with the required shape.
try {
  const mp = JSON.parse(readFileSync(join(root, '.claude-plugin', 'marketplace.json'), 'utf8'))
  if (!mp.name || !mp.owner?.name || !Array.isArray(mp.plugins) || mp.plugins.length === 0) {
    fail('.claude-plugin/marketplace.json: missing name/owner/plugins')
  }
} catch (e) {
  fail(`.claude-plugin/marketplace.json: ${e.message}`)
}

if (errors.length) {
  console.error(`check failed (${errors.length}):`)
  for (const e of errors) console.error('  ✗ ' + e)
  process.exit(1)
}
console.log(`check passed: ${skillDirs.length} skills (${skillDirs.join(', ')})`)
