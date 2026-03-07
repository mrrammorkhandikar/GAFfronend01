'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  HandHeart, 
  Briefcase, 
  UserPlus, 
  MessageCircle,
  CreditCard,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Bell,
  Settings
} from 'lucide-react'
import AdminApiService from '../services/admin-api'

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [adminInfo, setAdminInfo] = useState(null)
  const [openMenus, setOpenMenus] = useState({})
  const [notifications, setNotifications] = useState(0)
  const pathname = usePathname()
  const router = useRouter()

  // Memoized authentication check
  const checkAuth = useCallback(() => {
    const tokenData = localStorage.getItem('adminToken')
    if (!tokenData) {
      router.push('/admin/login')
      return false
    }

    try {
      const parsed = JSON.parse(tokenData)
      if (parsed.expiresAt > Date.now()) {
        setAdminInfo({
          email: parsed.email,
          id: parsed.adminId
        })
        return true
      } else {
        localStorage.removeItem('adminToken')
        router.push('/admin/login')
        return false
      }
    } catch (error) {
      localStorage.removeItem('adminToken')
      router.push('/admin/login')
      return false
    }
  }, [router])

  // Initialize auth on mount
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Fetch notifications (mock data for now)
  useEffect(() => {
    // In a real app, this would fetch actual notifications
    setNotifications(3)
  }, [])

  const toggleMenu = useCallback((menuName) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }))
  }, [])

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false)
  }, [])

  const handleLogout = useCallback(async () => {
    try {
      await AdminApiService.logout()
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Even if API fails, clear local storage and redirect
      localStorage.removeItem('adminToken')
      router.push('/admin/login')
    }
  }, [router])

  const isActive = useCallback((href, exact = false) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }, [pathname])

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      exact: true
    },
    {
      name: 'Campaigns',
      href: '/admin/campaigns',
      icon: HandHeart,
      submenu: [
        { name: 'All Campaigns', href: '/admin/campaigns' },
        { name: 'Create Campaign', href: '/admin/campaigns/create' }
      ]
    },
    {
      name: 'Events',
      href: '/admin/events',
      icon: Calendar,
      submenu: [
        { name: 'All Events', href: '/admin/events' },
        { name: 'Create Event', href: '/admin/events/create' },
        { name: 'Registrations', href: '/admin/events/registrations' }
      ]
    },
    {
      name: 'Volunteers',
      href: '/admin/volunteers',
      icon: UserPlus,
      submenu: [
        { name: 'Opportunities', href: '/admin/volunteers/opportunities' },
        { name: 'Applications', href: '/admin/volunteers/applications' }
      ]
    },
    {
      name: 'Careers',
      href: '/admin/careers',
      icon: Briefcase,
      submenu: [
        { name: 'Job Listings', href: '/admin/careers' },
        { name: 'Applications', href: '/admin/careers/applications' }
      ]
    },
    {
      name: 'Team',
      href: '/admin/team',
      icon: Users,
      submenu: [
        { name: 'Team Members', href: '/admin/team' },
        { name: 'Add Member', href: '/admin/team/create' }
      ]
    },
    {
      name: 'Partners',
      href: '/admin/partners',
      icon: Users,
      submenu: [
        { name: 'All Partners', href: '/admin/partners' },
        { name: 'Add Partner', href: '/admin/partners/create' }
      ]
    },
    {
      name: 'Donations',
      href: '/admin/donations',
      icon: CreditCard
    },
    {
      name: 'Contact Forms',
      href: '/admin/contacts',
      icon: MessageCircle
    }
  ]

  if (!adminInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0
        flex flex-col
      `}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-gradient-to-r from-[#6D190D] to-[#8B2317]">
          <div className="flex items-center">
            <HandHeart className="h-8 w-8 text-white" />
            <span className="ml-2 text-xl font-bold text-white font-playfair">GAF Admin</span>
          </div>
          <button 
            className="lg:hidden text-white hover:text-gray-200 transition-colors"
            onClick={closeSidebar}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isCurrent = isActive(item.href, item.exact)
              const hasSubmenu = item.submenu && item.submenu.length > 0
              const isMenuOpen = openMenus[item.name]

              return (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                      ${isCurrent 
                        ? 'bg-[#FFD700] text-[#6D190D] shadow-sm' 
                        : 'text-[#222222] hover:bg-[#fcf9e3] hover:text-[#6D190D]'
                      }
                      ${hasSubmenu ? 'justify-between' : ''}
                    `}
                    onClick={(e) => {
                      if (hasSubmenu) {
                        e.preventDefault()
                        toggleMenu(item.name)
                      } else {
                        closeSidebar()
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </div>
                    {hasSubmenu && (
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                    )}
                  </Link>

                  {/* Submenu */}
                  {hasSubmenu && isMenuOpen && (
                    <div className="ml-8 mt-1 space-y-1 animate-fadeIn">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`
                            block px-4 py-2 text-sm rounded-lg transition-colors duration-200
                            ${isActive(subItem.href)
                              ? 'bg-[#fcf9e3] text-[#6D190D] font-medium'
                              : 'text-gray-600 hover:bg-[#fcf9e3] hover:text-[#6D190D]'
                            }
                          `}
                          onClick={closeSidebar}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-gray-200 bg-[#fcf9e3]">
          <div className="flex items-center mb-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#222222] truncate font-poppins">
                {adminInfo.email}
              </p>
              <p className="text-xs text-gray-600 font-poppins">Administrator</p>
            </div>
          </div>
                  
          <div className="flex space-x-2">
            <button className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-[#222222] bg-white rounded-lg border border-[#6D190D] hover:bg-[#fcf9e3] transition-colors font-poppins">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm text-[#6D190D] bg-white rounded-lg border border-[#6D190D] hover:bg-[#6D190D] hover:text-white transition-colors font-poppins"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top navigation bar */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
                      
              <div className="hidden sm:block ml-4">
                <h1 className="text-lg font-semibold text-[#222222] font-playfair">
                  {menuItems.find(item => isActive(item.href, item.exact) || 
                    (item.submenu && item.submenu.some(sub => isActive(sub.href))))?.name || 'Dashboard'}
                </h1>
              </div>
            </div>
        
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                )}
              </button>
        
              {/* User menu */}
              <div className="flex items-center">
                <span className="hidden md:inline text-sm text-gray-700 mr-3 font-poppins">
                  Welcome, <span className="font-medium">{adminInfo.email.split('@')[0]}</span>
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto py-6">
          <div className="px-4 sm:px-6 lg:px-8 pb-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}