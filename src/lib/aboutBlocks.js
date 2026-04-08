/**
 * About content is stored as a JSON array of blocks:
 * - Legacy: string paragraphs only
 * - { type: 'paragraph', text } plain, or { type: 'paragraph', html } with inline <strong>/<em>/<u>/<br>
 * - { type: 'heading', level: 1-6, text }
 * - { type: 'bullets', items: string[] }
 */

const TAG_MAP = { b: 'strong', strong: 'strong', i: 'em', em: 'em', u: 'u' }

export function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function plainTextToHtml(text) {
  const t = String(text ?? '')
  if (!t) return ''
  return escapeHtml(t).replace(/\r\n|\r|\n/g, '<br />')
}

/** Visible text for empty checks (after sanitize). */
export function stripAboutHtmlToText(html) {
  return String(html ?? '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim()
}

/**
 * Keeps only safe inline tags for public/admin display: strong, em, u, br.
 */
export function sanitizeAboutInlineHtml(raw) {
  const input = String(raw ?? '')
  let out = ''
  let i = 0
  while (i < input.length) {
    if (input[i] !== '<') {
      let j = i
      while (j < input.length && input[j] !== '<') j++
      out += escapeHtml(input.slice(i, j))
      i = j
      continue
    }
    const gt = input.indexOf('>', i)
    if (gt === -1) {
      out += escapeHtml(input.slice(i))
      break
    }
    const inner = input.slice(i + 1, gt).trim()
    i = gt + 1
    if (/^br\s*\/?$/i.test(inner)) {
      out += '<br />'
      continue
    }
    const close = inner.match(/^\/\s*([a-z0-9]+)/i)
    if (close) {
      const n = close[1].toLowerCase()
      const canon = TAG_MAP[n]
      if (canon) out += `</${canon}>`
      continue
    }
    const open = inner.match(/^([a-z0-9]+)/i)
    if (open) {
      const n = open[1].toLowerCase()
      const canon = TAG_MAP[n]
      if (canon) out += `<${canon}>`
    }
  }
  return out
}

function normalizeHeading(entry) {
  const level = Math.min(6, Math.max(1, Number.parseInt(entry.level, 10) || 2))
  return { type: 'heading', level, text: String(entry.text ?? '') }
}

export function normalizeAboutBlock(entry) {
  if (typeof entry === 'string') {
    return { type: 'paragraph', html: plainTextToHtml(entry) }
  }
  if (typeof entry === 'number' && !Number.isNaN(entry)) {
    return { type: 'paragraph', html: plainTextToHtml(String(entry)) }
  }
  if (entry && typeof entry === 'object' && entry.type === 'bullets' && Array.isArray(entry.items)) {
    return { type: 'bullets', items: entry.items.map((s) => String(s ?? '')) }
  }
  if (entry && typeof entry === 'object' && entry.type === 'heading') {
    return normalizeHeading(entry)
  }
  if (entry && typeof entry === 'object' && entry.type === 'paragraph') {
    const html = entry.html != null ? String(entry.html) : ''
    const text = entry.text != null ? String(entry.text) : ''
    if (html) return { type: 'paragraph', html }
    return { type: 'paragraph', html: plainTextToHtml(text) }
  }
  return { type: 'paragraph', html: '' }
}

/** For admin editors: always at least one block to edit. */
export function normalizeAboutBlocksForEditor(raw) {
  if (!Array.isArray(raw) || raw.length === 0) {
    return [{ type: 'paragraph', html: '' }]
  }
  return raw.map(normalizeAboutBlock)
}

function paragraphHasContent(block) {
  const cleaned = sanitizeAboutInlineHtml(block.html ?? '')
  return stripAboutHtmlToText(cleaned).length > 0
}

export function serializeAboutBlocks(blocks) {
  if (!Array.isArray(blocks)) return []
  const out = []
  for (const block of blocks) {
    const b = normalizeAboutBlock(block)
    if (b.type === 'heading') {
      const t = String(b.text ?? '').trim()
      if (t) out.push({ type: 'heading', level: b.level, text: t })
    } else if (b.type === 'paragraph') {
      const cleaned = sanitizeAboutInlineHtml(b.html ?? '')
      if (!stripAboutHtmlToText(cleaned)) continue
      if (/<\s*(strong|em|u)\b/i.test(cleaned) || /<br\s*\/?>/i.test(cleaned)) {
        out.push({ type: 'paragraph', html: cleaned })
      } else {
        out.push({ type: 'paragraph', text: stripAboutHtmlToText(cleaned) })
      }
    } else if (b.type === 'bullets') {
      const items = b.items.map((s) => String(s).trim()).filter(Boolean)
      if (items.length) out.push({ type: 'bullets', items })
    }
  }
  return out
}

export function aboutBlocksHaveContent(blocks) {
  return serializeAboutBlocks(blocks).length > 0
}
