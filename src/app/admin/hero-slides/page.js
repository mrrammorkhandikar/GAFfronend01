'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import AdminLayout from '../components/AdminLayout.js'
import DataTable from '../components/DataTable.js'
import AdminApiService from '../services/admin-api.js'

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    try {
      const result = await AdminApiService.getHeroSlides({ page: 1, limit: 100 })
      if (result.success) {
        setSlides(result.data)
      }
    } catch (error) {
      console.error('Error fetching hero slides:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = (action, slide) => {
    switch (action) {
      case 'edit':
        router.push(`/admin/hero-slides/edit/${slide.id}`)
        break
      case 'delete':
        handleDelete(slide)
        break
    }
  }

  const handleDelete = async (slide) => {
    if (window.confirm('Are you sure you want to delete this slide?')) {
      try {
        const result = await AdminApiService.deleteHeroSlide(slide.id)
        if (result.success) {
          fetchSlides()
        } else {
          alert('Failed to delete: ' + (result.message || 'Unknown error'))
        }
      } catch (error) {
        console.error('Error deleting slide:', error)
        alert('An error occurred while deleting the slide')
      }
    }
  }

  const columns = [
    {
      key: 'imageUrl',
      label: 'Image',
      render: (value, item) => (
        <div className="flex items-center">
          {value ? (
            <Image
              src={value}
              alt={item.title || 'Slide'}
              width={80}
              height={45}
              className="rounded object-cover border border-gray-200"
            />
          ) : (
            <div className="w-20 h-[45px] rounded bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
              No image
            </div>
          )}
        </div>
      )
    },
    {
      key: 'title',
      label: 'Title / Caption',
      render: (value) => (
        <span className="text-gray-900">{value || '—'}</span>
      )
    },
    {
      key: 'sortOrder',
      label: 'Order'
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ]

  const actions = [
    { key: 'edit', label: 'Edit', type: 'edit' },
    { key: 'delete', label: 'Delete', type: 'delete' }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hero Slider Images</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage images shown in the homepage hero slider section
            </p>
          </div>
        </div>

        <DataTable
          title="All Slides"
          data={slides}
          columns={columns}
          actions={actions}
          onAction={handleAction}
          onCreate={() => router.push('/admin/hero-slides/create')}
          loading={loading}
          searchable={true}
          filterable={true}
          filters={[
            {
              key: 'isActive',
              label: 'Status',
              options: [
                { value: '', label: 'All Status' },
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' }
              ]
            }
          ]}
        />
      </div>
    </AdminLayout>
  )
}
