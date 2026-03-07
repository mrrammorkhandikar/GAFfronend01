'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Upload, Plus, X, Image, Target, FileText } from 'lucide-react'
import AdminLayout from '@/app/admin/components/AdminLayout'
import AdminApiService from '@/app/admin/services/admin-api'

export default function EditCampaignPage() {
  const [campaign, setCampaign] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    location: '',
    amount: '',
    raisedAmount: '',
    startDate: '',
    endDate: '',
    isActive: true
  })
  const [content, setContent] = useState({
    about: [''],
    impactGallery: Array(4).fill(''),
    keyFocusAreas: Array(8).fill('')
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()
  const id = params.id

  useEffect(() => {
    if (id) {
      fetchCampaign()
    }
  }, [id])

  const fetchCampaign = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await AdminApiService.getCampaign(id)
      
      if (response.success) {
        const campaignData = response.data
        setCampaign(campaignData)
        if (campaignData.imageUrl) setImagePreview(campaignData.imageUrl)
        
        // Populate form data
        setFormData({
          title: campaignData.title,
          slug: campaignData.slug,
          description: campaignData.description,
          location: campaignData.location,
          amount: campaignData.amount || '',
          raisedAmount: campaignData.raisedAmount || '',
          startDate: campaignData.startDate ? new Date(campaignData.startDate).toISOString().split('T')[0] : '',
          endDate: campaignData.endDate ? new Date(campaignData.endDate).toISOString().split('T')[0] : '',
          isActive: campaignData.isActive
        })
        
        // Populate content — existing gallery URLs stored as plain strings
        const campaignContent = campaignData.content || {}
        const existingGallery = campaignContent.impactGallery || []
        const gallerySlots = Array(4).fill('').map((_, i) => existingGallery[i] || '')
        setContent({
          about: campaignContent.about?.length ? campaignContent.about : [''],
          impactGallery: gallerySlots,
          keyFocusAreas: campaignContent.keyFocusAreas?.length
            ? [...campaignContent.keyFocusAreas, ...Array(Math.max(0, 8 - campaignContent.keyFocusAreas.length)).fill('')]
            : Array(8).fill(''),
          impactNumbers: campaignContent.impactNumbers?.length ? campaignContent.impactNumbers : [{ label: '', value: '' }],
          testimonials: campaignContent.testimonials?.length ? campaignContent.testimonials : [{ quote: '', author: '', role: '' }]
        })
      } else {
        setError(response.message || 'Failed to fetch campaign')
      }
    } catch (err) {
      setError('An error occurred while fetching campaign')
      console.error('Error fetching campaign:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  const handleContentChange = (section, index, value) => {
    setContent(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => i === index ? value : item)
    }))
  }

  const addContentItem = (section) => {
    if (section === 'about') {
      setContent(prev => ({
        ...prev,
        [section]: [...prev[section], '']
      }))
    }
  }

  const removeContentItem = (section, index) => {
    if (section === 'about' && content[section].length > 1) {
      setContent(prev => ({
        ...prev,
        [section]: prev[section].filter((_, i) => i !== index)
      }))
    }
  }

  const handleImageUpload = (index, file) => {
    const newGallery = [...content.impactGallery]
    newGallery[index] = { file, preview: URL.createObjectURL(file) }
    setContent(prev => ({
      ...prev,
      impactGallery: newGallery
    }))
  }

  const removeImage = (index) => {
    const newGallery = [...content.impactGallery]
    if (newGallery[index]?.preview) URL.revokeObjectURL(newGallery[index].preview)
    newGallery[index] = ''
    setContent(prev => ({
      ...prev,
      impactGallery: newGallery
    }))
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Campaign title is required')
      return false
    }
    if (!formData.slug.trim()) {
      setError('URL slug is required')
      return false
    }
    if (!formData.description.trim()) {
      setError('Description is required')
      return false
    }
    if (!formData.location.trim()) {
      setError('Location is required')
      return false
    }
    if (!formData.startDate) {
      setError('Start date is required')
      return false
    }
    
    // Validate content sections
    const aboutContent = content.about.filter(item => item.trim() !== '')
    if (aboutContent.length === 0) {
      setError('At least one about paragraph is required')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setSaving(true)
    setError('')

    try {
      const formDataObj = new FormData()
      
      // Add basic fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== '' && value !== null) {
          formDataObj.append(key, value)
        }
      })

      // Add content as JSON — only include string URLs for gallery, not File objects
      const contentData = {
        about: content.about.filter(item => item.trim() !== ''),
        impactGallery: content.impactGallery
          .map(item => (typeof item === 'string' && item !== '') ? item : (item?.url || null))
          .filter(Boolean),
        keyFocusAreas: content.keyFocusAreas.filter(item => item.trim() !== ''),
        impactNumbers: content.impactNumbers.filter(n => n.label.trim() !== '' && n.value.trim() !== ''),
        testimonials: content.testimonials.filter(t => t.quote.trim() !== '')
      }
      formDataObj.append('content', JSON.stringify(contentData))

      // Append new gallery image files as separate FormData fields
      content.impactGallery.forEach((item, index) => {
        if (item?.file instanceof File) {
          formDataObj.append(`galleryImage_${index}`, item.file)
        }
      })

      // Add main featured image if selected
      if (image) {
        formDataObj.append('image', image)
      }

      const result = await AdminApiService.updateCampaign(id, formDataObj)
      
      if (result.success) {
        router.push('/admin/campaigns')
      } else {
        setError(result.message || 'Failed to update campaign')
      }
    } catch (err) {
      setError('An error occurred while updating the campaign')
      console.error('Error updating campaign:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  if (error && !campaign) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-700">{error}</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 inline-flex items-center text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Campaign</h1>
              <p className="mt-1 text-sm text-gray-500">
                Update campaign details and content
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Basic Information Column */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    Basic Information
                  </h3>
                </div>
                
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Campaign Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                    placeholder="Enter campaign title"
                  />
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    id="slug"
                    required
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                    placeholder="campaign-title-slug"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description *
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                    placeholder="Brief description of the campaign"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                    placeholder="City, Country"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                      Target Amount (₹)
                    </label>
                    <input
                      type="number"
                      name="amount"
                      id="amount"
                      min="0"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label htmlFor="raisedAmount" className="block text-sm font-medium text-gray-700 mb-1">
                      Raised Amount (₹)
                    </label>
                    <input
                      type="number"
                      name="raisedAmount"
                      id="raisedAmount"
                      min="0"
                      value={formData.raisedAmount}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      id="startDate"
                      required
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      id="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Active Campaign
                  </label>
                </div>
              </div>

              {/* Content Sections Column */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900">Content Sections</h3>
                </div>

                {/* About Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">About This Campaign</h4>
                    <button
                      type="button"
                      onClick={() => addContentItem('about')}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Paragraph
                    </button>
                  </div>
                  <div className="space-y-3">
                    {content.about.map((paragraph, index) => (
                      <div key={index} className="flex">
                        <textarea
                          value={paragraph}
                          onChange={(e) => handleContentChange('about', index, e.target.value)}
                          rows={3}
                          className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                          placeholder={`Paragraph ${index + 1} content`}
                        />
                        {content.about.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeContentItem('about', index)}
                            className="ml-2 px-3 py-2 text-red-600 hover:text-red-800 self-start mt-2"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Impact Gallery Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                    <Image className="h-5 w-5 mr-2 text-purple-600" />
                    Impact Gallery (Max 4 Images)
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {content.impactGallery.map((imageItem, index) => (
                      <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden text-center relative" style={{minHeight:'100px'}}>
                        {imageItem ? (
                          <div className="relative w-full h-full">
                            {imageItem.preview ? (
                              <img src={imageItem.preview} alt={`Gallery ${index+1}`} className="w-full h-24 object-cover" />
                            ) : typeof imageItem === 'string' ? (
                              <img src={imageItem} alt={`Gallery ${index+1}`} className="w-full h-24 object-cover" onError={e=>{e.target.style.display='none'}} />
                            ) : (
                              <div className="h-24 flex items-center justify-center bg-gray-100">
                                <span className="text-xs text-gray-500 px-2 truncate">{imageItem?.file?.name || 'Image'}</span>
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="p-4">
                            <Upload className="mx-auto h-8 w-8 text-gray-400" />
                            <label className="mt-2 block text-sm font-medium text-gray-900 cursor-pointer">
                              <span>Upload Image</span>
                              <input
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(index, e.target.files[0])}
                              />
                            </label>
                            <p className="text-xs text-gray-500 mt-1">Click to upload</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Focus Areas Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-orange-600" />
                    Key Focus Areas (Max 8 Points)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {content.keyFocusAreas.map((focusArea, index) => (
                      <div key={index} className="flex">
                        <input
                          type="text"
                          value={focusArea}
                          onChange={(e) => handleContentChange('keyFocusAreas', index, e.target.value)}
                          className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                          placeholder={`Focus area ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Impact Numbers Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900 flex items-center">
                      <Target className="h-5 w-5 mr-2 text-blue-600" />
                      Impact Statistics
                    </h4>
                    <button
                      type="button"
                      onClick={() => setContent(prev => ({ ...prev, impactNumbers: [...prev.impactNumbers, { label: '', value: '' }] }))}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Stat
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {content.impactNumbers.map((stat, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => {
                            const updated = [...content.impactNumbers]
                            updated[index] = { ...updated[index], value: e.target.value }
                            setContent(prev => ({ ...prev, impactNumbers: updated }))
                          }}
                          className="w-24 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
                          placeholder="e.g. 500+"
                        />
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const updated = [...content.impactNumbers]
                            updated[index] = { ...updated[index], label: e.target.value }
                            setContent(prev => ({ ...prev, impactNumbers: updated }))
                          }}
                          className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
                          placeholder="Label (e.g. Children Educated)"
                        />
                        {content.impactNumbers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setContent(prev => ({ ...prev, impactNumbers: prev.impactNumbers.filter((_, i) => i !== index) }))}
                            className="text-red-600 hover:text-red-800 mt-2"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Testimonials Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">Testimonials / Quotes</h4>
                    <button
                      type="button"
                      onClick={() => setContent(prev => ({ ...prev, testimonials: [...prev.testimonials, { quote: '', author: '', role: '' }] }))}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Testimonial
                    </button>
                  </div>
                  <div className="space-y-4">
                    {content.testimonials.map((testimonial, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="text-sm font-medium text-gray-700">Testimonial {index + 1}</h5>
                          {content.testimonials.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setContent(prev => ({ ...prev, testimonials: prev.testimonials.filter((_, i) => i !== index) }))}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <textarea
                          value={testimonial.quote}
                          onChange={(e) => {
                            const updated = [...content.testimonials]
                            updated[index] = { ...updated[index], quote: e.target.value }
                            setContent(prev => ({ ...prev, testimonials: updated }))
                          }}
                          rows={2}
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
                          placeholder="Quote / testimonial text"
                        />
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          <input
                            type="text"
                            value={testimonial.author}
                            onChange={(e) => {
                              const updated = [...content.testimonials]
                              updated[index] = { ...updated[index], author: e.target.value }
                              setContent(prev => ({ ...prev, testimonials: updated }))
                            }}
                            className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
                            placeholder="Author name"
                          />
                          <input
                            type="text"
                            value={testimonial.role}
                            onChange={(e) => {
                              const updated = [...content.testimonials]
                              updated[index] = { ...updated[index], role: e.target.value }
                              setContent(prev => ({ ...prev, testimonials: updated }))
                            }}
                            className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
                            placeholder="Role / Description"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Featured Image */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Featured Image</h4>
                  {imagePreview && !image && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Current image:</p>
                      <img src={imagePreview} alt="Current featured" className="w-full h-40 object-cover rounded-lg" />
                    </div>
                  )}
                  {image && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">New image preview:</p>
                      <img src={URL.createObjectURL(image)} alt="New featured" className="w-full h-40 object-cover rounded-lg" />
                    </div>
                  )}
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-3 pb-3">
                      <Upload className="w-6 h-6 mb-2 text-gray-500" />
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">{imagePreview ? 'Replace image' : 'Click to upload'}</span>
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating Campaign...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Campaign
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}