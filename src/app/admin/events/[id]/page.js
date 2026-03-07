'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Calendar, MapPin, Image as ImageIcon, FileText, Edit } from 'lucide-react'
import AdminLayout from '@/app/admin/components/AdminLayout'
import AdminApiService from '@/app/admin/services/admin-api'

export default function ViewEventPage() {
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()
  const id = params.id

  useEffect(() => {
    if (id) {
      fetchEvent()
    }
  }, [id])

  const fetchEvent = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await AdminApiService.getEvent(id)
      
      if (response.success) {
        setEvent(response.data)
      } else {
        setError(response.message || 'Failed to fetch event')
      }
    } catch (err) {
      setError('An error occurred while fetching event')
      console.error('Error fetching event:', err)
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

  if (error || !event) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-700">{error || 'Event not found'}</div>
        </div>
      </AdminLayout>
    )
  }

  const content = event.content || {}
  const aboutContent = content.about || []
  const journey = content.journey || []
  const keyAchievements = content.keyAchievements || []

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
              <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
              <p className="mt-1 text-sm text-gray-500">
                Event details and content
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push(`/admin/events/edit/${event.id}`)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Event
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            {aboutContent.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">About This Event</h2>
                <div className="space-y-4">
                  {aboutContent.map((paragraph, index) => (
                    <p key={index} className="text-gray-700">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Journey Section */}
            {journey.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Event Journey</h2>
                <div className="space-y-6">
                  {journey.map((journeyItem, index) => (
                    <div key={index} className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                          <span className="text-sm font-medium text-blue-800">{index + 1}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-md font-medium text-gray-900">{journeyItem.title}</h3>
                        <p className="mt-1 text-gray-600">{journeyItem.description}</p>
                        {journeyItem.imageUrl && (
                          <div className="mt-3">
                            <Image
                              src={journeyItem.imageUrl}
                              alt={journeyItem.title}
                              width={500}
                              height={300}
                              className="rounded-lg max-w-md w-full h-auto"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Achievements */}
            {keyAchievements.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Key Achievements</h2>
                <ul className="space-y-2">
                  {keyAchievements.map((achievement, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-green-600"></div>
                      </div>
                      <p className="ml-3 text-gray-700">{achievement}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Image */}
            {event.imageUrl && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Featured Image</h2>
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  width={500}
                  height={300}
                  className="w-full rounded-lg h-auto"
                />
              </div>
            )}

            {/* Event Details */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">Event Details</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Date & Time</p>
                    <p className="text-sm text-gray-900">
                      {new Date(event.eventDate).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="text-sm text-gray-900">{event.location}</p>
                  </div>
                </div>
                
                {event.campaign && (
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Campaign</p>
                      <p className="text-sm text-gray-900">{event.campaign.title}</p>
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full mr-2 ${
                      event.isActive ? 'bg-green-400' : 'bg-gray-400'
                    }`}></div>
                    <span className={`text-sm font-medium ${
                      event.isActive ? 'text-green-800' : 'text-gray-500'
                    }`}>
                      {event.isActive ? 'Active' : 'Inactive'}
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
                  onClick={() => router.push(`/admin/events/edit/${event.id}`)}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Event
                </button>
                <button
                  onClick={() => router.push('/admin/events')}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View All Events
                </button>
                <button
                  onClick={() => router.push(`/admin/events/registrations`)}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Registrations
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}