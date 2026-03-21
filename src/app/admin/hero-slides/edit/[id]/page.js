'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Upload, X, Image as ImageIcon } from 'lucide-react'
import AdminLayout from '@/app/admin/components/AdminLayout'
import AdminApiService from '@/app/admin/services/admin-api'

export default function EditHeroSlidePage() {
  const [slide, setSlide] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    sortOrder: '0',
    isActive: true
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef(null)
  const router = useRouter()
  const params = useParams()
  const id = params?.id

  useEffect(() => {
    if (id) fetchSlide()
  }, [id])

  const fetchSlide = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await AdminApiService.getHeroSlide(id)
      if (response.success) {
        const d = response.data
        setSlide(d)
        setImagePreview(d.imageUrl || null)
        setFormData({
          title: d.title || '',
          sortOrder: String(d.sortOrder ?? 0),
          isActive: d.isActive
        })
      } else {
        setError(response.message || 'Failed to fetch slide')
      }
    } catch (err) {
      setError('An error occurred while fetching the slide')
      console.error(err)
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
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (image?.preview) URL.revokeObjectURL(image.preview)
    setImage({ file, preview: URL.createObjectURL(file) })
  }

  const removeNewImage = () => {
    if (image?.preview) URL.revokeObjectURL(image.preview)
    setImage(null)
    fileInputRef.current?.value && (fileInputRef.current.value = '')
  }

  const currentDisplayImage = image?.preview || imagePreview

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      const fd = new FormData()
      fd.append('title', formData.title)
      fd.append('sortOrder', String(formData.sortOrder === '' ? 0 : parseInt(formData.sortOrder, 10) || 0))
      fd.append('isActive', String(formData.isActive))
      if (image?.file) fd.append('image', image.file)

      const result = await AdminApiService.updateHeroSlide(id, fd)
      if (result.success) {
        setSuccess(true)
        const updated = result.data
        setSlide(updated)
        if (updated.imageUrl) setImagePreview(updated.imageUrl)
        if (image?.preview) URL.revokeObjectURL(image.preview)
        setImage(null)
        fileInputRef.current?.value && (fileInputRef.current.value = '')
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(result.message || 'Failed to update slide')
      }
    } catch (err) {
      setError('An error occurred while updating the slide')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </AdminLayout>
    )
  }

  if (!slide && !loading) {
    return (
      <AdminLayout>
        <div className="rounded-md bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-700">Slide not found.</p>
          <button
            onClick={() => router.push('/admin/hero-slides')}
            className="mt-2 text-sm font-medium text-red-700 hover:underline"
          >
            Back to Hero Slides
          </button>
        </div>
      </AdminLayout>
    )
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
            <h1 className="text-2xl font-bold text-gray-900">Edit Hero Slide</h1>
            <p className="mt-1 text-sm text-gray-500">Update this slider image</p>
          </div>
        </div>

        {success && (
          <div className="rounded-md bg-green-50 border border-green-200 p-4">
            <p className="text-sm text-green-700">Slide updated successfully.</p>
          </div>
        )}
        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-4 flex items-start gap-3">
            <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
              <div className="flex items-start gap-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center min-w-[200px] min-h-[120px] bg-gray-50">
                  {currentDisplayImage ? (
                    <>
                      <img
                        src={currentDisplayImage}
                        alt="Slide"
                        className="max-w-[180px] max-h-[100px] object-contain"
                      />
                      {image?.file && (
                        <button
                          type="button"
                          onClick={removeNewImage}
                          className="mt-2 text-sm text-red-600 hover:text-red-700"
                        >
                          Remove new image
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500 mb-2">No image</span>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="hero-slide-image-edit"
                  />
                  <label
                    htmlFor="hero-slide-image-edit"
                    className="mt-2 cursor-pointer inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {currentDisplayImage ? 'Replace image' : 'Choose image'}
                  </label>
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
              onClick={() => router.push('/admin/hero-slides')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
