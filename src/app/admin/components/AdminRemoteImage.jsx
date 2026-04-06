'use client'

import { useState, useEffect } from 'react'
import { ImageOff } from 'lucide-react'

/**
 * Admin previews for Supabase and other remote URLs: uses no-referrer, lazy load,
 * and a visible fallback on error (does not hide the slot like display:none).
 */
export default function AdminRemoteImage({
  src,
  alt = '',
  className = '',
  fallbackClassName = '',
  hint = null,
}) {
  const [broken, setBroken] = useState(false)

  useEffect(() => {
    setBroken(false)
  }, [src])

  if (!src) return null

  const isRemote = typeof src === 'string' && /^https?:\/\//i.test(src)

  if (broken) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-amber-50 border border-dashed border-amber-200 text-amber-900 text-xs p-3 text-center rounded-lg ${fallbackClassName}`}
      >
        <ImageOff className="h-6 w-6 shrink-0 text-amber-600 opacity-80" aria-hidden />
        <span className="font-semibold font-poppins">Can&apos;t load image preview</span>
        <span className="max-w-full break-all opacity-80 font-mono text-[11px] leading-snug line-clamp-3">
          {String(src).slice(0, 180)}
          {String(src).length > 180 ? '…' : ''}
        </span>
        {hint ? <div className="text-[11px] text-amber-900/90 font-poppins">{hint}</div> : null}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      referrerPolicy={isRemote ? 'no-referrer' : undefined}
      loading="lazy"
      decoding="async"
      onError={() => setBroken(true)}
    />
  )
}
