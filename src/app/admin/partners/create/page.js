'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AdminLayout from '../../components/AdminLayout.js'
import AdminApiService from '../../services/admin-api.js'

const PARTNER_TYPES = ['Organization', 'Individual', 'Corporate', 'NGO', 'Institution']

export default function PartnerFormPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const partnerId = searchParams.get('id')

  const [loading, setLoading] = useState(!!partnerId)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const logoInputRef = useRef(null)
  const [form, setForm] = useState({
    name: '',
    slug: '',
    type: 'Organization',
    shortDescription: '',
    websiteUrl: '',
    country: '',
    city: '',
    isFeatured: false,
    isActive: true,
    about: '',
    programs: '',
    highlights: '',
    quoteText: '',
    quoteAuthor: '',
    quoteRole: ''
  })

  useEffect(() => {
    if (partnerId) {
      loadPartner()
    }
  }, [partnerId])

  const loadPartner = async () => {
    try {
      const result = await AdminApiService.getPartner(partnerId)
      if (result.success && result.data) {
        const p = result.data
        let content = p.content
        if (typeof content === 'string') {
          try {
            content = JSON.parse(content)
          } catch {
            content = {}
          }
        }

        setForm({
          name: p.name || '',
          slug: p.slug || '',
          type: p.type || 'Organization',
          shortDescription: p.shortDescription || '',
          websiteUrl: p.websiteUrl || '',
          country: p.country || '',
          city: p.city || '',
          isFeatured: !!p.isFeatured,
          isActive: !!p.isActive,
          about: (content?.about || []).join('\n'),
          programs: (content?.programs || []).join('\n'),
          highlights: (content?.highlights || []).join('\n'),
          quoteText: content?.quote?.text || '',
          quoteAuthor: content?.quote?.author || '',
          quoteRole: content?.quote?.role || ''
        })
        if (p.logoUrl) setLogoPreview(p.logoUrl)
      }
    } catch (error) {
      console.error('Error loading partner:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      if (logoFile?.preview) URL.revokeObjectURL(logoFile.preview)
      const preview = URL.createObjectURL(file)
      setLogoFile({ file, preview })
    }
  }

  const removeLogoFile = () => {
    if (logoFile?.preview) URL.revokeObjectURL(logoFile.preview)
    setLogoFile(null)
    if (logoInputRef.current) logoInputRef.current.value = ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('slug', form.slug)
      formData.append('type', form.type)
      formData.append('shortDescription', form.shortDescription)
      if (form.websiteUrl) formData.append('websiteUrl', form.websiteUrl)
      if (form.country) formData.append('country', form.country)
      if (form.city) formData.append('city', form.city)
      formData.append('isFeatured', String(form.isFeatured))
      formData.append('isActive', String(form.isActive))

      if (form.about.trim()) formData.append('about', form.about)
      if (form.programs.trim()) formData.append('programs', form.programs)
      if (form.highlights.trim()) formData.append('highlights', form.highlights)
      if (form.quoteText.trim()) {
        formData.append('quoteText', form.quoteText)
        if (form.quoteAuthor.trim()) formData.append('quoteAuthor', form.quoteAuthor)
        if (form.quoteRole.trim()) formData.append('quoteRole', form.quoteRole)
      }

      if (logoFile?.file) {
        formData.append('logo', logoFile.file)
      }

      let result
      if (partnerId) {
        result = await AdminApiService.updatePartner(partnerId, formData)
      } else {
        result = await AdminApiService.createPartner(formData)
      }

      if (result.success) {
        if (partnerId) {
          // Stay on page with success message, update preview if logo was changed
          if (result.data?.logoUrl) setLogoPreview(result.data.logoUrl)
          if (logoFile?.preview) URL.revokeObjectURL(logoFile.preview)
          setLogoFile(null)
          if (logoInputRef.current) logoInputRef.current.value = ''
          setSuccess(true)
          setTimeout(() => setSuccess(false), 3000)
        } else {
          router.push('/admin/partners')
        }
      } else {
        alert(result.message || 'Failed to save partner')
      }
    } catch (error) {
      console.error('Error saving partner:', error)
      alert('An error occurred while saving the partner')
    } finally {
      setSubmitting(false)
    }
  }

  const handleGenerateSlug = () => {
    if (!form.name) return
    const slug = form.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
    handleChange('slug', slug)
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {partnerId ? 'Edit Partner' : 'Add New Partner'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Capture partnership details, story, and programs in one place.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6D190D]" />
          </div>
        ) : (
          <>
          {success && (
            <div className="rounded-md bg-green-50 border border-green-200 p-4">
              <p className="text-sm text-green-700 font-medium">✓ Partner updated successfully!</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8">
            {/* Basic Info */}
            <div>
              <h2 className="text-lg font-semibold text-[#222222] mb-4 font-playfair">
                Partner Basics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Partner Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-[#FFD700] focus:border-[#FFD700]"
                    placeholder="Zen Medical Hospital"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={form.slug}
                      onChange={(e) => handleChange('slug', e.target.value)}
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-[#FFD700] focus:border-[#FFD700]"
                      placeholder="zen-medical-hospital"
                    />
                    <button
                      type="button"
                      onClick={handleGenerateSlug}
                      className="px-3 py-2 text-xs font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Auto
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Partner Type *
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-[#FFD700] focus:border-[#FFD700]"
                  >
                    {PARTNER_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={form.websiteUrl}
                    onChange={(e) => handleChange('websiteUrl', e.target.value)}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-[#FFD700] focus:border-[#FFD700]"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-[#FFD700] focus:border-[#FFD700]"
                    placeholder="India"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-[#FFD700] focus:border-[#FFD700]"
                    placeholder="Mumbai"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description *
                  </label>
                  <textarea
                    required
                    value={form.shortDescription}
                    onChange={(e) => handleChange('shortDescription', e.target.value)}
                    rows={3}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-[#FFD700] focus:border-[#FFD700]"
                    placeholder="One or two lines about how this partner works with Guru Akanksha Foundation."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Partner Logo
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                    {(logoFile?.preview || logoPreview) ? (
                      <div className="relative">
                        <img
                          src={logoFile?.preview || logoPreview}
                          alt="Logo preview"
                          className="w-full h-40 object-contain bg-gray-50 p-3"
                        />
                        {logoFile && (
                          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                            New logo
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex gap-2">
                          <label
                            htmlFor="logo-upload"
                            className="bg-white text-gray-700 text-xs px-2 py-1 rounded shadow cursor-pointer hover:bg-gray-50 font-medium"
                          >
                            {logoFile ? 'Change' : 'Replace'}
                          </label>
                          {logoFile && (
                            <button
                              type="button"
                              onClick={removeLogoFile}
                              className="bg-red-500 text-white text-xs px-2 py-1 rounded shadow hover:bg-red-600 font-medium"
                            >
                              Undo
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="logo-upload"
                        className="flex flex-col items-center justify-center h-32 cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-gray-600 font-medium">Click to upload logo</p>
                        <p className="text-xs text-gray-400 mt-1">PNG or JPG, up to 5MB</p>
                      </label>
                    )}
                    <input
                      ref={logoInputRef}
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                  {logoFile && (
                    <p className="mt-1 text-xs text-gray-500">Selected: <span className="font-medium">{logoFile.file.name}</span></p>
                  )}
                </div>

                <div className="flex items-center gap-6">
                  <label className="inline-flex items-center text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) => handleChange('isFeatured', e.target.checked)}
                      className="rounded border-gray-300 text-[#6D190D] focus:ring-[#FFD700]"
                    />
                    <span className="ml-2">Feature on partners page</span>
                  </label>
                  <label className="inline-flex items-center text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => handleChange('isActive', e.target.checked)}
                      className="rounded border-gray-300 text-[#6D190D] focus:ring-[#FFD700]"
                    />
                    <span className="ml-2">Active partnership</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Storytelling Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-[#222222] mb-2 font-playfair">
                  About This Partnership
                </h2>
                <p className="text-xs text-gray-500 mb-2">
                  Use separate lines for different paragraphs. This will appear as a story on the public partner page.
                </p>
                <textarea
                  value={form.about}
                  onChange={(e) => handleChange('about', e.target.value)}
                  rows={6}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-[#FFD700] focus:border-[#FFD700]"
                  placeholder={
                    'How we met this partner...\nWhat we are building together...\nWhy this partnership matters for communities...'
                  }
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-[#222222] mb-1 font-playfair">
                    Joint Programs / Events
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    One program per line, e.g. “Quarterly multi-specialty mega health camps”.
                  </p>
                  <textarea
                    value={form.programs}
                    onChange={(e) => handleChange('programs', e.target.value)}
                    rows={4}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-[#FFD700] focus:border-[#FFD700]"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#222222] mb-1 font-playfair">
                    Impact Highlights
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    Bullet-style lines that summarize impact together.
                  </p>
                  <textarea
                    value={form.highlights}
                    onChange={(e) => handleChange('highlights', e.target.value)}
                    rows={3}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-[#FFD700] focus:border-[#FFD700]"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#222222] mb-1 font-playfair">
                    Quote (optional)
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    A short quote from the partner about working with Guru Akanksha Foundation.
                  </p>
                  <textarea
                    value={form.quoteText}
                    onChange={(e) => handleChange('quoteText', e.target.value)}
                    rows={3}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-[#FFD700] focus:border-[#FFD700]"
                    placeholder='"Partnering with Guru Akanksha Foundation helped us..."'
                  />
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={form.quoteAuthor}
                      onChange={(e) => handleChange('quoteAuthor', e.target.value)}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-[#FFD700] focus:border-[#FFD700]"
                      placeholder="Quote author name"
                    />
                    <input
                      type="text"
                      value={form.quoteRole}
                      onChange={(e) => handleChange('quoteRole', e.target.value)}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-[#FFD700] focus:border-[#FFD700]"
                      placeholder="Author role or title"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => router.push('/admin/partners')}
                className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-md bg-[#6D190D] text-white text-sm font-semibold hover:bg-[#8B2317] disabled:opacity-60"
              >
                {submitting ? 'Saving...' : partnerId ? 'Save Changes' : 'Create Partner'}
              </button>
            </div>
          </form>
          </>
        )}
      </div>
    </AdminLayout>
  )
}

