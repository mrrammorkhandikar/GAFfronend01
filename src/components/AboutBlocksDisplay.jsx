import { createElement } from 'react'
import {
  normalizeAboutBlock,
  sanitizeAboutInlineHtml,
  stripAboutHtmlToText,
} from '@/lib/aboutBlocks'

const HEADING_CLASS = {
  1: 'text-3xl md:text-4xl font-bold',
  2: 'text-2xl md:text-3xl font-bold',
  3: 'text-xl md:text-2xl font-semibold',
  4: 'text-lg md:text-xl font-semibold',
  5: 'text-base md:text-lg font-semibold',
  6: 'text-sm md:text-base font-semibold',
}

/**
 * Renders `content.about` from API — legacy string[], blocks with paragraph/heading/bullets.
 */
export default function AboutBlocksDisplay({
  about,
  paragraphClassName = 'mb-4',
  headingClassName = 'font-playfair text-[#222222]',
  listClassName = 'list-disc pl-6 mb-4 space-y-1',
  itemClassName = '',
}) {
  const blocks = Array.isArray(about) ? about.map(normalizeAboutBlock) : []

  return (
    <>
      {blocks.map((block, i) => {
        if (block.type === 'heading') {
          const t = String(block.text ?? '').trim()
          if (!t) return null
          const level = Math.min(6, Math.max(1, block.level || 2))
          const tag = `h${level}`
          const sizeClass = HEADING_CLASS[level] || HEADING_CLASS[2]
          return createElement(
            tag,
            {
              key: i,
              className: `${sizeClass} ${headingClassName} mb-3 mt-6 first:mt-0`,
            },
            t
          )
        }
        if (block.type === 'paragraph') {
          const cleaned = sanitizeAboutInlineHtml(block.html ?? '')
          if (!stripAboutHtmlToText(cleaned)) return null
          return (
            <p
              key={i}
              className={paragraphClassName}
              dangerouslySetInnerHTML={{ __html: cleaned }}
            />
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
