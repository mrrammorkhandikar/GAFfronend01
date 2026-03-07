// Admin API Service for frontend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Log configuration on load (client-side only)
if (typeof window !== 'undefined') {
  console.log('AdminApiService Config:', {
    API_BASE_URL,
    NODE_ENV: process.env.NODE_ENV
  });
}

class AdminApiService {
  // Authentication
  static async adminLogin(credentials) {
    try {
      console.log(`[AdminApi] Login Request to: ${API_BASE_URL}/admin/login`);
      
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })
      
      // Check if response is OK
      if (!response.ok) {
        console.error(`[AdminApi] Login Error ${response.status}: ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('[AdminApi] Login Non-JSON response:', text.substring(0, 200));
        throw new Error('Received non-JSON response')
      }
      
      const data = await response.json()
      
      if (data.success) {
        // Store admin token in localStorage (in production, use secure cookies)
        if (typeof window !== 'undefined') {
          localStorage.setItem('adminToken', JSON.stringify({
            token: data.data.token || 'demo-token',
            adminId: data.data.id,
            email: data.data.email,
            expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
          }))
        }
      }
      
      return data
    } catch (error) {
      console.error('[AdminApi] Login error:', error)
      
      // Provide more specific error messages
      let message = 'Network error occurred'
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        message = 'Unable to connect to server. Check CORS configuration or if server is running.'
        console.warn('CORS Hint: Ensure NEXT_PUBLIC_API_URL matches the backend URL and the backend allows this origin.');
      } else if (error.message.includes('non-JSON')) {
        message = 'Server returned invalid response format'
      } else if (error.message.includes('HTTP error')) {
        message = `Server error: ${error.message}`
      }
      
      return {
        success: false,
        message
      }
    }
  }

  static async logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken')
    }
  }

  static isAdminAuthenticated() {
    if (typeof window === 'undefined') return false
    
    const tokenData = localStorage.getItem('adminToken')
    if (!tokenData) return false
    
    try {
      const parsed = JSON.parse(tokenData)
      return parsed.expiresAt > Date.now()
    } catch {
      return false
    }
  }

  static getAdminToken() {
    if (typeof window === 'undefined') return null
    
    const tokenData = localStorage.getItem('adminToken')
    if (!tokenData) return null
    
    try {
      const parsed = JSON.parse(tokenData)
      return parsed.expiresAt > Date.now() ? parsed.token : null
    } catch {
      return null
    }
  }

  // Generic API call with authentication
  static async apiCall(endpoint, options = {}) {
    const token = this.getAdminToken()
    
    // Do NOT set Content-Type for FormData — the browser sets it with the correct multipart boundary
    const isFormData = options.body instanceof FormData
    const headers = isFormData ? {} : {
      'Content-Type': 'application/json',
      ...options.headers
    }
    
    if (!isFormData && options.headers) {
      Object.assign(headers, options.headers)
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Debug: Log the full URL being called
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log(`[AdminApi] Requesting: ${fullUrl}`);
    
    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers
      })
      
      // Check if response is OK
      if (!response.ok) {
        console.error(`[AdminApi] Error ${response.status}: ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('[AdminApi] Non-JSON response:', text.substring(0, 200));
        throw new Error('Received non-JSON response')
      }
      
      return await response.json()
    } catch (error) {
      console.error('[AdminApi] Fetch error:', error)
      
      // Provide more specific error messages
      let message = 'Network error occurred'
      if (error.message.includes('Failed to fetch')) {
        message = 'Unable to connect to server. Check CORS configuration or if server is running.'
        console.warn('CORS Hint: Ensure NEXT_PUBLIC_API_URL matches the backend URL and the backend allows this origin.');
      } else if (error.message.includes('non-JSON')) {
        message = 'Server returned invalid response format'
      } else if (error.message.includes('HTTP error')) {
        message = `Server error: ${error.message}`
      }
      
      return {
        success: false,
        message,
        error: error.toString()
      }
    }
  }

  // Dashboard Stats
  static async getDashboardStats() {
    return this.apiCall('/admin/stats')
  }

  // Campaigns
  static async getCampaigns(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    return this.apiCall(`/campaigns?${queryParams}`)
  }

  static async getCampaign(id) {
    return this.apiCall(`/campaigns/${id}`)
  }

  static async createCampaign(formData) {
    return this.apiCall('/campaigns', {
      method: 'POST',
      body: formData
    })
  }

  static async updateCampaign(id, formData) {
    return this.apiCall(`/campaigns/${id}`, {
      method: 'PUT',
      body: formData
    })
  }

  static async deleteCampaign(id) {
    return this.apiCall(`/campaigns/${id}`, {
      method: 'DELETE'
    })
  }

  // Partners
  static async getPartners(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    return this.apiCall(`/partners?${queryParams}`)
  }

  static async getPartner(id) {
    return this.apiCall(`/partners/${id}`)
  }

  static async createPartner(formData) {
    return this.apiCall('/partners', {
      method: 'POST',
      body: formData
    })
  }

  static async updatePartner(id, formData) {
    return this.apiCall(`/partners/${id}`, {
      method: 'PUT',
      body: formData
    })
  }

  static async deletePartner(id) {
    return this.apiCall(`/partners/${id}`, {
      method: 'DELETE'
    })
  }

  // Events
  static async getEvents(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    return this.apiCall(`/events?${queryParams}`)
  }

  static async getEvent(id) {
    return this.apiCall(`/events/${id}`)
  }

  static async createEvent(formData) {
    return this.apiCall('/events', {
      method: 'POST',
      body: formData
    })
  }

  static async updateEvent(id, formData) {
    return this.apiCall(`/events/${id}`, {
      method: 'PUT',
      body: formData
    })
  }

  static async deleteEvent(id) {
    return this.apiCall(`/events/${id}`, {
      method: 'DELETE'
    })
  }

  // Event Registrations
  static async getEventRegistrations(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    return this.apiCall(`/event-registrations?${queryParams}`)
  }

  static async getEventRegistration(id) {
    return this.apiCall(`/event-registrations/${id}`)
  }

  static async createEventRegistration(data) {
    return this.apiCall('/event-registrations', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  static async deleteEventRegistration(id) {
    return this.apiCall(`/event-registrations/${id}`, {
      method: 'DELETE'
    })
  }

  // Volunteer Opportunities
  static async getVolunteerOpportunities(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    return this.apiCall(`/volunteer-opportunities?${queryParams}`)
  }

  static async getVolunteerOpportunity(id) {
    return this.apiCall(`/volunteer-opportunities/${id}`)
  }

  static async createVolunteerOpportunity(data) {
    return this.apiCall('/volunteer-opportunities', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  static async updateVolunteerOpportunity(id, data) {
    return this.apiCall(`/volunteer-opportunities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  static async deleteVolunteerOpportunity(id) {
    return this.apiCall(`/volunteer-opportunities/${id}`, {
      method: 'DELETE'
    })
  }

  static async getVolunteerSubmissions(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    return this.apiCall(`/volunteer-submissions?${queryParams}`)
  }

  // Careers
  static async getCareers(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    return this.apiCall(`/careers?${queryParams}`)
  }

  static async getCareer(id) {
    return this.apiCall(`/careers/${id}`)
  }

  static async createCareer(data) {
    return this.apiCall('/careers', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  static async updateCareer(id, data) {
    return this.apiCall(`/careers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  static async deleteCareer(id) {
    return this.apiCall(`/careers/${id}`, {
      method: 'DELETE'
    })
  }

  // Career Applications
  static async getCareerApplications(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    return this.apiCall(`/career-applications?${queryParams}`)
  }

  static async getCareerApplication(id) {
    return this.apiCall(`/career-applications/${id}`)
  }

  static async createCareerApplication(data) {
    return this.apiCall('/career-applications', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  static async deleteCareerApplication(id) {
    return this.apiCall(`/career-applications/${id}`, {
      method: 'DELETE'
    })
  }

  // Team Members
  static async getTeamMembers(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    return this.apiCall(`/team?${queryParams}`)
  }

  static async getTeamMember(id) {
    return this.apiCall(`/team/${id}`)
  }

  static async createTeamMember(formData) {
    return this.apiCall('/team', {
      method: 'POST',
      body: formData
    })
  }

  static async updateTeamMember(id, formData) {
    return this.apiCall(`/team/${id}`, {
      method: 'PUT',
      body: formData
    })
  }

  static async deleteTeamMember(id) {
    return this.apiCall(`/team/${id}`, {
      method: 'DELETE'
    })
  }

  // Donations
  static async getDonations(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    return this.apiCall(`/donations?${queryParams}`)
  }

  static async updateDonationStatus(id, status) {
    return this.apiCall(`/donations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    })
  }

  // Contact Forms
  static async getContactForms(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    return this.apiCall(`/contact?${queryParams}`)
  }

  static async getContactForm(id) {
    return this.apiCall(`/contact/${id}`)
  }

  static async updateContactStatus(id, status) {
    return this.apiCall(`/contact/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    })
  }
}

export default AdminApiService