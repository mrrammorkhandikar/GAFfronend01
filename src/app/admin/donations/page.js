'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import AdminLayout from '../components/AdminLayout.js'
import DataTable from '../components/DataTable.js'
import AdminApiService from '../services/admin-api.js'

export default function DonationsPage() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [detailDonation, setDetailDonation] = useState(null)

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
        fetchDonations()
        setDetailDonation((prev) =>
          prev && prev.id === donationId ? { ...prev, status: newStatus } : prev
        )
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
      key: 'campaign',
      label: 'Campaign',
      render: (_, item) => (
        <div className="max-w-[180px] truncate text-gray-900 font-medium">
          {item.campaign?.title || '—'}
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value) => (
        <div className="font-bold text-gray-900">
          ₹{Number(value).toLocaleString('en-IN')}
        </div>
      )
    },
    {
      key: 'message',
      label: 'Message',
      render: (value) => (
        <div className="max-w-xs truncate text-gray-500">
          {value || '—'}
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
      label: 'Approve',
      type: 'edit'
    },
    {
      key: 'failed',
      label: 'Reject',
      type: 'delete'
    }
  ]

  const handleAction = (action, donation) => {
    const label = action === 'completed' ? 'approve' : 'reject'
    if (!window.confirm(`Are you sure you want to ${label} this donation?`)) return
    handleStatusChange(donation.id, action)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
          <p className="mt-1 text-sm text-gray-500">
            Review pending payments, approve to confirm and email the donor, or reject. Click a row for full details.
          </p>
        </div>

        <DataTable
          title="All Donations"
          data={donations}
          columns={columns}
          actions={actions}
          onAction={handleAction}
          onRowClick={(row) => setDetailDonation(row)}
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
                { value: 'completed', label: 'Approved' },
                { value: 'failed', label: 'Rejected' }
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
                      Total approved (₹)
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
                      Approved donations
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
                      Pending
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

      {/* Detail modal */}
      {detailDonation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          role="dialog"
          aria-modal="true"
          onClick={() => setDetailDonation(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-bold text-gray-900">Donation details</h2>
              <button
                type="button"
                onClick={() => setDetailDonation(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <dl className="space-y-3 text-sm text-black">
              <div>
                <dt className="text-gray-500">Status</dt>
                <dd className="font-medium capitalize">{detailDonation.status}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Amount</dt>
                <dd className="font-bold text-lg">
                  ₹{Number(detailDonation.amount).toLocaleString('en-IN')} {detailDonation.currency}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Campaign</dt>
                <dd className="font-medium">{detailDonation.campaign?.title || '—'}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Donor</dt>
                <dd className="font-medium">
                  {detailDonation.isAnonymous ? 'Anonymous' : detailDonation.donorName}
                </dd>
              </div>
              {!detailDonation.isAnonymous && (
                <div>
                  <dt className="text-gray-500">Email</dt>
                  <dd className="font-mono text-xs break-all">{detailDonation.donorEmail}</dd>
                </div>
              )}
              {detailDonation.donorPhone && (
                <div>
                  <dt className="text-gray-500">Phone</dt>
                  <dd>{detailDonation.donorPhone}</dd>
                </div>
              )}
              {detailDonation.donorAddress && (
                <div>
                  <dt className="text-gray-500">Address</dt>
                  <dd className="whitespace-pre-wrap">{detailDonation.donorAddress}</dd>
                </div>
              )}
              {detailDonation.message && (
                <div>
                  <dt className="text-gray-500">Message</dt>
                  <dd className="whitespace-pre-wrap">{detailDonation.message}</dd>
                </div>
              )}
              {detailDonation.receiptUrl && (
                <div>
                  <dt className="text-gray-500">Receipt</dt>
                  <dd>
                    <a
                      href={detailDonation.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View uploaded receipt
                    </a>
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-gray-500">Submitted</dt>
                <dd>{format(new Date(detailDonation.createdAt), 'PPpp')}</dd>
              </div>
            </dl>

            <p className="mt-4 text-xs text-gray-500">
              Payment was made via the instructions on the donate page (UPI or bank transfer). Match this entry with your
              bank/UPI statement before approving.
            </p>

            {detailDonation.status === 'pending' && (
              <div className="flex gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Approve this donation? The donor will receive a confirmation email and the campaign total will update.')) {
                      handleStatusChange(detailDonation.id, 'completed')
                    }
                  }}
                  className="flex-1 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reject this donation?')) {
                      handleStatusChange(detailDonation.id, 'failed')
                    }
                  }}
                  className="flex-1 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setDetailDonation(null)}
              className="mt-3 w-full py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
