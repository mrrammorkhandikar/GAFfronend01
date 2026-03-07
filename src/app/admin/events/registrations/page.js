'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Search, Filter, Calendar, User, Mail, Phone, X } from 'lucide-react'
import AdminLayout from '@/app/admin/components/AdminLayout'
import AdminApiService from '@/app/admin/services/admin-api'

export default function EventRegistrationsPage() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEvent, setSelectedEvent] = useState('')
  const [events, setEvents] = useState([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })
  const router = useRouter()

  const fetchRegistrations = useCallback(async (page = 1) => {
    setLoading(true)
    setError('')
    
    try {
      const params = {
        page,
        limit: pagination.itemsPerPage
      }
      
      if (selectedEvent) {
        params.eventId = selectedEvent
      }
      
      const response = await AdminApiService.getEventRegistrations(params)
      
      if (response.success) {
        setRegistrations(response.data)
        setPagination(response.pagination)
      } else {
        setError(response.message || 'Failed to fetch registrations')
      }
    } catch (err) {
      setError('An error occurred while fetching registrations')
      console.error('Error fetching registrations:', err)
    } finally {
      setLoading(false)
    }
  }, [pagination.itemsPerPage, selectedEvent])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await AdminApiService.getEvents({ active: true })
        if (response.success) {
          setEvents(response.data)
        }
      } catch (err) {
        console.error('Error fetching events:', err)
      }
    }

    fetchEvents()
  }, [])

  useEffect(() => {
    fetchRegistrations(1)
  }, [fetchRegistrations])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this registration?')) {
      return
    }
    
    try {
      const response = await AdminApiService.deleteEventRegistration(id)
      if (response.success) {
        fetchRegistrations(pagination.currentPage)
      } else {
        setError(response.message || 'Failed to delete registration')
      }
    } catch (err) {
      setError('An error occurred while deleting registration')
      console.error('Error deleting registration:', err)
    }
  }

  const filteredRegistrations = registrations.filter(registration =>
    registration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registration.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 inline-flex items-center text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Event Registrations</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage all event registrations
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push('/admin/events/registrations/create')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Registration
          </button>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search by name or email"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="eventFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Event
              </label>
              <select
                id="eventFilter"
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Events</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Registrations Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Registrations ({pagination.totalItems})
            </h3>
          </div>
          
          {loading ? (
            <div className="px-4 py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading registrations...</p>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No registrations found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedEvent 
                  ? 'No registrations match your search criteria' 
                  : 'Get started by adding a new registration'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registrant
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registered
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRegistrations.map((registration) => (
                    <tr key={registration.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {registration.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {registration.event?.title || 'N/A'}
                        </div>
                        {registration.event?.eventDate && (
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(registration.event.eventDate).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {registration.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Phone className="h-4 w-4 mr-1" />
                          {registration.mobile}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(registration.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDelete(registration.id)}
                          className="text-red-600 hover:text-red-900 ml-4"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => fetchRegistrations(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchRegistrations(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.itemsPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
                    </span>{' '}
                    of <span className="font-medium">{pagination.totalItems}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => fetchRegistrations(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {[...Array(pagination.totalPages)].map((_, index) => {
                      const page = index + 1
                      return (
                        <button
                          key={page}
                          onClick={() => fetchRegistrations(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === pagination.currentPage
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}
                    <button
                      onClick={() => fetchRegistrations(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}