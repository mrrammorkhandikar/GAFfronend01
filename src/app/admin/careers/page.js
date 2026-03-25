'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '../components/AdminLayout.js'
import DataTable from '../components/DataTable.js'
import AdminApiService from '../services/admin-api.js'

export default function CareersPage() {
  const [careers, setCareers] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchCareers()
  }, [])

  const fetchCareers = async () => {
    try {
      const result = await AdminApiService.getCareers({ page: 1, limit: 100 })
      if (result.success) {
        setCareers(result.data)
      }
    } catch (error) {
      console.error('Error fetching careers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = (action, career) => {
    switch (action) {
      case 'view':
        router.push(`/admin/careers/${career.id}`)
        break
      case 'edit':
        router.push(`/admin/careers/edit/${career.id}`)
        break
      case 'delete':
        handleDelete(career)
        break
    }
  }

  const handleDelete = async (career) => {
    try {
      const result = await AdminApiService.deleteCareer(career.id)
      if (result.success) {
        fetchCareers()
      } else {
        alert('Failed to delete career: ' + result.message)
      }
    } catch (error) {
      console.error('Error deleting career:', error)
      alert('An error occurred while deleting the career')
    }
  }

  const columns = [
    {
      key: 'title',
      label: 'Position',
      render: (value) => (
        <div className="font-medium text-gray-900">{value}</div>
      )
    },
    {
      key: 'description',
      label: 'Description',
      render: (value) => (
        <div className="max-w-xs truncate text-gray-500">
          {value}
        </div>
      )
    },
    {
      key: 'location',
      label: 'Location'
    },
    {
      key: 'employmentType',
      label: 'Type',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {value}
        </span>
      )
    },
    {
      key: 'applications',
      label: 'Applications',
      render: (value, item) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {(item?._count?.applications ?? value?.length ?? 0)} applications
        </span>
      )
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
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
            <h1 className="text-2xl font-bold text-gray-900">Career Opportunities</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage job listings for your organization
            </p>
          </div>
        </div>

        <DataTable
          title="All Job Listings"
          data={careers}
          columns={columns}
          actions={actions}
          onAction={handleAction}
          onCreate={() => router.push('/admin/careers/create')}
          loading={loading}
          searchable={true}
          filterable={true}
          filters={[
            {
              key: 'employmentType',
              label: 'Employment Type',
              options: [
                { value: '', label: 'All Types' },
                { value: 'Full-time', label: 'Full-time' },
                { value: 'Part-time', label: 'Part-time' },
                { value: 'Internship', label: 'Internship' }
              ]
            },
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