'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import EventCard from './EventCard';
import SiteApiService from '@/app/services/site-api';
import { isRegistrationEnabled } from '@/lib/eventRegistration';

// Sample Data for two identical cards as shown in the image
const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await SiteApiService.getUpcomingEvents(2);

        const eventData =
          response.data && response.data.success && response.data.data
            ? response.data.data
            : response.data;

        if (response.success && Array.isArray(eventData)) {
          const now = Date.now();
          const transformedEvents = eventData.map((event) => {
            const ts = event.eventDate ? new Date(event.eventDate).getTime() : 0;
            const isPast = ts > 0 ? ts < now : false;
            const desc = (event.description || '').trim();
            return {
              id: event.id,
              slug: event.slug,
              imagePath: event.imageUrl || '/images/campains/helpforpoorfamilies.jpg',
              title: event.title,
              time: event.eventDate
                ? new Date(event.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'TBD',
              location: event.location,
              isOnline: Boolean(event.isOnline),
              description:
                desc.length > 100 ? `${desc.slice(0, 100)}...` : desc || 'Event description coming soon...',
              dateDay: event.eventDate ? String(new Date(event.eventDate).getDate()) : '01',
              dateMonth: event.eventDate
                ? new Date(event.eventDate).toLocaleString('default', { month: 'short' }).toUpperCase()
                : 'JAN',
              registrationEnabled: isRegistrationEnabled(event.registrationEnabled),
              isPast,
              _ts: ts,
            };
          });
          // Upcoming/ongoing first, then completed (past)
          const upcoming = transformedEvents
            .filter((e) => !e.isPast)
            .sort((a, b) => (a._ts || 0) - (b._ts || 0));
          const completed = transformedEvents
            .filter((e) => e.isPast)
            .sort((a, b) => (b._ts || 0) - (a._ts || 0));

          setEvents([...upcoming, ...completed].map(({ _ts, ...rest }) => rest));
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[Events]', response.message || 'No data returned', response);
          }
          setError(
            response.message ||
              'Could not load events from the server. If you use a deployed API, check backend DATABASE_URL on Vercel.'
          );
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('An error occurred while fetching events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Styles for the Playfair Display font (used until Tailwind config is fully working)
  const playfairStyle = { fontFamily: "'Playfair Display', serif" };
  
  if (loading) {
    return (
      <section className="py-20 md:py-32 bg-[#fcf9e3] font-poppins"> 
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="uppercase text-sm font-semibold tracking-widest text-[#D4A71C] mb-2">
              Loading Events...
            </p>
            <h2 
              className="text-4xl md:text-5xl font-black text-gray-800 leading-tight"
              style={playfairStyle}
            >
              Loading Events...
            </h2>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-center">
            {[1, 2].map((item) => (
              <div key={item} className="animate-pulse flex flex-col space-y-4">
                <div className="h-64 bg-gray-200 rounded-xl"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>

          {/* View More Button */}
          <div className="text-center mt-16">
            <Link href="/events" className="inline-block py-3 px-8 text-sm font-semibold uppercase tracking-wider rounded-md text-gray-800 bg-[#FFD700] transition-colors duration-200 hover:bg-[#E6C300] shadow-md hover:shadow-lg">
              View More
            </Link>
          </div>
        </div>
      </section>
    );
  }
  
  if (error || events.length === 0) {
    return (
      <section className="py-20 md:py-32 bg-[#fcf9e3] font-poppins"> 
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="uppercase text-sm font-semibold tracking-widest text-[#D4A71C] mb-2">
              Upcoming Events
            </p>
            <h2 
              className="text-4xl md:text-5xl font-black text-gray-800 leading-tight"
              style={playfairStyle}
            >
              Come To Our Events For More Info
            </h2>
          </div>

          <div className="text-center py-12">
            <p className="text-gray-600 font-poppins">
              {error || 'No events available at the moment. Please check back later or visit our events page.'}
            </p>
          </div>

          {/* View More Button */}
          <div className="text-center mt-16">
            <Link href="/events" className="inline-block py-3 px-8 text-sm font-semibold uppercase tracking-wider rounded-md text-gray-800 bg-[#FFD700] transition-colors duration-200 hover:bg-[#E6C300] shadow-md hover:shadow-lg">
              View More
            </Link>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    // Section Container: Uses the light yellow background from the image
    <section className="py-20 md:py-32 bg-[#fcf9e3] font-poppins"> 
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="uppercase text-sm font-semibold tracking-widest text-[#D4A71C] mb-2">
            Upcoming Events
          </p>
          <h2 
            className="text-4xl md:text-5xl font-black text-gray-800 leading-tight"
            style={playfairStyle}
          >
            Come To Our Events For More Info
          </h2>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-center">
          {events.slice(0, 2).map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-16">
          <Link
            href="/events"
            className="inline-block py-3 px-8 text-sm font-semibold uppercase tracking-wider rounded-md text-gray-800 bg-[#FFD700] transition-colors duration-200 hover:bg-[#E6C300] shadow-md hover:shadow-lg"
          >
            View More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Events;
