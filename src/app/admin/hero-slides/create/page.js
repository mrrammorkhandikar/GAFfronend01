'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Upload, X, Image as ImageIcon } from 'lucide-react'
import AdminLayout from '@/app/admin/components/AdminLayout'
import AdminApiService from '@/app/admin/services/admin-api'

export default function CreateHeroSlidePage() {
  const [formData, setFormData] = useState({
    title: '',
    sortOrder: '0',
    isActive: true
  })
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)
  const router = useRouter()

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (image?.preview) URL.revokeObjectURL(image.preview)
    setImage({ file, preview: URL.createObjectURL(file) })
  }

  const removeImage = () => {
    if (image?.preview) URL.revokeObjectURL(image.preview)
    setImage(null)
    fileInputRef.current?.value && (fileInputRef.current.value = '')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!image?.file) {
      setError('Please upload an image')
      return
    }
    setLoading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('title', formData.title)
      fd.append('sortOrder', String(formData.sortOrder === '' ? 0 : parseInt(formData.sortOrder, 10) || 0))
      fd.append('isActive', String(formData.isActive))
      fd.append('image', image.file)

      const result = await AdminApiService.createHeroSlide(fd)
      if (result.success) {
        router.push('/admin/hero-slides')
      } else {
        setError(result.message || 'Failed to create slide')
      }
    } catch (err) {
      setError('An error occurred while creating the slide')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 inline-flex items-center text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add Hero Slide</h1>
            <p className="mt-1 text-sm text-gray-500">Add an image to the homepage hero slider</p>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-4 flex items-start gap-3">
            <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image *</label>
              <div className="flex items-start gap-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center min-w-[200px] min-h-[120px] bg-gray-50">
                  {image?.preview ? (
                    <>
                      <img
                        src={image.preview}
                        alt="Preview"
                        className="max-w-[180px] max-h-[100px] object-contain"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="mt-2 text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500 mb-2">PNG, JPG, WebP up to 5MB</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="hero-slide-image"
                      />
                      <label
                        htmlFor="hero-slide-image"
                        className="cursor-pointer inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose image
                      </label>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title / Caption (optional)
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="e.g. Partner logo or campaign name"
              />
            </div>

            <div>
              <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
                Display order
              </label>
              <input
                type="number"
                name="sortOrder"
                id="sortOrder"
                min={0}
                value={formData.sortOrder}
                onChange={handleInputChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="0"
              />
              <p className="mt-1 text-xs text-gray-500">Lower numbers appear first in the slider.</p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Show on homepage
              </label>
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 rounded-b-lg flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !image?.file}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Create slide'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
