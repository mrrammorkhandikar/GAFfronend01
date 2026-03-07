// Site API Service for frontend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Log configuration on load (client-side only)
if (typeof window !== 'undefined') {
  console.log('SiteApiService Config:', {
    API_BASE_URL,
    NODE_ENV: process.env.NODE_ENV
  });
}

class SiteApiService {
  // Generic API call without authentication
  static async apiCall(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    // Debug: Log the full URL being called
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log(`[SiteApi] Requesting: ${fullUrl}`);

    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers
      })

      // Check if response is OK
      if (!response.ok) {
        console.error(`[SiteApi] Error ${response.status}: ${response.statusText}`);
        return {
          success: false,
          message: `HTTP error! status: ${response.status}`,
          status: response.status
        };
      }
      
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text(); 
        console.error('[SiteApi] Non-JSON response:', text.substring(0, 200));
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
      console.error('[SiteApi] Fetch error:', error)

      let message = 'Network error occurred'
      if (error.message.includes('Failed to fetch')) {
        message = 'Unable to connect to server. Check CORS configuration or if server is running.'
        console.warn('CORS Hint: Ensure NEXT_PUBLIC_API_URL matches the backend URL and the backend allows this origin.');
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
    return this.apiCall('/events')
  }

  static async getEvent(id) {
    return this.apiCall(`/events/${id}`)
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

  // Contact Messages
  static async getContactMessages(limit = 4) {
    return this.apiCall('/contact/public')
  }

  // Volunteer Submissions
  static async getVolunteerSubmissions(limit = 4) {
    return this.apiCall('/volunteer-submissions/public')
  }
}

export default SiteApiService
