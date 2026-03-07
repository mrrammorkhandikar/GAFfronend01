'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '../../components/AdminLayout.js'
import AdminApiService from '../../services/admin-api.js'

export default function PartnerDetailPage({ params }) {
  const router = useRouter()
  const [partner, setPartner] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPartner = async () => {
      try {
        const resolved = await params
        const id = resolved?.id
        if (!id) {
          throw new Error('Partner ID is missing from parameters')
        }
        const result = await AdminApiService.getPartner(id)
        if (!result.success) {
          setError(result.message || 'Failed to load partner')
          return
        }
        const p = result.data
        let content = p.content
        if (typeof content === 'string') {
          try {
            content = JSON.parse(content)
          } catch {
            content = {}
          }
        }
        setPartner({
          ...p,
          content: content || {},
        })
      } catch (e) {
        console.error('Error loading partner:', e)
        setError(e.message || 'An error occurred while loading the partner')
      } finally {
        setLoading(false)
      }
    }

    loadPartner()
  }, [params])

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6D190D]" />
        </div>
      </AdminLayout>
    )
  }

  if (error || !partner) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 font-poppins">
              {error || 'Partner not found'}
            </p>
            <button
              type="button"
              onClick={() => router.push('/admin/partners')}
              className="mt-4 inline-flex items-center px-4 py-2 rounded-md bg-[#6D190D] text-white text-sm font-medium hover:bg-[#8B2317]"
            >
              Back to Partners
            </button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const { content = {} } = partner
  const about = Array.isArray(content.about) ? content.about : []
  const programs = Array.isArray(content.programs) ? content.programs : []
  const highlights = Array.isArray(content.highlights) ? content.highlights : []
  const quote = content.quote

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{partner.name}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Preview of how this partner will appear on the public site.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push(`/admin/partners/create?id=${partner.id}`)}
            className="px-4 py-2 rounded-md bg-[#6D190D] text-white text-sm font-semibold hover:bg-[#8B2317]"
          >
            Edit Partner
          </button>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6">
          {partner.logoUrl && (
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#fcf9e3] text-[#6D190D] border border-[#f3e1a5]">
                {partner.type}
              </span>
              {partner.isFeatured && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                  Featured Partner
                </span>
              )}
              {!partner.isActive && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                  Inactive
                </span>
              )}
            </div>
            <p className="text-sm text-gray-700">{partner.shortDescription}</p>
            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
              {partner.city || partner.country ? (
                <span>
                  <span className="font-semibold text-gray-700">Location: </span>
                  {[partner.city, partner.country].filter(Boolean).join(', ')}
                </span>
              ) : null}
              {partner.websiteUrl && (
                <span>
                  <span className="font-semibold text-gray-700">Website: </span>
                  {partner.websiteUrl}
                </span>
              )}
              <span>
                <span className="font-semibold text-gray-700">Slug: </span>
                {partner.slug}
              </span>
            </div>
          </div>
        </div>

        {/* Story Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-[#222222] mb-3 font-playfair">
                About This Partnership
              </h2>
              <div className="space-y-3 text-sm text-gray-700 font-poppins">
                {about.length > 0
                  ? about.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))
                  : partner.shortDescription && <p>{partner.shortDescription}</p>}
              </div>
            </section>

            {programs.length > 0 && (
              <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-[#222222] mb-3 font-playfair">
                  Joint Programs & Events
                </h2>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 font-poppins">
                  {programs.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <div className="space-y-6">
            {highlights.length > 0 && (
              <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-sm font-semibold text-[#222222] mb-2 font-playfair">
                  Impact Highlights
                </h2>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 font-poppins">
                  {highlights.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </section>
            )}

            {quote?.text && (
              <section className="bg-[#fcf9e3] rounded-xl border border-[#f3e1a5] p-5">
                <p className="text-sm italic text-gray-800 font-poppins">
                  “{quote.text}”
                </p>
                {(quote.author || quote.role) && (
                  <p className="mt-3 text-xs text-gray-600 font-poppins">
                    {quote.author && <span className="font-semibold">{quote.author}</span>}
                    {quote.author && quote.role && <span> • </span>}
                    {quote.role}
                  </p>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

