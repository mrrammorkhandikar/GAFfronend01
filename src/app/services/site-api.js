// Site API Service for frontend
import { getApiBaseUrl } from '@/lib/api-base'

const isDev = process.env.NODE_ENV === 'development'

// Log configuration on load (client-side only)
if (typeof window !== 'undefined' && isDev) {
  console.log('SiteApiService Config:', {
    API_BASE_URL: getApiBaseUrl(),
    NODE_ENV: process.env.NODE_ENV
  })
}

function warnSiteApi (...args) {
  if (isDev) console.warn('[SiteApi]', ...args)
}

class SiteApiService {
  // Generic API call without authentication
  static async apiCall(endpoint, options = {}) {
    // Do NOT set Content-Type for FormData — the browser sets it with the correct multipart boundary
    const isFormData = options.body instanceof FormData
    const headers = isFormData
      ? { ...options.headers }
      : {
          'Content-Type': 'application/json',
          ...options.headers
        }

    const fullUrl = `${getApiBaseUrl()}${endpoint}`
    if (isDev) console.log(`[SiteApi] Requesting: ${fullUrl}`)

    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers
      })

      if (!response.ok) {
        let message = `HTTP error! status: ${response.status}`
        let errors
        const text = await response.text()
        if (text) {
          try {
            const errBody = JSON.parse(text)
            if (errBody?.message) message = errBody.message
            if (Array.isArray(errBody?.errors) && errBody.errors.length > 0) {
              errors = errBody.errors
              const msgs = errBody.errors.map((e) => e.msg || e.message).filter(Boolean)
              if (msgs.length) message = msgs.join('; ')
            }
          } catch {
            const snippet = text.slice(0, 200).replace(/\s+/g, ' ')
            if (snippet) message = `${message} — ${snippet}`
          }
        }
        warnSiteApi(`${response.status} ${response.statusText}`, fullUrl, message)
        return {
          success: false,
          message,
          status: response.status,
          errors
        }
      }

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        warnSiteApi('Non-JSON response', fullUrl, text.substring(0, 200))
        return {
          success: false,
          message: 'Server returned non-JSON response',
          status: response.status
        };
      }
      
      const data = await response.json();
      
      // If the backend response already follows the { success, data } pattern
      if (data && typeof data === 'object' && 'success' in data) {
        return data;
      }
                
      return {
        success: true,
        data: data
      };
    } catch (error) {
      warnSiteApi('Fetch error:', fullUrl, error)

      let message = 'Network error occurred'
      if (error.message.includes('Failed to fetch')) {
        message = 'Unable to connect to server. Check CORS configuration or if server is running.'
        warnSiteApi('Hint: NEXT_PUBLIC_API_URL must match the backend URL; backend CORS must allow this origin.')
      }

      return {
        success: false,
        message,
        error: error.toString()
      }
    }
  }

  // Public Campaigns
  static async getActiveCampaigns(limit = 4) {
    return this.apiCall('/campaigns/public')
  }

  static async getAllCampaigns() {
    return this.apiCall('/campaigns')
  }

  static async getCampaign(id) {
    return this.apiCall(`/campaigns/${id}`)
  }

  // Public Events
  static async getUpcomingEvents(limit = 4) {
    return this.apiCall('/events/public')
  }

  static async getAllEvents() {
    return this.apiCall('/events?limit=200')
  }

  static async getEvent(id) {
    return this.apiCall(`/events/${id}`)
  }

  /** Public event registration (pending until admin approves) */
  static async submitEventRegistration(payload) {
    return this.apiCall('/event-registrations/submit', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  // Team Members
  static async getActiveTeamMembers(limit = 4) {
    return this.apiCall('/team/public')
  }

  static async getAllTeamMembers() {
    return this.apiCall('/team')
  }

  static async getTeamMember(id) {
    return this.apiCall(`/team/${id}`)
  }

  // Partners
  static async getAllPartners() {
    return this.apiCall('/partners/public/list/all')
  }

  static async getPartnerBySlug(slug) {
    return this.apiCall(`/partners/public/${slug}`)
  }

  // Careers
  static async getActiveCareers(limit = 4) {
    return this.apiCall('/careers/public')
  }

  static async getAllCareers() {
    return this.apiCall('/careers')
  }

  static async getCareer(id) {
    return this.apiCall(`/careers/${id}`)
  }

  // Volunteer Opportunities
  static async getActiveVolunteerOpportunities(limit = 4) {
    return this.apiCall('/volunteer-opportunities/public')
  }

  static async getAllVolunteerOpportunities() {
    return this.apiCall('/volunteer-opportunities')
  }

  // Contact form (public submit)
  static async submitContactForm(data) {
    return this.apiCall('/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        subject: data.subject || 'No subject',
        message: data.message
      })
    })
  }

  // Contact Messages (admin/list)
  static async getContactMessages(limit = 4) {
    return this.apiCall('/contact/public')
  }

  // Volunteer Submissions
  static async getVolunteerSubmissions(limit = 4) {
    return this.apiCall('/volunteer-submissions/public')
  }

  // Hero Slider (homepage)
  static async getHeroSlides() {
    return this.apiCall('/public/hero-slides')
  }

  /** Active campaigns for donate form (public) */
  static async getPublicCampaignsList() {
    return this.apiCall('/public/campaigns')
  }

  /** UPI / bank display for donate modal */
  static async getDonationPaymentInfo() {
    return this.apiCall('/public/donation-payment-info')
  }

  /** Submit donation after user completes payment (pending until admin approves) */
  static async submitDonation(payload) {
    return this.apiCall('/donations/submit', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }
}

export default SiteApiService
