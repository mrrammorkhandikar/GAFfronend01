export interface Campaign {
  id: string;
  title: string;
  slug: string;
  description: string;
  location?: string;
  amount: number;
  raisedAmount: number;
  imageUrl?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  content?: any;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  isOnline?: boolean;
  eventDate: string;
  imageUrl?: string;
  isActive: boolean;
  content?: any;
  registrations?: any[];
}

export interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  postedDate: string;
  isActive: boolean;
}

export interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  location: string;
  requirements?: string;
  benefits?: string;
  isActive: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  status?: number;
}
