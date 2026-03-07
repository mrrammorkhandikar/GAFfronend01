'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Calendar, Users, FileText, Edit } from 'lucide-react'
import AdminLayout from '@/app/admin/components/AdminLayout'
import AdminApiService from '@/app/admin/services/admin-api'

export default function ViewVolunteerOpportunityPage() {
  const [opportunity, setOpportunity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()
  const id = params.id

  useEffect(() => {
    const fetchOpportunity = async () => {
      setLoading(true)
      setError('')
      
      try {
        const response = await AdminApiService.getVolunteerOpportunity(id)
        
        if (response.success) {
          setOpportunity(response.data)
        } else {
          setError(response.message || 'Failed to fetch opportunity')
        }
      } catch (err) {
        setError('An error occurred while fetching opportunity')
        console.error('Error fetching opportunity:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchOpportunity()
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

  if (error || !opportunity) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-700">{error || 'Opportunity not found'}</div>
        </div>
      </AdminLayout>
    )
  }

  // Parse requirements and benefits from JSON
  let requirements = []
  let benefits = []
  
  try {
    requirements = JSON.parse(opportunity.requirements || '[]')
  } catch (e) {
    requirements = []
  }
  
  try {
    benefits = JSON.parse(opportunity.benefits || '[]')
  } catch (e) {
    benefits = []
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
              <h1 className="text-2xl font-bold text-gray-900">{opportunity.title}</h1>
              <p className="mt-1 text-sm text-gray-500">
                Volunteer opportunity details
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push(`/admin/volunteers/opportunities/edit/${opportunity.id}`)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Opportunity
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{opportunity.description}</p>
              </div>
            </div>

            {/* Requirements */}
            {requirements.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-red-600" />
                  Requirements
                </h2>
                <ul className="space-y-2">
                  {requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-red-600"></div>
                      </div>
                      <p className="ml-3 text-gray-700">{requirement}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {benefits.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-green-600" />
                  Benefits
                </h2>
                <ul className="space-y-2">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-green-600"></div>
                      </div>
                      <p className="ml-3 text-gray-700">{benefit}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Applications Preview */}
            {opportunity.applications && opportunity.applications.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Recent Applications</h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {opportunity.applications.length} applications
                  </span>
                </div>
                <div className="space-y-3">
                  {opportunity.applications.slice(0, 5).map((application) => (
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
                  {opportunity.applications.length > 5 && (
                    <button
                      onClick={() => router.push('/admin/volunteers/applications')}
                      className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View all {opportunity.applications.length} applications
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Opportunity Details */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">Opportunity Details</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Applications</p>
                    <p className="text-sm text-gray-900">
                      {opportunity._count?.applications || 0} received
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Created</p>
                    <p className="text-sm text-gray-900">
                      {new Date(opportunity.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full mr-2 ${
                      opportunity.isActive ? 'bg-green-400' : 'bg-gray-400'
                    }`}></div>
                    <span className={`text-sm font-medium ${
                      opportunity.isActive ? 'text-green-800' : 'text-gray-500'
                    }`}>
                      {opportunity.isActive ? 'Active' : 'Inactive'}
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
                  onClick={() => router.push(`/admin/volunteers/opportunities/edit/${opportunity.id}`)}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Opportunity
                </button>
                <button
                  onClick={() => router.push('/admin/volunteers/opportunities')}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View All Opportunities
                </button>
                <button
                  onClick={() => router.push('/admin/volunteers/applications')}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Users className="h-4 w-4 mr-2" />
                  View Applications
                </button>
              </div>
            </div>

            {/* Application Stats */}
            {opportunity._count?.applications > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">Application Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total Applications</span>
                    <span className="text-sm font-medium text-gray-900">
                      {opportunity._count.applications}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">This Week</span>
                    <span className="text-sm font-medium text-green-600">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">This Month</span>
                    <span className="text-sm font-medium text-blue-600">8</span>
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