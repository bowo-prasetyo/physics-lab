#!/usr/bin/env node
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises'
import { resolve, relative, extname, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { parse as parseSfc } from '@vue/compiler-sfc'
import { parse as parseTemplate, NodeTypes } from '@vue/compiler-dom'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUTPUT_DIR = resolve(ROOT, 'artifacts')
const REVIEWABLE_ATTRIBUTES = new Set([
  'alt', 'aria-description', 'aria-label', 'aria-valuetext',
  'label', 'placeholder', 'summary', 'title',
])
const IGNORED_ELEMENTS = new Set(['code', 'pre', 'script', 'style'])
const INTENTIONALLY_SHARED_COPY = new Set(['Physica', 'Physica ·', '· MIT License', 'Gly', 'km/s/Mpc.'])

/** Return true for literal Latin-language copy worth a human localization review. */
export function isReviewableCopy(value) {
  const text = value.replace(/\s+/g, ' ').trim()
  if (text.length < 3 || !/[A-Za-z]{3}/.test(text)) return false
  if (INTENTIONALLY_SHARED_COPY.has(text)) return false
  if (/^https?:\/\//i.test(text)) return false
  if (/^[\d\W_]+$/.test(text)) return false
  return true
}

/** Extract visible template text and static accessibility/content attributes. */
export function extractTemplateCandidates(template, file, lineOffset = 0) {
  const ast = parseTemplate(template, { comments: false })
  const candidates = []

  function add(value, loc, kind, tag = '') {
    const text = value.replace(/\s+/g, ' ').trim()
    if (!isReviewableCopy(text)) return
    candidates.push({
      file,
      line: loc.start.line + lineOffset,
      column: loc.start.column,
      kind,
      tag,
      text,
    })
  }

  function visit(node, ignored = false) {
    if (node.type === NodeTypes.TEXT) {
      if (!ignored) add(node.content, node.loc, 'template-text')
      return
    }
    if (node.type !== NodeTypes.ROOT && node.type !== NodeTypes.ELEMENT) return

    const elementIgnored = ignored || (node.type === NodeTypes.ELEMENT && IGNORED_ELEMENTS.has(node.tag))
    if (node.type === NodeTypes.ELEMENT && !elementIgnored) {
      for (const prop of node.props) {
        if (prop.type === NodeTypes.ATTRIBUTE && REVIEWABLE_ATTRIBUTES.has(prop.name) && prop.value) {
          add(prop.value.content, prop.value.loc, 'static-attribute', node.tag)
        }
      }
    }
    for (const child of node.children ?? []) visit(child, elementIgnored)
  }

  for (const child of ast.children) visit(child)
  return candidates
}

async function collectVueFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) files.push(...await collectVueFiles(path))
    else if (entry.isFile() && extname(entry.name) === '.vue') files.push(path)
  }
  return files.sort()
}

/** Find precision formatting inside Vue components that bypasses locale-aware display helpers. */
export function findUnlocalizedPrecisionOutput(source, file = '<source>') {
  return [...source.matchAll(/\.toPrecision\s*\(/g)].map((match) => ({
    file,
    line: source.slice(0, match.index).split('\n').length,
    expression: match[0],
  }))
}

export async function runAudit({ root = ROOT, outputDir = OUTPUT_DIR } = {}) {
  const files = await collectVueFiles(resolve(root, 'src'))
  const candidates = []
  const numericViolations = []

  for (const absolutePath of files) {
    const source = await readFile(absolutePath, 'utf8')
    const file = relative(root, absolutePath).split('\\').join('/')
    numericViolations.push(...findUnlocalizedPrecisionOutput(source, file))
    const { descriptor, errors } = parseSfc(source, { filename: file })
    if (errors.length) {
      throw new Error(`Could not parse ${file}: ${errors.map(error => error.message).join('; ')}`)
    }
    if (!descriptor.template) continue
    candidates.push(...extractTemplateCandidates(
      descriptor.template.content,
      file,
      descriptor.template.loc.start.line - 1,
    ))
  }

  if (numericViolations.length) {
    const details = numericViolations.map(item => item.file + ':L' + item.line).join(', ')
    throw new Error('Unlocalized numeric precision output found: ' + details + '. Use significant() or fixed() from @/i18n/formatters.')
  }

  const unique = [...new Map(candidates.map(item => [
    [item.file, item.line, item.column, item.kind, item.text].join(':'),
    item,
  ])).values()].sort((a, b) =>
    a.file.localeCompare(b.file) || a.line - b.line || a.column - b.column,
  )

  const report = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    scope: 'Static text and selected static attributes in Vue templates under src/',
    locales: ['en', 'id', 'ja'],
    summary: {
      scannedVueFiles: files.length,
      candidateCount: unique.length,
      filesWithCandidates: new Set(unique.map(item => item.file)).size,
    },
    interpretation: 'Candidates are review leads, not confirmed missing translations. Runtime locale switching, component props, generated SVG/Canvas labels, and strings assembled in TypeScript may require separate review.',
    candidates: unique,
  }

  await mkdir(outputDir, { recursive: true })
  const jsonPath = resolve(outputDir, 'localization-audit.json')
  const markdownPath = resolve(outputDir, 'localization-audit.md')
  await writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')

  const grouped = new Map()
  for (const item of unique) {
    if (!grouped.has(item.file)) grouped.set(item.file, [])
    grouped.get(item.file).push(item)
  }
  const lines = [
    '# Localization source audit',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    '## Summary',
    '',
    `- Vue files scanned: ${report.summary.scannedVueFiles}`,
    `- Static-copy candidates: ${report.summary.candidateCount}`,
    `- Files containing candidates: ${report.summary.filesWithCandidates}`,
    '',
    '> These are review leads, not confirmed translation defects. English fallback copy, technical labels, and intentionally shared text can appear in this list. Check each candidate in the running application for English, Indonesian, and Japanese.',
    '',
    '## Candidates',
    '',
  ]
  if (grouped.size === 0) lines.push('No static-copy candidates were found.')
  for (const [file, items] of grouped) {
    lines.push(`### ${file}`, '')
    for (const item of items) {
      const context = item.tag ? ` (${item.tag} ${item.kind})` : ` (${item.kind})`
      lines.push(`- ` + '`' + `L${item.line}${context}: ${item.text.replace(/\|/g, '\\|')}` + '`')
    }
    lines.push('')
  }
  lines.push('## Limitations', '')
  lines.push('- This scan covers Vue template text and selected static attributes; it does not prove that a string is untranslated.')
  lines.push('- It does not inspect dynamic TypeScript-generated labels, Canvas/WebGL drawing text, remote content, or runtime-only component props.')
  lines.push('- Review all three locales in the running app and have physics terminology checked by fluent reviewers.')
  await writeFile(markdownPath, `${lines.join('\n')}\n`, 'utf8')

  return { report, jsonPath, markdownPath }
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : ''
if (invokedPath === import.meta.url) {
  const { report, jsonPath, markdownPath } = await runAudit()
  process.stdout.write(
    `Localization audit: ${report.summary.candidateCount} candidates across ${report.summary.scannedVueFiles} Vue files.\n` +
    `JSON: ${relative(ROOT, jsonPath)}\nMarkdown: ${relative(ROOT, markdownPath)}\n`,
  )
}
