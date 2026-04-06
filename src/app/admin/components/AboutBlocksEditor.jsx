'use client'

import { Fragment } from 'react'
import { Plus, X, List } from 'lucide-react'

const paragraphBlock = () => ({ type: 'paragraph', text: '' })
const bulletsBlock = () => ({ type: 'bullets', items: [''] })

function InsertBetweenRow({ onAddParagraph, onAddBullets }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 py-2 border-y border-dashed border-gray-200 bg-gray-50/80 rounded-md my-1">
      <span className="text-xs text-gray-500 mr-1">Insert below:</span>
      <button
        type="button"
        onClick={onAddParagraph}
        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-green-800 bg-green-100 hover:bg-green-200"
      >
        <Plus className="h-3 w-3 mr-0.5" />
        Paragraph
      </button>
      <button
        type="button"
        onClick={onAddBullets}
        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-indigo-800 bg-indigo-100 hover:bg-indigo-200"
      >
        <List className="h-3 w-3 mr-0.5" />
        Bullet list
      </button>
    </div>
  )
}

export default function AboutBlocksEditor({
  value,
  onChange,
  heading = 'About',
  textareaRows = 3,
  useDarkText = false,
}) {
  const blocks = Array.isArray(value) && value.length > 0 ? value : [paragraphBlock()]

  const setBlocks = (next) => onChange(next)

  const insertAt = (index, block) => {
    const next = [...blocks]
    next.splice(index, 0, block)
    setBlocks(next)
  }

  const removeAt = (index) => {
    if (blocks.length <= 1) {
      setBlocks([paragraphBlock()])
      return
    }
    setBlocks(blocks.filter((_, j) => j !== index))
  }

  const updateParagraph = (index, text) => {
    setBlocks(
      blocks.map((b, i) => (i === index && b.type === 'paragraph' ? { ...b, text } : b))
    )
  }

  const updateBullet = (blockIndex, itemIndex, text) => {
    setBlocks(
      blocks.map((b, i) => {
        if (i !== blockIndex || b.type !== 'bullets') return b
        const items = [...b.items]
        items[itemIndex] = text
        return { ...b, items }
      })
    )
  }

  const addBullet = (blockIndex) => {
    setBlocks(
      blocks.map((b, i) =>
        i === blockIndex && b.type === 'bullets' ? { ...b, items: [...b.items, ''] } : b
      )
    )
  }

  const removeBullet = (blockIndex, itemIndex) => {
    setBlocks(
      blocks.map((b, i) => {
        if (i !== blockIndex || b.type !== 'bullets') return b
        if (b.items.length <= 1) return { ...b, items: [''] }
        return { ...b, items: b.items.filter((_, j) => j !== itemIndex) }
      })
    )
  }

  const taClass = useDarkText
    ? 'flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400'
    : 'flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500'

  const inputClass = useDarkText
    ? 'flex-1 border border-gray-300 rounded-md shadow-sm py-1.5 px-2 text-sm text-gray-900 placeholder-gray-400'
    : 'flex-1 border border-gray-300 rounded-md shadow-sm py-1.5 px-2 text-sm'

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-md font-medium text-gray-900">{heading}</h4>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setBlocks([...blocks, paragraphBlock()])}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add paragraph
          </button>
          <button
            type="button"
            onClick={() => setBlocks([...blocks, bulletsBlock()])}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <List className="h-4 w-4 mr-1" />
            Add bullet list
          </button>
        </div>
      </div>

      <InsertBetweenRow
        onAddParagraph={() => insertAt(0, paragraphBlock())}
        onAddBullets={() => insertAt(0, bulletsBlock())}
      />

      <div className="space-y-1">
        {blocks.map((block, index) => (
          <Fragment key={index}>
            <div className="rounded-lg border border-gray-100 p-3 bg-white">
              {block.type === 'paragraph' && (
                <div className="flex gap-2 items-start">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 mb-1">Paragraph</p>
                    <textarea
                      value={block.text ?? ''}
                      onChange={(e) => updateParagraph(index, e.target.value)}
                      rows={textareaRows}
                      className={`block w-full ${taClass}`}
                      placeholder={`Paragraph ${index + 1}`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAt(index)}
                    className="mt-6 p-2 text-red-600 hover:text-red-800 shrink-0"
                    aria-label="Remove block"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}

              {block.type === 'bullets' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-gray-500">Bullet list</p>
                    <button
                      type="button"
                      onClick={() => removeAt(index)}
                      className="p-1 text-red-600 hover:text-red-800"
                      aria-label="Remove bullet list"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {block.items.map((item, bi) => (
                      <div key={bi} className="flex gap-2 items-center">
                        <span className="text-gray-400 select-none w-4 shrink-0">•</span>
                        <input
                          type="text"
                          value={item ?? ''}
                          onChange={(e) => updateBullet(index, bi, e.target.value)}
                          className={inputClass}
                          placeholder={`Bullet ${bi + 1}`}
                        />
                        {block.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeBullet(index, bi)}
                            className="p-1 text-red-500 hover:text-red-700 shrink-0"
                            aria-label="Remove bullet"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addBullet(index)}
                      className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium mt-1"
                    >
                      <Plus className="h-4 w-4 mr-0.5" />
                      Add bullet
                    </button>
                  </div>
                </div>
              )}
            </div>

            <InsertBetweenRow
              onAddParagraph={() => insertAt(index + 1, paragraphBlock())}
              onAddBullets={() => insertAt(index + 1, bulletsBlock())}
            />
          </Fragment>
        ))}
      </div>
    </div>
  )
}
