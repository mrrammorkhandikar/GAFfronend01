'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Calendar, User, Mail, Phone, Link, Edit } from 'lucide-react'
import AdminLayout from '@/app/admin/components/AdminLayout'
import AdminApiService from '@/app/admin/services/admin-api'

export default function ViewTeamMemberPage() {
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()
  const id = params.id

  useEffect(() => {
    const fetchMember = async () => {
      setLoading(true)
      setError('')
      
      try {
        const response = await AdminApiService.getTeamMember(id)
        
        if (response.success) {
          setMember(response.data)
        } else {
          setError(response.message || 'Failed to fetch team member')
        }
      } catch (err) {
        setError('An error occurred while fetching team member')
        console.error('Error fetching team member:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchMember()
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

  if (error || !member) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-700">{error || 'Team member not found'}</div>
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
              <h1 className="text-2xl font-bold text-gray-900">{member.name}</h1>
              <p className="mt-1 text-sm text-gray-500">
                Team member profile
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push(`/admin/team/edit/${member.id}`)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Member
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            {member.bio && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Biography</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{member.bio}</p>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
                {member.email && (
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <a href={`mailto:${member.email}`} className="text-sm text-blue-600 hover:text-blue-800">
                        {member.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {member.phone && (
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <a href={`tel:${member.phone}`} className="text-sm text-blue-600 hover:text-blue-800">
                        {member.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {member.linkedinUrl && (
                  <div className="flex items-start">
                    <Link className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">LinkedIn</p>
                      <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800">
                        View Profile
                      </a>
                    </div>
                  </div>
                )}
                
                {member.twitterUrl && (
                  <div className="flex items-start">
                    <Link className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Twitter</p>
                      <a href={member.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800">
                        View Profile
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Image */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">Profile Image</h3>
              <div className="flex justify-center">
                {member.imageUrl ? (
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    width={192}
                    height={192}
                    className="rounded-full object-cover border-4 border-gray-200"
                  />
                ) : (
                  <div className="h-48 w-48 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-200">
                    <User className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Member Details */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">Member Details</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Position</p>
                    <p className="text-sm text-gray-900">{member.position}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Joined</p>
                    <p className="text-sm text-gray-900">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full mr-2 ${
                      member.isActive ? 'bg-green-400' : 'bg-gray-400'
                    }`}></div>
                    <span className={`text-sm font-medium ${
                      member.isActive ? 'text-green-800' : 'text-gray-500'
                    }`}>
                      {member.isActive ? 'Active' : 'Inactive'}
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
                  onClick={() => router.push(`/admin/team/edit/${member.id}`)}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Member
                </button>
                <button
                  onClick={() => router.push('/admin/team')}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <User className="h-4 w-4 mr-2" />
                  View All Members
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}