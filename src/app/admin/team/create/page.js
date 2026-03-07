'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Upload, User, Briefcase, Mail, Link, X } from 'lucide-react'
import AdminLayout from '@/app/admin/components/AdminLayout'
import AdminApiService from '@/app/admin/services/admin-api'

export default function CreateTeamMemberPage() {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    bio: '',
    email: '',
    linkedinUrl: '',
    twitterUrl: '',
    isActive: true
  })
  const [image, setImage] = useState(null) // { file, preview }
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)
  const router = useRouter()

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (image?.preview) URL.revokeObjectURL(image.preview)
    setImage({ file, preview: URL.createObjectURL(file) })
  }

  const removeImage = () => {
    if (image?.preview) URL.revokeObjectURL(image.preview)
    setImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const validateForm = () => {
    if (!formData.name.trim()) { setError('Name is required'); return false }
    if (!formData.position.trim()) { setError('Position is required'); return false }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError('')

    try {
      const fd = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        fd.append(key, String(value))
      })
      if (image?.file) {
        fd.append('image', image.file)
      }

      const result = await AdminApiService.createTeamMember(fd)
      if (result.success) {
        router.push('/admin/team')
      } else {
        setError(result.message || 'Failed to create team member')
      }
    } catch (err) {
      setError('An error occurred while creating the team member')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 inline-flex items-center text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add Team Member</h1>
            <p className="mt-1 text-sm text-gray-500">Add a new member to your organisation&apos;s team</p>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-4 flex items-start gap-3">
            <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Form Fields */}
              <div className="lg:col-span-2 space-y-5">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    Personal Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text" name="name" id="name" required
                      value={formData.name} onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                      Position / Role *
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        type="text" name="position" id="position" required
                        value={formData.position} onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        placeholder="Job title or role"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio / Description
                  </label>
                  <textarea
                    name="bio" id="bio" rows={4}
                    value={formData.bio} onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Brief biography or description of role"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="email" name="email" id="email"
                      value={formData.email} onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn Profile
                    </label>
                    <div className="relative">
                      <Link className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        type="url" name="linkedinUrl" id="linkedinUrl"
                        value={formData.linkedinUrl} onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="twitterUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      Twitter / X Profile
                    </label>
                    <div className="relative">
                      <Link className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        type="url" name="twitterUrl" id="twitterUrl"
                        value={formData.twitterUrl} onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center pt-2">
                  <input
                    type="checkbox" name="isActive" id="isActive"
                    checked={formData.isActive} onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Active Team Member (visible on the website)
                  </label>
                </div>
              </div>

              {/* Right: Photo + Preview */}
              <div className="space-y-5">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900">Profile Photo</h3>
                  <p className="mt-1 text-sm text-gray-500">Optional — upload a photo</p>
                </div>

                {/* Upload area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                  {image ? (
                    <div className="relative">
                      <img
                        src={image.preview}
                        alt="Preview"
                        className="w-full h-56 object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <label
                          htmlFor="photo-upload"
                          className="bg-white text-gray-700 text-xs px-3 py-1.5 rounded-full shadow cursor-pointer hover:bg-gray-50 font-medium"
                        >
                          Change
                        </label>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-full shadow hover:bg-red-600 font-medium flex items-center gap-1"
                        >
                          <X className="h-3 w-3" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="photo-upload"
                      className="flex flex-col items-center justify-center h-56 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <Upload className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="text-sm text-gray-600 font-medium">Click to upload photo</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                    </label>
                  )}
                  <input
                    ref={fileInputRef}
                    id="photo-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>

                {image && (
                  <p className="text-xs text-gray-500 text-center">
                    Selected: <span className="font-medium">{image.file.name}</span>
                  </p>
                )}

                {/* Live Preview Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                    Live Preview
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center ring-2 ring-gray-200">
                      {image ? (
                        <img
                          src={image.preview}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {formData.name || <span className="text-gray-400 font-normal">Full Name</span>}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {formData.position || <span className="italic text-gray-400">Position</span>}
                      </p>
                      {formData.email && (
                        <p className="text-xs text-blue-600 truncate mt-0.5">{formData.email}</p>
                      )}
                    </div>
                  </div>

                  {formData.bio && (
                    <p className="mt-3 text-xs text-gray-600 line-clamp-3 border-t border-gray-100 pt-3">
                      {formData.bio}
                    </p>
                  )}

                  <div className="mt-3 flex items-center gap-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      formData.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {formData.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {formData.linkedinUrl && (
                      <span className="text-xs text-gray-400">LinkedIn ✓</span>
                    )}
                    {formData.twitterUrl && (
                      <span className="text-xs text-gray-400">Twitter ✓</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Bar */}
          <div className="px-4 py-4 bg-gray-50 flex items-center justify-between sm:px-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push('/admin/team')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center py-2.5 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding Member...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Add Team Member
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
