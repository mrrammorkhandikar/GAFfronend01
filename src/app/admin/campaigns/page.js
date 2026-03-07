'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import AdminLayout from '../components/AdminLayout.js'
import DataTable from '../components/DataTable.js'
import AdminApiService from '../services/admin-api.js'

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const result = await AdminApiService.getCampaigns({ page: 1, limit: 100 })
      if (result.success) {
        setCampaigns(result.data)
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = (action, campaign) => {
    switch (action) {
      case 'view':
        router.push(`/admin/campaigns/${campaign.id}`)
        break
      case 'edit':
        router.push(`/admin/campaigns/edit/${campaign.id}`)
        break
      case 'delete':
        handleDelete(campaign)
        break
    }
  }

  const handleDelete = async (campaign) => {
    if (window.confirm(`Are you sure you want to delete "${campaign.title}"?`)) {
      try {
        const result = await AdminApiService.deleteCampaign(campaign.id)
        if (result.success) {
          fetchCampaigns() // Refresh the list
        } else {
          alert('Failed to delete campaign: ' + result.message)
        }
      } catch (error) {
        console.error('Error deleting campaign:', error)
        alert('An error occurred while deleting the campaign')
      }
    }
  }

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (value, item) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-gray-500 text-sm">{item.slug}</div>
        </div>
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
      key: 'raisedAmount',
      label: 'Raised',
      render: (value, item) => (
        <div>
          <div className="font-medium">₹{(value || 0).toLocaleString('en-IN')}</div>
          {item.amount && (
            <div className="text-sm text-gray-500">
              of ₹{item.amount.toLocaleString('en-IN')}
            </div>
          )}
          {item.amount > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, Math.round(((value || 0) / item.amount) * 100))}%` }} />
            </div>
          )}
        </div>
      )
    },
    {
      key: 'startDate',
      label: 'Start Date',
      render: (value) => format(new Date(value), 'MMM dd, yyyy')
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
            <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your organization's campaigns
            </p>
          </div>
        </div>

        <DataTable
          title="All Campaigns"
          data={campaigns}
          columns={columns}
          actions={actions}
          onAction={handleAction}
          onCreate={() => router.push('/admin/campaigns/create')}
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