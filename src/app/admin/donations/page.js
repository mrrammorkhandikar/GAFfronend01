'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import AdminLayout from '../components/AdminLayout.js'
import DataTable from '../components/DataTable.js'
import AdminApiService from '../services/admin-api.js'

export default function DonationsPage() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDonations()
  }, [])

  const fetchDonations = async () => {
    try {
      const result = await AdminApiService.getDonations({ page: 1, limit: 100 })
      if (result.success) {
        setDonations(result.data)
      }
    } catch (error) {
      console.error('Error fetching donations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (donationId, newStatus) => {
    try {
      const result = await AdminApiService.updateDonationStatus(donationId, newStatus)
      if (result.success) {
        fetchDonations() // Refresh the list
      } else {
        alert('Failed to update donation status: ' + result.message)
      }
    } catch (error) {
      console.error('Error updating donation status:', error)
      alert('An error occurred while updating the donation status')
    }
  }

  const columns = [
    {
      key: 'donorName',
      label: 'Donor',
      render: (value, item) => (
        <div>
          <div className="font-medium text-gray-900">
            {item.isAnonymous ? 'Anonymous' : value}
          </div>
          {!item.isAnonymous && (
            <div className="text-gray-500 text-sm">{item.donorEmail}</div>
          )}
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value) => (
        <div className="font-bold text-gray-900">
          ₹{value.toLocaleString('en-IN')}
        </div>
      )
    },
    {
      key: 'message',
      label: 'Message',
      render: (value) => (
        <div className="max-w-xs truncate text-gray-500">
          {value || 'No message'}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const statusColors = {
          pending: 'bg-yellow-100 text-yellow-800',
          completed: 'bg-green-100 text-green-800',
          failed: 'bg-red-100 text-red-800'
        }
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        )
      }
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (value) => format(new Date(value), 'MMM dd, yyyy')
    }
  ]

  const actions = [
    {
      key: 'completed',
      label: 'Mark as Completed',
      type: 'edit'
    },
    {
      key: 'failed',
      label: 'Mark as Failed',
      type: 'delete'
    }
  ]

  const handleAction = (action, donation) => {
    handleStatusChange(donation.id, action)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track donations to your organization
          </p>
        </div>

        <DataTable
          title="All Donations"
          data={donations}
          columns={columns}
          actions={actions}
          onAction={handleAction}
          loading={loading}
          searchable={true}
          filterable={true}
          filters={[
            {
              key: 'status',
              label: 'Status',
              options: [
                { value: '', label: 'All Status' },
                { value: 'pending', label: 'Pending' },
                { value: 'completed', label: 'Completed' },
                { value: 'failed', label: 'Failed' }
              ]
            }
          ]}
        />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Raised
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        ₹{donations
                          .filter(d => d.status === 'completed')
                          .reduce((sum, d) => sum + d.amount, 0)
                          .toLocaleString('en-IN')}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Completed Donations
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {donations.filter(d => d.status === 'completed').length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending Donations
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {donations.filter(d => d.status === 'pending').length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}