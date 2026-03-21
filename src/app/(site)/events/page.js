import SiteApiService from '@/app/services/site-api';
import { isRegistrationEnabled } from '@/lib/eventRegistration';
import EventsClient from './EventsClient';

export const metadata = {
  title: 'Events | Global Aid Foundation',
  description: 'Join us in our mission to create positive change. Participate in our events, workshops, and community outreach programs.',
};

export default async function EventsPage() {
  let transformedEvents = [];
  let error = null;

  try {
    const response = await SiteApiService.getAllEvents();
    if (response.success && response.data) {
      // Transform the event data to match the expected format
      transformedEvents = Array.isArray(response.data) ? response.data.map((event) => {
        let content = event.content;
        if (typeof content === 'string') {
          try {
            content = JSON.parse(content);
          } catch {
            content = {};
          }
        }
        return {
        id: event.id,
        slug: event.slug,
        imagePath: event.imageUrl || '/images/campains/helpforpoorfamilies.jpg',
        title: event.title,
        description: event.description,
        location: event.location,
        eventDate: event.eventDate,
        isActive: event.isActive,
        content: content || {},
        campaignId: event.campaignId,
        campaign: event.campaign,
        registrations: event.registrations || [],
        registrationEnabled: isRegistrationEnabled(event.registrationEnabled),
        registrationFee: event.registrationFee ?? 0,
        achievements: content?.keyAchievements || [],
        journey: content?.journey || [],
        time: event.eventDate ? new Date(event.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' onwards' : 'TBD',
        dateDay: event.eventDate ? new Date(event.eventDate).getDate() + 'th' : '01st',
        dateMonth: event.eventDate ? new Date(event.eventDate).toLocaleString('default', { month: 'short' }).toUpperCase() : 'JAN',
        formattedDate: event.eventDate ? new Date(event.eventDate).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) : 'Date TBD',
        isPast: event.eventDate ? new Date(event.eventDate) < new Date() : false,
        isUpcoming: event.eventDate ? new Date(event.eventDate) > new Date() : false,
        registrationCount: event.registrationCount ?? event.registrations?.length ?? 0
      };
      }).filter(event => event.isActive) : [];
    } else {
      error = response.message || 'Failed to fetch events';
    }
  } catch (err) {
    error = 'An error occurred while fetching events';
    console.error(err);
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return <EventsClient initialEvents={transformedEvents} />;
}
