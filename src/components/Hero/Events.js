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
        const response = await SiteApiService.getUpcomingEvents(2); // Fetch 2 events for the homepage
        console.log('Events API Response:', response); // Debug log
        
        console.log('=== Checking response structure ===');
        console.log('Response:', response);
        console.log('Response.success:', response.success);
        console.log('Response.data:', response.data);
        console.log('Response.data type:', typeof response.data);
        
        // Check if response.data has the nested structure
        const eventData = response.data && response.data.success && response.data.data ? response.data.data : response.data;
        console.log('Event data (extracted):', eventData);
        console.log('Is event data an array:', Array.isArray(eventData));
        
        if (response.success && eventData) {
          console.log('=== Processing events ===');
          console.log('Raw API Data:', eventData);
          console.log('Is Array:', Array.isArray(eventData));
          
          // Transform the event data to match the expected format for EventCard
          let transformedEvents = [];
          
          if (Array.isArray(eventData)) {
            console.log('=== Starting map function ===');
            transformedEvents = eventData.map((event, index) => {
              console.log(`=== Processing event ${index} ===`);
              console.log('Event data:', event);
              
              const isPast = event.eventDate ? new Date(event.eventDate) < new Date() : false;
              const transformedEvent = {
                id: event.id,
                slug: event.slug,
                imagePath: event.imageUrl || '/images/campains/helpforpoorfamilies.jpg',
                title: event.title,
                time: event.eventDate ? new Date(event.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD',
                location: event.location,
                description: event.description?.substring(0, 100) + '...' || 'Event description coming soon...',
                dateDay: event.eventDate ? new Date(event.eventDate).getDate() : '01',
                dateMonth: event.eventDate ? new Date(event.eventDate).toLocaleString('default', { month: 'short' }).toUpperCase() : 'JAN',
                registrationEnabled: isRegistrationEnabled(event.registrationEnabled),
                isPast,
              };
              
              console.log('Transformed event:', transformedEvent);
              return transformedEvent;
            });
            console.log('=== Map function completed ===');
          } else {
            console.log('=== eventData is not an array ===');
            console.log('eventData:', eventData);
          }
          
          console.log('Final transformed events:', transformedEvents);
          setEvents(transformedEvents);
        } else {
          console.error('Failed to fetch events:', response.message || 'No data returned');
          setError(response.message || 'Failed to load events');
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 justify-center">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 justify-center">
          {events.map((event) => (
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
