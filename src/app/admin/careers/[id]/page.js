'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, MapPin, Clock, FileText, Edit, Users } from 'lucide-react'
import AdminLayout from '@/app/admin/components/AdminLayout'
import AdminApiService from '@/app/admin/services/admin-api'

export default function ViewCareerPage() {
  const [career, setCareer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()
  const id = params.id

  useEffect(() => {
    const fetchCareer = async () => {
      setLoading(true)
      setError('')
      
      try {
        const response = await AdminApiService.getCareer(id)
        
        if (response.success) {
          setCareer(response.data)
        } else {
          setError(response.message || 'Failed to fetch career')
        }
      } catch (err) {
        setError('An error occurred while fetching career')
        console.error('Error fetching career:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCareer()
    }
  }, [id])

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  if (error || !career) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-700">{error || 'Career not found'}</div>
        </div>
      </AdminLayout>
    )
  }

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
              <h1 className="text-2xl font-bold text-gray-900">{career.title}</h1>
              <p className="mt-1 text-sm text-gray-500">
                Career details and applications
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push(`/admin/careers/edit/${career.id}`)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Career
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Job Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{career.description}</p>
              </div>
            </div>

            {/* Applications Preview */}
            {career.applications && career.applications.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Recent Applications</h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {career.applications.length} applications
                  </span>
                </div>
                <div className="space-y-3">
                  {career.applications.slice(0, 5).map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{application.name}</p>
                        <p className="text-sm text-gray-500">{application.email}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                  {career.applications.length > 5 && (
                    <button
                      onClick={() => router.push('/admin/careers/applications')}
                      className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View all {career.applications.length} applications
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Career Details */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">Career Details</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="text-sm text-gray-900">{career.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Employment Type</p>
                    <p className="text-sm text-gray-900">{career.employmentType}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Applications</p>
                    <p className="text-sm text-gray-900">
                      {career._count?.applications || 0} received
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full mr-2 ${
                      career.isActive ? 'bg-green-400' : 'bg-gray-400'
                    }`}></div>
                    <span className={`text-sm font-medium ${
                      career.isActive ? 'text-green-800' : 'text-gray-500'
                    }`}>
                      {career.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/admin/careers/edit/${career.id}`)}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Career
                </button>
                <button
                  onClick={() => router.push('/admin/careers')}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View All Careers
                </button>
                <button
                  onClick={() => router.push('/admin/careers/applications')}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Users className="h-4 w-4 mr-2" />
                  View Applications
                </button>
              </div>
            </div>

            {/* Application Stats */}
            {career._count?.applications > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">Application Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total Applications</span>
                    <span className="text-sm font-medium text-gray-900">
                      {career._count.applications}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">This Week</span>
                    <span className="text-sm font-medium text-green-600">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">This Month</span>
                    <span className="text-sm font-medium text-blue-600">12</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}