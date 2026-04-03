'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
  Image as ImageIcon
} from 'lucide-react'
import AdminApiService from '../services/admin-api'

function formatTimeAgo(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const diff = Date.now() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 48) return `${hrs}h ago`
  return d.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })
}

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [adminInfo, setAdminInfo] = useState(null)
  const [openMenus, setOpenMenus] = useState({})
  const [activityOpen, setActivityOpen] = useState(false)
  const [activityItems, setActivityItems] = useState([])
  const [activityLoading, setActivityLoading] = useState(false)
  const [activityHours] = useState(48)
  const notifPanelRef = useRef(null)
  const pathname = usePathname()
  const router = useRouter()

  const activityCount = activityItems.length

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

  const loadRecentActivity = useCallback(async () => {
    if (!adminInfo) return
    setActivityLoading(true)
    try {
      const res = await AdminApiService.getAdminRecentActivity(activityHours)
      if (res.success && res.data?.items) {
        setActivityItems(res.data.items)
      } else {
        setActivityItems([])
      }
    } catch (e) {
      console.error('Recent activity fetch failed:', e)
      setActivityItems([])
    } finally {
      setActivityLoading(false)
    }
  }, [adminInfo, activityHours])

  useEffect(() => {
    loadRecentActivity()
  }, [loadRecentActivity, pathname])

  useEffect(() => {
    if (!activityOpen) return
    const onDoc = (e) => {
      if (notifPanelRef.current && !notifPanelRef.current.contains(e.target)) {
        setActivityOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [activityOpen])

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
      name: 'Hero Slider',
      href: '/admin/hero-slides',
      icon: ImageIcon,
      submenu: [
        { name: 'All Slides', href: '/admin/hero-slides' },
        { name: 'Add Slide', href: '/admin/hero-slides/create' }
      ]
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
                  
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-[#6D190D] bg-white rounded-lg border border-[#6D190D] hover:bg-[#6D190D] hover:text-white transition-colors font-poppins"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
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
              <div className="relative" ref={notifPanelRef}>
                <button
                  type="button"
                  aria-expanded={activityOpen}
                  aria-haspopup="true"
                  aria-label="Notifications — donations and registrations (last 48 hours)"
                  onClick={() => {
                    setActivityOpen((o) => !o)
                    if (!activityOpen) loadRecentActivity()
                  }}
                  className="relative p-2 text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {activityCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-[#6D190D] text-[10px] font-bold text-white ring-2 ring-white">
                      {activityCount > 99 ? '99+' : activityCount}
                    </span>
                  )}
                </button>

                {activityOpen && (
                  <div className="absolute right-0 mt-2 w-[min(100vw-2rem,22rem)] max-h-[min(24rem,70vh)] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl z-[60] flex flex-col">
                    <div className="px-3 py-2 border-b border-gray-100 bg-[#fcf9e3]">
                      <p className="text-sm font-semibold text-[#222222] font-playfair">Recent activity</p>
                      <p className="text-xs text-gray-600 font-poppins">
                        Donations &amp; event registrations · last {activityHours}h
                      </p>
                    </div>
                    <div className="overflow-y-auto flex-1">
                      {activityLoading ? (
                        <p className="px-3 py-6 text-sm text-gray-500 text-center font-poppins">Loading…</p>
                      ) : activityItems.length === 0 ? (
                        <p className="px-3 py-6 text-sm text-gray-500 text-center font-poppins">
                          No donations or registrations in the last {activityHours} hours.
                        </p>
                      ) : (
                        <ul className="divide-y divide-gray-100">
                          {activityItems.map((item) => (
                            <li key={`${item.kind}-${item.id}`}>
                              <Link
                                href={item.href}
                                onClick={() => setActivityOpen(false)}
                                className="block px-3 py-2.5 hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <span className="text-[10px] uppercase tracking-wide font-semibold text-[#6D190D] font-poppins shrink-0">
                                    {item.kind === 'donation' ? 'Donation' : 'Registration'}
                                  </span>
                                  <span className="text-[10px] text-gray-400 font-poppins whitespace-nowrap">
                                    {formatTimeAgo(item.createdAt)}
                                  </span>
                                </div>
                                <p className="text-sm font-medium text-gray-900 font-poppins mt-0.5 line-clamp-2">
                                  {item.headline}
                                </p>
                                <p className="text-xs text-gray-600 font-poppins mt-0.5 line-clamp-2">{item.detail}</p>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="border-t border-gray-100 px-2 py-1.5 flex gap-2 justify-end bg-gray-50">
                      <Link
                        href="/admin/donations"
                        onClick={() => setActivityOpen(false)}
                        className="text-xs font-medium text-[#6D190D] hover:underline px-2 py-1 font-poppins"
                      >
                        Donations
                      </Link>
                      <Link
                        href="/admin/events/registrations"
                        onClick={() => setActivityOpen(false)}
                        className="text-xs font-medium text-[#6D190D] hover:underline px-2 py-1 font-poppins"
                      >
                        Registrations
                      </Link>
                    </div>
                  </div>
                )}
              </div>
        
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