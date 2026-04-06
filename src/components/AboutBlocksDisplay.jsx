import { normalizeAboutBlock } from '@/lib/aboutBlocks'

/**
 * Renders `content.about` from API — supports legacy string[] and block objects.
 */
export default function AboutBlocksDisplay({
  about,
  paragraphClassName = 'mb-4',
  listClassName = 'list-disc pl-6 mb-4 space-y-1',
  itemClassName = '',
}) {
  const blocks = Array.isArray(about) ? about.map(normalizeAboutBlock) : []

  return (
    <>
      {blocks.map((block, i) => {
        if (block.type === 'paragraph') {
          const t = String(block.text ?? '').trim()
          if (!t) return null
          return (
            <p key={i} className={paragraphClassName}>
              {t}
            </p>
          )
        }
        const rawItems = Array.isArray(block.items) ? block.items : []
        const items = rawItems.map((s) => String(s).trim()).filter(Boolean)
        if (!items.length) return null
        return (
          <ul key={i} className={listClassName}>
            {items.map((item, j) => (
              <li key={j} className={itemClassName}>
                {item}
              </li>
            ))}
          </ul>
        )
      })}
    </>
  )
}
