'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Calendar,
  HandHeart,
  Briefcase,
  CreditCard,
  MessageCircle,
  TrendingUp,
  TrendingDown,
  UserPlus
} from 'lucide-react'
import AdminLayout from './components/AdminLayout.js'
import AdminApiService from './services/admin-api.js'

function formatInr(n) {
  const x = Number(n)
  if (Number.isNaN(x)) return '₹0'
  return `₹${x.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    campaigns: 0,
    events: 0,
    volunteerOpportunities: 0,
    careers: 0,
    donations: 0,
    contactForms: 0
  })
  const [recentCampaigns, setRecentCampaigns] = useState([])
  const [recentDonations, setRecentDonations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      // Avoid hammering Prisma when DATABASE_URL uses connection_limit=1 (Supabase pooler / Vercel).
      const statsRes = await AdminApiService.getDashboardStats()
      const campRes = await AdminApiService.getCampaigns({ limit: 5, page: 1 })
      const donRes = await AdminApiService.getDonations({ limit: 5, page: 1 })

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data)
      }

      if (campRes.success && Array.isArray(campRes.data)) {
        setRecentCampaigns(campRes.data)
      } else {
        setRecentCampaigns([])
      }

      if (donRes.success && Array.isArray(donRes.data)) {
        setRecentDonations(donRes.data)
      } else {
        setRecentDonations([])
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
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

        {/* Recent Activity — live from API */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex items-center justify-between gap-4">
              <h3 className="text-lg font-medium text-[#222222] font-playfair">Recent Campaigns</h3>
              <Link
                href="/admin/campaigns"
                className="text-sm font-medium text-[#6D190D] hover:underline font-poppins shrink-0"
              >
                View all
              </Link>
            </div>
            <div className="border-t border-gray-200">
              {recentCampaigns.length === 0 ? (
                <p className="px-4 py-6 sm:px-6 text-sm text-gray-500 font-poppins">No campaigns found.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {recentCampaigns.map((c) => {
                    const raised = c.raisedAmount ?? 0
                    const goal = c.amount
                    const sub =
                      goal != null
                        ? `${formatInr(raised)} raised · goal ${formatInr(goal)}`
                        : `${formatInr(raised)} raised`
                    return (
                      <li key={c.id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <Link
                              href={`/admin/campaigns/${c.id}`}
                              className="text-sm font-medium text-[#6D190D] truncate font-poppins hover:underline block"
                            >
                              {c.title}
                            </Link>
                            <p className="text-sm text-gray-600 font-poppins truncate">{sub}</p>
                          </div>
                          <span
                            className={`inline-flex shrink-0 items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-poppins ${
                              c.isActive
                                ? 'bg-[#FFD700] text-[#6D190D]'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {c.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex items-center justify-between gap-4">
              <h3 className="text-lg font-medium text-[#222222] font-playfair">Recent Donations</h3>
              <Link
                href="/admin/donations"
                className="text-sm font-medium text-[#6D190D] hover:underline font-poppins shrink-0"
              >
                View all
              </Link>
            </div>
            <div className="border-t border-gray-200">
              {recentDonations.length === 0 ? (
                <p className="px-4 py-6 sm:px-6 text-sm text-gray-500 font-poppins">No donations yet.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {recentDonations.map((d) => {
                    const name = d.donorName || 'Anonymous'
                    const campaignBit = d.campaign?.title ? ` · ${d.campaign.title}` : ''
                    const status = (d.status || 'pending').toLowerCase()
                    const statusClass =
                      status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-700'
                    return (
                      <li key={d.id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-[#222222] truncate font-poppins">{name}</p>
                            <p className="text-sm text-gray-600 font-poppins truncate">
                              {formatInr(d.amount)} {d.currency || 'INR'}
                              {campaignBit}
                            </p>
                          </div>
                          <span
                            className={`inline-flex shrink-0 items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize font-poppins ${statusClass}`}
                          >
                            {status}
                          </span>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
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