'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '../components/AdminLayout.js'
import DataTable from '../components/DataTable.js'
import AdminApiService from '../services/admin-api.js'

export default function PartnersPage() {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    try {
      const result = await AdminApiService.getPartners({ page: 1, limit: 100 })
      if (result.success) {
        setPartners(result.data)
      }
    } catch (error) {
      console.error('Error fetching partners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = (action, partner) => {
    switch (action) {
      case 'view':
        router.push(`/admin/partners/${partner.id}`)
        break
      case 'edit':
        router.push(`/admin/partners/create?id=${partner.id}`)
        break
      case 'delete':
        handleDelete(partner)
        break
      default:
        break
    }
  }

  const handleDelete = async (partner) => {
    if (window.confirm(`Are you sure you want to delete "${partner.name}"?`)) {
      try {
        const result = await AdminApiService.deletePartner(partner.id)
        if (result.success) {
          fetchPartners()
        } else {
          alert('Failed to delete partner: ' + (result.message || 'Unknown error'))
        }
      } catch (error) {
        console.error('Error deleting partner:', error)
        alert('An error occurred while deleting the partner')
      }
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Partner',
      render: (value, item) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-gray-500 text-sm">{item.shortDescription}</div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type'
    },
    {
      key: 'city',
      label: 'Location',
      render: (value, item) => (
        <span className="text-gray-700">
          {[item.city, item.country].filter(Boolean).join(', ') || '—'}
        </span>
      )
    },
    {
      key: 'isFeatured',
      label: 'Featured',
      render: (value) =>
        value ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Featured
          </span>
        ) : (
          <span className="text-xs text-gray-400">Standard</span>
        )
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ]

  const actions = [
    { key: 'view', label: 'View', type: 'view' },
    { key: 'edit', label: 'Edit', type: 'edit' },
    { key: 'delete', label: 'Delete', type: 'delete' }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Partners</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage organizations and individuals who partner with Guru Akanksha Foundation.
            </p>
          </div>
        </div>

        <DataTable
          title="All Partners"
          data={partners}
          columns={columns}
          actions={actions}
          onAction={handleAction}
          onCreate={() => router.push('/admin/partners/create')}
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

