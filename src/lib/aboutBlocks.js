/**
 * About content is stored as a JSON array of blocks:
 * - Legacy: string paragraphs only
 * - New: { type: 'paragraph', text } or { type: 'bullets', items: string[] }
 */

export function normalizeAboutBlock(entry) {
  if (typeof entry === 'string') {
    return { type: 'paragraph', text: entry }
  }
  if (typeof entry === 'number' && !Number.isNaN(entry)) {
    return { type: 'paragraph', text: String(entry) }
  }
  if (entry && typeof entry === 'object' && entry.type === 'bullets' && Array.isArray(entry.items)) {
    return { type: 'bullets', items: entry.items.map((s) => String(s ?? '')) }
  }
  if (entry && typeof entry === 'object' && entry.type === 'paragraph') {
    return { type: 'paragraph', text: String(entry.text ?? '') }
  }
  return { type: 'paragraph', text: '' }
}

/** For admin editors: always at least one block to edit. */
export function normalizeAboutBlocksForEditor(raw) {
  if (!Array.isArray(raw) || raw.length === 0) {
    return [{ type: 'paragraph', text: '' }]
  }
  return raw.map(normalizeAboutBlock)
}

export function serializeAboutBlocks(blocks) {
  if (!Array.isArray(blocks)) return []
  const out = []
  for (const block of blocks) {
    const b = normalizeAboutBlock(block)
    if (b.type === 'paragraph') {
      const t = String(b.text ?? '').trim()
      if (t) out.push({ type: 'paragraph', text: t })
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
