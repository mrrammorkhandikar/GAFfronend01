'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '../../components/AdminLayout.js'
import DataTable from '../../components/DataTable.js'
import AdminApiService from '../../services/admin-api.js'

export default function VolunteerOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchOpportunities()
  }, [])

  const fetchOpportunities = async () => {
    try {
      const result = await AdminApiService.getVolunteerOpportunities({ page: 1, limit: 100 })
      if (result.success) {
        setOpportunities(result.data)
      }
    } catch (error) {
      console.error('Error fetching volunteer opportunities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = (action, opportunity) => {
    switch (action) {
      case 'view':
        router.push(`/admin/volunteers/opportunities/${opportunity.id}`)
        break
      case 'edit':
        router.push(`/admin/volunteers/opportunities/edit/${opportunity.id}`)
        break
      case 'delete':
        handleDelete(opportunity)
        break
    }
  }

  const handleDelete = async (opportunity) => {
    try {
      const result = await AdminApiService.deleteVolunteerOpportunity(opportunity.id)
      if (result.success) {
        fetchOpportunities()
      } else {
        alert('Failed to delete opportunity: ' + result.message)
      }
    } catch (error) {
      console.error('Error deleting opportunity:', error)
      alert('An error occurred while deleting the opportunity')
    }
  }

  const columns = [
    {
      key: 'title',
      label: 'Title',
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
      key: 'volunteers',
      label: 'Applications',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value?.length || 0} applications
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
            <h1 className="text-2xl font-bold text-gray-900">Volunteer Opportunities</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage volunteer opportunities for your organization
            </p>
          </div>
        </div>

        <DataTable
          title="All Volunteer Opportunities"
          data={opportunities}
          columns={columns}
          actions={actions}
          onAction={handleAction}
          onCreate={() => router.push('/admin/volunteers/opportunities/create')}
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