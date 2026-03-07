'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import AdminLayout from '../components/AdminLayout.js'
import DataTable from '../components/DataTable.js'
import AdminApiService from '../services/admin-api.js'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const result = await AdminApiService.getEvents({ page: 1, limit: 100 })
      if (result.success) {
        setEvents(result.data)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = (action, event) => {
    switch (action) {
      case 'view':
        router.push(`/admin/events/${event.id}`)
        break
      case 'edit':
        router.push(`/admin/events/edit/${event.id}`)
        break
      case 'delete':
        handleDelete(event)
        break
    }
  }

  const handleDelete = async (event) => {
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      try {
        const result = await AdminApiService.deleteEvent(event.id)
        if (result.success) {
          fetchEvents()
        } else {
          alert('Failed to delete event: ' + result.message)
        }
      } catch (error) {
        console.error('Error deleting event:', error)
        alert('An error occurred while deleting the event')
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
      key: 'eventDate',
      label: 'Event Date',
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
            <h1 className="text-2xl font-bold text-gray-900">Events</h1>
            <p className="mt-1 text-sm text-gray-500">
          Manage your organization&apos;s events
        </p>
          </div>
        </div>

        <DataTable
          title="All Events"
          data={events}
          columns={columns}
          actions={actions}
          onAction={handleAction}
          onCreate={() => router.push('/admin/events/create')}
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