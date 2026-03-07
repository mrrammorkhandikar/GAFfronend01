'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, MapPin, Clock, Briefcase } from 'lucide-react'
import AdminLayout from '@/app/admin/components/AdminLayout'
import AdminApiService from '@/app/admin/services/admin-api'

export default function EditCareerPage() {
  const [career, setCareer] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    employmentType: 'Full-time',
    isActive: true
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()
  const id = params.id

  useEffect(() => {
    const fetchCareer = async () => {
      setLoading(true)
      setError('')
      
      try {
        const response = await AdminApiService.getCareer(id)
        
        if (response.success) {
          const careerData = response.data
          setCareer(careerData)
          
          // Populate form data
          setFormData({
            title: careerData.title,
            description: careerData.description,
            location: careerData.location,
            employmentType: careerData.employmentType,
            isActive: careerData.isActive
          })
        } else {
          setError(response.message || 'Failed to fetch career')
        }
      } catch (err) {
        setError('An error occurred while fetching career')
        console.error('Error fetching career:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCareer()
    }
  }, [id])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Job title is required')
      return false
    }
    if (!formData.description.trim()) {
      setError('Job description is required')
      return false
    }
    if (!formData.location.trim()) {
      setError('Location is required')
      return false
    }
    if (!formData.employmentType) {
      setError('Employment type is required')
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
      const result = await AdminApiService.updateCareer(id, formData)
      
      if (result.success) {
        router.push('/admin/careers')
      } else {
        setError(result.message || 'Failed to update career')
      }
    } catch (err) {
      setError('An error occurred while updating the career')
      console.error('Error updating career:', err)
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

  if (error && !career) {
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
              <h1 className="text-2xl font-bold text-gray-900">Edit Career</h1>
              <p className="mt-1 text-sm text-gray-500">
                Update career details and requirements
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
            <div className="max-w-2xl mx-auto">
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                    Job Details
                  </h3>
                </div>
                
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                    placeholder="Enter job title"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description *
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={12}
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                    placeholder="Describe the role, responsibilities, requirements, and benefits in detail..."
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="location"
                      id="location"
                      required
                      value={formData.location}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                      placeholder="City, Country or Remote"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-1">
                    Employment Type *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                      name="employmentType"
                      id="employmentType"
                      required
                      value={formData.employmentType}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Internship">Internship</option>
                    </select>
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
                    Active Job Posting
                  </label>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Preview</h4>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{formData.title || 'Job Title'}</h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          {formData.location || 'Location'}
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {formData.employmentType || 'Employment Type'}
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        formData.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {formData.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      {formData.description 
                        ? formData.description.substring(0, 200) + (formData.description.length > 200 ? '...' : '') 
                        : 'Job description will appear here...'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating Job...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Job Posting
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}