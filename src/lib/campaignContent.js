/**
 * Campaign JSON.content fields may be legacy strings or mistakenly store block-shaped objects.
 */

export function keyFocusAreaToPlainString(item) {
  if (item == null) return ''
  if (typeof item === 'string') return item
  if (typeof item === 'object') {
    if (item.type === 'bullets' && Array.isArray(item.items)) {
      return item.items
        .map((x) => String(x ?? '').trim())
        .filter(Boolean)
        .join(', ')
    }
    if (typeof item.text === 'string') return item.text
    if (item.text != null) return String(item.text)
  }
  return String(item)
}

export function normalizeKeyFocusAreasForForm(raw, slotCount = 8) {
  const base = Array.isArray(raw) && raw.length ? raw.map(keyFocusAreaToPlainString) : []
  return [...base, ...Array(Math.max(0, slotCount - base.length)).fill('')]
}

export function normalizeImpactNumbersForForm(raw) {
  if (!Array.isArray(raw) || !raw.length) return [{ label: '', value: '' }]
  return raw.map((n) =>
    n && typeof n === 'object'
      ? { label: String(n.label ?? ''), value: String(n.value ?? '') }
      : { label: '', value: '' }
  )
}

export function normalizeTestimonialsForForm(raw) {
  if (!Array.isArray(raw) || !raw.length) {
    return [{ quote: '', author: '', role: '' }]
  }
  return raw.map((t) =>
    t && typeof t === 'object'
      ? {
          quote: String(t.quote ?? ''),
          author: String(t.author ?? ''),
          role: String(t.role ?? ''),
        }
      : { quote: '', author: '', role: '' }
  )
}

export function filterNonEmptyKeyFocusAreas(items) {
  return (Array.isArray(items) ? items : []).filter(
    (item) => keyFocusAreaToPlainString(item).trim() !== ''
  )
}

export function filterNonEmptyImpactNumbers(items) {
  return (Array.isArray(items) ? items : []).filter((n) => {
    if (!n || typeof n !== 'object') return false
    return String(n.label ?? '').trim() !== '' && String(n.value ?? '').trim() !== ''
  })
}

export function filterNonEmptyTestimonials(items) {
  return (Array.isArray(items) ? items : []).filter((t) => {
    if (!t || typeof t !== 'object') return false
    return String(t.quote ?? '').trim() !== ''
  })
}
