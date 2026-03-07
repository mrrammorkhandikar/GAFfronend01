'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Calendar, MapPin, IndianRupee, Image as ImageIcon, FileText, Edit } from 'lucide-react'
import AdminLayout from '@/app/admin/components/AdminLayout'
import AdminApiService from '@/app/admin/services/admin-api'

export default function ViewCampaignPage() {
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()
  const id = params.id

  useEffect(() => {
    if (id) {
      fetchCampaign()
    }
  }, [id])

  const fetchCampaign = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await AdminApiService.getCampaign(id)
      
      if (response.success) {
        setCampaign(response.data)
      } else {
        setError(response.message || 'Failed to fetch campaign')
      }
    } catch (err) {
      setError('An error occurred while fetching campaign')
      console.error('Error fetching campaign:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  if (error || !campaign) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-700">{error || 'Campaign not found'}</div>
        </div>
      </AdminLayout>
    )
  }

  const content = campaign.content || {}
  const aboutContent = content.about || []
  const impactGallery = content.impactGallery || []
  const keyFocusAreas = content.keyFocusAreas || []

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
              <h1 className="text-2xl font-bold text-gray-900">{campaign.title}</h1>
              <p className="mt-1 text-sm text-gray-500">
                Campaign details and content
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push(`/admin/campaigns/edit/${campaign.id}`)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Campaign
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            {aboutContent.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">About This Campaign</h2>
                <div className="space-y-4">
                  {aboutContent.map((paragraph, index) => (
                    <p key={index} className="text-gray-700">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Key Focus Areas */}
            {keyFocusAreas.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Key Focus Areas</h2>
                <ul className="space-y-2">
                  {keyFocusAreas.map((area, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                      </div>
                      <p className="ml-3 text-gray-700">{area}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Impact Gallery */}
            {impactGallery.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Impact Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {impactGallery.map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      {image ? (
                        <img
                          src={image}
                          alt={`Impact ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Image */}
            {campaign.imageUrl && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">Featured Image</h3>
                <img
                  src={campaign.imageUrl}
                  alt={campaign.title}
                  className="w-full rounded-lg"
                />
              </div>
            )}

            {/* Campaign Details */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">Campaign Details</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="text-sm text-gray-900">{campaign.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Duration</p>
                    <p className="text-sm text-gray-900">
                      {new Date(campaign.startDate).toLocaleDateString()}
                      {campaign.endDate && ` - ${new Date(campaign.endDate).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <IndianRupee className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Funding</p>
                    <p className="text-sm text-gray-900">
                      Target: ₹{campaign.amount?.toLocaleString('en-IN') || 'N/A'}
                    </p>
                    {campaign.raisedAmount && (
                      <p className="text-sm text-green-600">
                        Raised: ₹{campaign.raisedAmount.toLocaleString('en-IN')}
                      </p>
                    )}
                    {campaign.amount > 0 && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${Math.min(100, Math.round(((campaign.raisedAmount || 0) / campaign.amount) * 100))}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {Math.min(100, Math.round(((campaign.raisedAmount || 0) / campaign.amount) * 100))}% funded
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full mr-2 ${
                      campaign.isActive ? 'bg-green-400' : 'bg-gray-400'
                    }`}></div>
                    <span className={`text-sm font-medium ${
                      campaign.isActive ? 'text-green-800' : 'text-gray-500'
                    }`}>
                      {campaign.isActive ? 'Active' : 'Inactive'}
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
                  onClick={() => router.push(`/admin/campaigns/edit/${campaign.id}`)}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Campaign
                </button>
                <button
                  onClick={() => router.push('/admin/campaigns')}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View All Campaigns
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}