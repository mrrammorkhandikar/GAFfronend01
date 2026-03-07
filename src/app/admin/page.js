'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Calendar, 
  HandHeart, 
  Briefcase, 
  CreditCard, 
  MessageCircle,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  UserPlus
} from 'lucide-react'
import AdminLayout from './components/AdminLayout.js'
import AdminApiService from './services/admin-api.js'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    campaigns: 0,
    events: 0,
    volunteerOpportunities: 0,
    careers: 0,
    donations: 0,
    contactForms: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    console.log('Fetching dashboard stats...');
    try {
      const result = await AdminApiService.getDashboardStats()
      console.log('API result:', result);
      if (result.success) {
        setStats(result.data)
        console.log('Stats updated:', result.data);
      } else {
        console.error('API returned failure:', result);
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      console.log('Setting loading to false');
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Campaigns',
      value: stats.campaigns,
      icon: HandHeart,
      color: 'bg-blue-500',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Active Events',
      value: stats.events,
      icon: Calendar,
      color: 'bg-green-500',
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'Volunteer Opportunities',
      value: stats.volunteerOpportunities,
      icon: UserPlus,
      color: 'bg-purple-500',
      change: '+5%',
      trend: 'up'
    },
    {
      title: 'Career Listings',
      value: stats.careers,
      icon: Briefcase,
      color: 'bg-yellow-500',
      change: '+3%',
      trend: 'up'
    },
    {
      title: 'Donations',
      value: stats.donations,
      icon: CreditCard,
      color: 'bg-red-500',
      change: '+15%',
      trend: 'up'
    },
    {
      title: 'Contact Forms',
      value: stats.contactForms,
      icon: MessageCircle,
      color: 'bg-indigo-500',
      change: '+20%',
      trend: 'up'
    }
  ]

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#222222] font-playfair">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600 font-poppins">
            Welcome to your Guru Akanksha Foundation admin panel
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`${stat.color} rounded-md p-3`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate font-poppins">
                          {stat.title}
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-[#222222] font-playfair">
                            {stat.value}
                          </div>
                          <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {stat.trend === 'up' ? (
                              <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                              <TrendingDown className="h-4 w-4 mr-1" />
                            )}
                            {stat.change}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-[#222222] mb-4 font-playfair">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#6D190D] hover:bg-[#8B2317] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D190D] font-poppins">
                <HandHeart className="h-4 w-4 mr-2" />
                Create Campaign
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#6D190D] hover:bg-[#8B2317] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D190D] font-poppins">
                <Calendar className="h-4 w-4 mr-2" />
                Add Event
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#6D190D] hover:bg-[#8B2317] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D190D] font-poppins">
                <UserPlus className="h-4 w-4 mr-2" />
                New Volunteer Op
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#6D190D] hover:bg-[#8B2317] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D190D] font-poppins">
                <Briefcase className="h-4 w-4 mr-2" />
                Post Job
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Campaigns */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-[#222222] font-playfair">Recent Campaigns</h3>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                <li className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#6D190D] truncate font-poppins">
                        Global Health Initiative
                      </p>
                      <p className="text-sm text-gray-600 font-poppins">
                        Active • ₹35,000 raised
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFD700] text-[#6D190D] font-poppins">
                      Active
                    </span>
                  </div>
                </li>
                <li className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#6D190D] truncate font-poppins">
                        Education for All
                      </p>
                      <p className="text-sm text-gray-600 font-poppins">
                        Active • ₹45,000 raised
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFD700] text-[#6D190D] font-poppins">
                      Active
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Recent Donations */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-[#222222] font-playfair">Recent Donations</h3>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                <li className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#222222] font-poppins">
                        John Smith
                      </p>
                      <p className="text-sm text-gray-600 font-poppins">
                        ₹250.00 • One-time donation
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFD700] text-[#6D190D] font-poppins">
                      Completed
                    </span>
                  </div>
                </li>
                <li className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#222222] font-poppins">
                        Sarah Johnson
                      </p>
                      <p className="text-sm text-gray-600 font-poppins">
                        ₹100.00 • Monthly supporter
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFD700] text-[#6D190D] font-poppins">
                      Recurring
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-[#222222] mb-4 font-playfair">System Status</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-[#222222] font-poppins">Database</p>
                  <p className="text-sm text-gray-600 font-poppins">Connected</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-[#222222] font-poppins">Storage</p>
                  <p className="text-sm text-gray-600 font-poppins">Available</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-[#222222] font-poppins">API</p>
                  <p className="text-sm text-gray-600 font-poppins">Operational</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}