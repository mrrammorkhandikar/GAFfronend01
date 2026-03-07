'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Upload, Calendar, MapPin, FileText, Plus, X } from 'lucide-react'
import AdminLayout from '@/app/admin/components/AdminLayout'
import AdminApiService from '@/app/admin/services/admin-api'

export default function CreateEventPage() {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    eventDate: '',
    location: '',
    campaignId: '',
    isActive: true
  })
  const [content, setContent] = useState({
    about: [''],
    journey: [{ title: '', description: '', imageUrl: '' }],
    keyAchievements: Array(8).fill(''),
    speakers: [{ name: '', role: '' }],
    agenda: [{ time: '', title: '', description: '' }]
  })
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [campaigns, setCampaigns] = useState([])
  const router = useRouter()

  // Fetch campaigns for dropdown
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await AdminApiService.getCampaigns({ limit: 100 })
        if (response.success) {
          setCampaigns(response.data)
        }
      } catch (err) {
        console.error('Error fetching campaigns:', err)
      }
    }
    fetchCampaigns()
  }, [])

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

  const handleContentChange = (section, index, field, value) => {
    setContent(prev => {
      const updated = { ...prev }
      if (section === 'journey') {
        updated[section][index][field] = value
      } else {
        updated[section][index] = value
      }
      return updated
    })
  }

  const addJourneyItem = () => {
    setContent(prev => ({
      ...prev,
      journey: [...prev.journey, { title: '', description: '', imageUrl: '' }]
    }))
  }

  const removeJourneyItem = (index) => {
    if (content.journey.length > 1) {
      setContent(prev => ({
        ...prev,
        journey: prev.journey.filter((_, i) => i !== index)
      }))
    }
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Event title is required')
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
    if (!formData.eventDate) {
      setError('Event date is required')
      return false
    }
    if (!formData.location.trim()) {
      setError('Location is required')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    setError('')

    try {
      const formDataObj = new FormData()
      
      // Add basic fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== '' && value !== null) {
          formDataObj.append(key, value)
        }
      })

      // Add content as JSON
      const contentData = {
        about: content.about.filter(item => item.trim() !== ''),
        journey: content.journey.filter(item => 
          item.title.trim() !== '' || item.description.trim() !== ''
        ).map(item => ({
          title: item.title,
          description: item.description,
          imageUrl: item.imageUrl || undefined
        })),
        keyAchievements: content.keyAchievements.filter(item => item.trim() !== ''),
        speakers: content.speakers.filter(s => s.name.trim() !== '').map(s => ({
          name: s.name,
          role: s.role
        })),
        agenda: content.agenda.filter(a => a.title.trim() !== '').map(a => ({
          time: a.time,
          title: a.title,
          description: a.description
        }))
      }
      formDataObj.append('content', JSON.stringify(contentData))

      // Add image if selected
      if (image) {
        formDataObj.append('image', image)
      }

      const result = await AdminApiService.createEvent(formDataObj)
      
      if (result.success) {
        router.push('/admin/events')
      } else {
        setError(result.message || 'Failed to create event')
      }
    } catch (err) {
      setError('An error occurred while creating the event')
      console.error('Error creating event:', err)
    } finally {
      setLoading(false)
    }
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
              <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
              <p className="mt-1 text-sm text-gray-500">
                Create a comprehensive event with detailed content
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
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter event title"
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
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="event-title-slug"
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
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of the event"
                  />
                </div>

                <div>
                  <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="datetime-local"
                    name="eventDate"
                    id="eventDate"
                    required
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Event location"
                  />
                </div>

                <div>
                  <label htmlFor="campaignId" className="block text-sm font-medium text-gray-700 mb-1">
                    Associated Campaign
                  </label>
                  <select
                    name="campaignId"
                    id="campaignId"
                    value={formData.campaignId}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">None</option>
                    {campaigns.map(campaign => (
                      <option key={campaign.id} value={campaign.id}>
                        {campaign.title}
                      </option>
                    ))}
                  </select>
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
                    Active Event
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
                    <h4 className="text-md font-medium text-gray-900">About This Event</h4>
                    <button
                      type="button"
                      onClick={() => setContent(prev => ({ ...prev, about: [...prev.about, ''] }))}
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
                          onChange={(e) => handleContentChange('about', index, null, e.target.value)}
                          rows={3}
                          className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder={`Paragraph ${index + 1} content`}
                        />
                        {content.about.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setContent(prev => ({ ...prev, about: prev.about.filter((_, i) => i !== index) }))}
                            className="ml-2 px-2 text-red-600 hover:text-red-800 self-start mt-2"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Journey Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">Event Journey</h4>
                    <button
                      type="button"
                      onClick={addJourneyItem}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Journey Point
                    </button>
                  </div>
                  <div className="space-y-4">
                    {content.journey.map((journeyItem, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-700">Journey Point {index + 1}</h5>
                          {content.journey.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeJourneyItem(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={journeyItem.title}
                            onChange={(e) => handleContentChange('journey', index, 'title', e.target.value)}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Journey title"
                          />
                          <textarea
                            value={journeyItem.description}
                            onChange={(e) => handleContentChange('journey', index, 'description', e.target.value)}
                            rows={2}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Journey description"
                          />
                          <input
                            type="text"
                            value={journeyItem.imageUrl}
                            onChange={(e) => handleContentChange('journey', index, 'imageUrl', e.target.value)}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Image URL (optional)"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Achievements Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Key Achievements / Highlights (Max 8)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {content.keyAchievements.map((achievement, index) => (
                      <div key={index} className="flex">
                        <input
                          type="text"
                          value={achievement}
                          onChange={(e) => handleContentChange('keyAchievements', index, null, e.target.value)}
                          className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder={`Achievement / highlight ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Speakers Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">Speakers / Organizers</h4>
                    <button
                      type="button"
                      onClick={() => setContent(prev => ({ ...prev, speakers: [...prev.speakers, { name: '', role: '' }] }))}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Speaker
                    </button>
                  </div>
                  <div className="space-y-3">
                    {content.speakers.map((speaker, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <input
                          type="text"
                          value={speaker.name}
                          onChange={(e) => handleContentChange('speakers', index, 'name', e.target.value)}
                          className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Full name"
                        />
                        <input
                          type="text"
                          value={speaker.role}
                          onChange={(e) => handleContentChange('speakers', index, 'role', e.target.value)}
                          className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Role / Title"
                        />
                        {content.speakers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setContent(prev => ({ ...prev, speakers: prev.speakers.filter((_, i) => i !== index) }))}
                            className="text-red-600 hover:text-red-800 mt-2"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Agenda Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">Event Agenda / Schedule</h4>
                    <button
                      type="button"
                      onClick={() => setContent(prev => ({ ...prev, agenda: [...prev.agenda, { time: '', title: '', description: '' }] }))}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Agenda Item
                    </button>
                  </div>
                  <div className="space-y-3">
                    {content.agenda.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="text-sm font-medium text-gray-700">Agenda Item {index + 1}</h5>
                          {content.agenda.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setContent(prev => ({ ...prev, agenda: prev.agenda.filter((_, i) => i !== index) }))}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={item.time}
                            onChange={(e) => handleContentChange('agenda', index, 'time', e.target.value)}
                            className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="Time (e.g. 10:00 AM)"
                          />
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleContentChange('agenda', index, 'title', e.target.value)}
                            className="col-span-2 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="Activity title"
                          />
                        </div>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleContentChange('agenda', index, 'description', e.target.value)}
                          className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="Brief description (optional)"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Featured Image */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Featured Image</h4>
                  <div className="flex items-center">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
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
                  {image && (
                    <p className="mt-2 text-sm text-gray-500">
                      Selected: {image.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Event...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}