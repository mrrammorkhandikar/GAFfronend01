'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Search, Filter, User, Mail, Phone, Download, Calendar, X } from 'lucide-react'
import AdminLayout from '@/app/admin/components/AdminLayout'
import AdminApiService from '@/app/admin/services/admin-api'

export default function CareerApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCareer, setSelectedCareer] = useState('')
  const [careers, setCareers] = useState([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })
  const router = useRouter()

  const fetchApplications = useCallback(async (page = 1) => {
    setLoading(true)
    setError('')
    
    try {
      const params = {
        page,
        limit: pagination.itemsPerPage
      }
      
      if (selectedCareer) {
        params.careerId = selectedCareer
      }
      
      const response = await AdminApiService.getCareerApplications(params)
      
      if (response.success) {
        setApplications(response.data)
        setPagination(response.pagination)
      } else {
        setError(response.message || 'Failed to fetch applications')
      }
    } catch (err) {
      setError('An error occurred while fetching applications')
      console.error('Error fetching applications:', err)
    } finally {
      setLoading(false)
    }
  }, [pagination.itemsPerPage, selectedCareer])

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await AdminApiService.getCareers({ active: true })
        if (response.success) {
          setCareers(response.data)
        }
      } catch (err) {
        console.error('Error fetching careers:', err)
      }
    }

    fetchCareers()
  }, [])

  useEffect(() => {
    fetchApplications(1)
  }, [fetchApplications])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this application?')) {
      return
    }
    
    try {
      const response = await AdminApiService.deleteCareerApplication(id)
      if (response.success) {
        fetchApplications(pagination.currentPage)
      } else {
        setError(response.message || 'Failed to delete application')
      }
    } catch (err) {
      setError('An error occurred while deleting application')
      console.error('Error deleting application:', err)
    }
  }

  const filteredApplications = applications.filter(application =>
    application.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    application.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    application.career?.title.toLowerCase().includes(searchTerm.toLowerCase())
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
              <h1 className="text-2xl font-bold text-gray-900">Career Applications</h1>
              <p className="mt-1 text-sm text-gray-500">
                Review and manage job applications
              </p>
            </div>
          </div>
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
                  placeholder="Search by name, email, or job title"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="careerFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Job
              </label>
              <select
                id="careerFilter"
                value={selectedCareer}
                onChange={(e) => setSelectedCareer(e.target.value)}
                className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Jobs</option>
                {careers.map(career => (
                  <option key={career.id} value={career.id}>
                    {career.title} ({career.location})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Applications ({pagination.totalItems})
            </h3>
          </div>
          
          {loading ? (
            <div className="px-4 py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedCareer 
                  ? 'No applications match your search criteria' 
                  : 'Applications will appear here when candidates apply'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {application.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {application.career?.title || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.career?.location}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {application.career?.employmentType}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {application.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Phone className="h-4 w-4 mr-1" />
                          {application.phone}
                        </div>
                        {application.resumeUrl && (
                          <div className="text-sm text-blue-600 flex items-center mt-1">
                            <Download className="h-4 w-4 mr-1" />
                            <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer">
                              View Resume
                            </a>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(application.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {application.resumeUrl && (
                          <a
                            href={application.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Download
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(application.id)}
                          className="text-red-600 hover:text-red-900"
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
                  onClick={() => fetchApplications(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchApplications(pagination.currentPage + 1)}
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
                      onClick={() => fetchApplications(pagination.currentPage - 1)}
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
                          onClick={() => fetchApplications(page)}
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
                      onClick={() => fetchApplications(pagination.currentPage + 1)}
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