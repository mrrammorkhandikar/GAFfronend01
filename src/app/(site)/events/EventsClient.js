'use client';

import { Calendar, MapPin, Users, Clock, TrendingUp, Target } from 'lucide-react';
import Link from 'next/link';

const EventsClient = ({ initialEvents }) => {

  if (initialEvents.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Events Found</h2>
          <p className="text-gray-600">There are currently no events available.</p>
          <Link href="/" className="inline-flex items-center text-[#6D190D] mt-4 hover:underline font-poppins">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 min-h-[320px] bg-cover bg-center" style={{ backgroundImage: "url('/images/campains/helpforpoorfamilies.jpg')" }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="font-poppins uppercase text-sm font-semibold tracking-widest text-[#FFD700] mb-2">
              Get Involved
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 font-playfair">
              Upcoming Events & Activities
            </h1>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto font-poppins">
              Join us in our mission to create positive change. Participate in our events, 
              workshops, and community outreach programs.
            </p>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {initialEvents.length > 0 ? (
              initialEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    {/* Event Image & Date */}
                    <div className="lg:col-span-4 relative h-64 lg:h-auto">
                      <img 
                        src={event.imagePath} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg text-center min-w-[80px]">
                        <span className="block text-3xl font-black text-[#6D190D] font-playfair">{event.dateDay}</span>
                        <span className="block text-sm font-bold text-[#D4A71C] tracking-wider font-poppins">{event.dateMonth}</span>
                      </div>
                      <div className="absolute bottom-4 left-4 bg-[#6D190D] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-poppins">
                        {event.isUpcoming ? 'Upcoming' : 'Completed'}
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="lg:col-span-8 p-8 lg:p-10 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4 font-poppins">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-[#D4A71C]" />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-[#D4A71C]" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-[#D4A71C]" />
                            {event.registrationCount} Registered
                          </div>
                        </div>

                        <h3 className="text-2xl md:text-3xl font-bold text-[#222222] mb-4 font-playfair group-hover:text-[#6D190D] transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 mb-6 leading-relaxed font-poppins">
                          {event.description}
                        </p>

                        {/* Key Highlights/Achievements */}
                        {event.achievements && event.achievements.length > 0 && (
                          <div className="mb-8 bg-[#fcf9e3] p-6 rounded-xl border border-[#D4A71C]/20">
                            <h4 className="flex items-center gap-2 font-bold text-[#6D190D] mb-3 font-playfair">
                              <Target className="w-5 h-5" />
                              Key Highlights
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {event.achievements.map((item, index) => (
                                <div key={index} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4A71C] mt-2"></div>
                                  <span className="text-sm text-gray-700 font-poppins">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                        <Link 
                          href={`/events/${event.id}`}
                          className="px-8 py-3 bg-[#6D190D] text-white rounded-lg font-semibold hover:bg-[#5a140a] transition-colors shadow-lg shadow-[#6D190D]/20 font-poppins"
                        >
                          View Details
                        </Link>
                        {event.isUpcoming && (
                          <Link 
                            href={`/events/${event.id}/register`}
                            className="px-8 py-3 bg-white border-2 border-[#6D190D] text-[#6D190D] rounded-lg font-semibold hover:bg-gray-50 transition-colors font-poppins"
                          >
                            Register Now
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-playfair">No events found</h3>
                <p className="text-gray-500 font-poppins">Check back later for updates.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div
          className="max-w-6xl mx-auto rounded-3xl overflow-hidden bg-center bg-cover relative"
          style={{ backgroundImage: "url('/images/team/Volunteers/volunteer-form-bg.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/60 pointer-events-none" />
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 p-10 md:p-14 text-white">
            <div>
              <p className="font-poppins uppercase text-xs tracking-[0.25em] mb-3 text-[#FFD700]">
                Stay Connected
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-playfair">
                Want to Host or Sponsor an Event?
              </h2>
              <p className="text-sm md:text-base text-gray-100 max-w-md font-poppins">
                Whether you'd like to organise a community event, volunteer at an upcoming program, or sponsor our outreach activities, we'd love to hear from you.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start md:items-center md:justify-end gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#FFD700] text-[#222222] font-semibold font-poppins shadow-lg hover:bg-[#f5c700] transition-colors"
              >
                Get in Touch
              </Link>
              <Link
                href="/careers"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full border-2 border-white text-white font-semibold font-poppins hover:bg-white hover:text-[#222222] transition-colors"
              >
                Volunteer With Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsClient;
