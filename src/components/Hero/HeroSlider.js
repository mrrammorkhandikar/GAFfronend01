'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import SiteApiService from '@/app/services/site-api'

const HeroSlider = () => {
  const [slides, setSlides] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    SiteApiService.getHeroSlides()
      .then((res) => {
        if (cancelled) return
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setSlides(res.data.map((s) => ({ src: s.imageUrl, alt: s.title || 'Slide' })))
        } else {
          setSlides([])
        }
      })
      .catch(() => {
        if (!cancelled) setSlides([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const items = slides && slides.length > 0 ? slides : []

  const duplicatedItems = [...items, ...items]

  if (loading && items.length === 0) {
    return (
      <div className="bg-[#fcf9e3] py-12 overflow-hidden">
        <div className="flex items-center justify-center min-h-[180px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600" />
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="bg-[#fcf9e3] py-12 overflow-hidden">
      <div className="relative flex items-center">
        <motion.div
          className="flex space-x-12"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            duration: 25,
            ease: 'linear',
          }}
        >
          {duplicatedItems.map((item, i) => (
            <div
              key={`${item.src}-${i}`}
              className="flex items-center justify-center bg-[#FFFBEF] border border-gray-200 rounded-xl shadow-sm w-80 h-40 flex-shrink-0"
            >
              <Image
                src={item.src}
                alt={item.alt || `slide-${i}`}
                width={224}
                height={112}
                className="object-contain opacity-80"
                unoptimized={item.src?.startsWith('http')}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default HeroSlider
