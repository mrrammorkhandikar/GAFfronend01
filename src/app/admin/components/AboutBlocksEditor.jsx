'use client'

import { Fragment, useRef, useEffect } from 'react'
import { Plus, X, List, Bold, Italic, Heading, Underline } from 'lucide-react'

const paragraphBlock = () => ({ type: 'paragraph', html: '' })
const bulletsBlock = () => ({ type: 'bullets', items: [''] })
const headingBlock = () => ({ type: 'heading', level: 2, text: '' })

function ParagraphBlockEditor({ html, onChange, taClass, minRows = 3 }) {
  const ref = useRef(null)
  const lastEmitted = useRef(null)

  useEffect(() => {
    if (html === lastEmitted.current) return
    if (ref.current) ref.current.innerHTML = html || ''
  }, [html])

  const sync = () => {
    const v = ref.current?.innerHTML ?? ''
    lastEmitted.current = v
    onChange(v)
  }

  const runCmd = (cmd) => {
    ref.current?.focus()
    try {
      document.execCommand(cmd, false, null)
    } catch {
      /* ignore */
    }
    sync()
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-1.5">
        <button
          type="button"
          title="Bold"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => runCmd('bold')}
          className="inline-flex items-center justify-center p-1.5 rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-800"
        >
          <Bold className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          title="Italic"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => runCmd('italic')}
          className="inline-flex items-center justify-center p-1.5 rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-800"
        >
          <Italic className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          title="Underline"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => runCmd('underline')}
          className="inline-flex items-center justify-center p-1.5 rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-800"
        >
          <Underline className="h-4 w-4" aria-hidden />
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        className={`block w-full ${taClass} whitespace-pre-wrap bg-white text-gray-900 caret-gray-900 [&_b]:text-gray-900 [&_strong]:text-gray-900 [&_i]:text-gray-900 [&_em]:text-gray-900 [&_u]:text-gray-900`}
        style={{ minHeight: `${Math.max(4.5, minRows * 1.35)}rem` }}
        onInput={sync}
        onBlur={sync}
      />
    </div>
  )
}

function InsertBetweenRow({ onAddParagraph, onAddBullets, onAddHeading }) {
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
        onClick={onAddHeading}
        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-amber-800 bg-amber-100 hover:bg-amber-200"
      >
        <Heading className="h-3 w-3 mr-0.5" />
        Heading
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
  const paragraphMinRows = textareaRows
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

  const updateParagraphHtml = (index, html) => {
    setBlocks(
      blocks.map((b, i) => (i === index && b.type === 'paragraph' ? { ...b, html } : b))
    )
  }

  const updateHeading = (index, patch) => {
    setBlocks(
      blocks.map((b, i) => (i === index && b.type === 'heading' ? { ...b, ...patch } : b))
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
    ? 'border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400'
    : 'border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'

  const headingSelectClass = useDarkText
    ? 'border border-gray-300 rounded-md shadow-sm py-2 px-2 text-sm text-gray-900 bg-white shrink-0'
    : 'border border-gray-300 rounded-md shadow-sm py-2 px-2 text-sm bg-white shrink-0'

  const headingInputClass = useDarkText
    ? 'flex-1 min-w-0 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm text-gray-900 placeholder-gray-400'
    : 'flex-1 min-w-0 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm'

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h4 className="text-md font-medium text-gray-900">{heading}</h4>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setBlocks([...blocks, paragraphBlock()])}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Paragraph
          </button>
          <button
            type="button"
            onClick={() => setBlocks([...blocks, headingBlock()])}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700"
          >
            <Heading className="h-4 w-4 mr-1" />
            Heading
          </button>
          <button
            type="button"
            onClick={() => setBlocks([...blocks, bulletsBlock()])}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <List className="h-4 w-4 mr-1" />
            Bullet list
          </button>
        </div>
      </div>

      <InsertBetweenRow
        onAddParagraph={() => insertAt(0, paragraphBlock())}
        onAddHeading={() => insertAt(0, headingBlock())}
        onAddBullets={() => insertAt(0, bulletsBlock())}
      />

      <div className="space-y-1">
        {blocks.map((block, index) => (
          <Fragment key={index}>
            <div className="rounded-lg border border-gray-100 p-3 bg-white">
              {block.type === 'paragraph' && (
                <div className="flex gap-2 items-start">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 mb-1">Paragraph</p>
                    <ParagraphBlockEditor
                      html={block.html ?? ''}
                      onChange={(h) => updateParagraphHtml(index, h)}
                      taClass={taClass}
                      minRows={paragraphMinRows}
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

              {block.type === 'heading' && (
                <div className="flex gap-2 items-start">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 mb-1">Heading</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <label className="sr-only" htmlFor={`about-h-level-${index}`}>
                        Level
                      </label>
                      <select
                        id={`about-h-level-${index}`}
                        value={Math.min(6, Math.max(1, block.level ?? 2))}
                        onChange={(e) =>
                          updateHeading(index, { level: Number.parseInt(e.target.value, 10) })
                        }
                        className={headingSelectClass}
                      >
                        {[1, 2, 3, 4, 5, 6].map((lv) => (
                          <option key={lv} value={lv}>
                            H{lv}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={block.text ?? ''}
                        onChange={(e) => updateHeading(index, { text: e.target.value })}
                        className={headingInputClass}
                        placeholder={`Heading ${index + 1}`}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAt(index)}
                    className="mt-6 p-2 text-red-600 hover:text-red-800 shrink-0"
                    aria-label="Remove heading"
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
                          className={
                            useDarkText
                              ? 'flex-1 border border-gray-300 rounded-md shadow-sm py-1.5 px-2 text-sm text-gray-900 placeholder-gray-400'
                              : 'flex-1 border border-gray-300 rounded-md shadow-sm py-1.5 px-2 text-sm'
                          }
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
              onAddHeading={() => insertAt(index + 1, headingBlock())}
              onAddBullets={() => insertAt(index + 1, bulletsBlock())}
            />
          </Fragment>
        ))}
      </div>
    </div>
  )
}
