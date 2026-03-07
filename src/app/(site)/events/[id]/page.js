'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Target,
  ArrowLeft,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import SiteApiService from '@/app/services/site-api';

const EventDetails = ({ params }) => {
  const [event, setEvent] = useState(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    number: '',
    email: '',
  });
  const [showThankYou, setShowThankYou] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const resolvedParams = await params;
        const id = resolvedParams?.id;
        if (!id) {
          throw new Error('Event ID is missing from parameters');
        }

        const response = await SiteApiService.getEvent(id);
        if (!response.success) {
          setError(response.message || 'Failed to load event');
          return;
        }

        let content = response.data.content;
        if (typeof content === 'string') {
          try {
            content = JSON.parse(content);
          } catch {
            content = {};
          }
        }

        const transformedEvent = {
          id: response.data.id,
          slug: response.data.slug,
          title: response.data.title,
          image: response.data.imageUrl || '/images/campains/helpforpoorfamilies.jpg',
          description: response.data.description,
          fullDescription:
            response.data.description ||
            response.data.details ||
            'Event details coming soon...',
          eventDate: response.data.eventDate,
          location: response.data.location,
          address: response.data.address,
          isActive: response.data.isActive,
          content: content,
          campaignId: response.data.campaignId,
          campaign: response.data.campaign,
          registrations: response.data.registrations || [],
          achievements: content?.keyAchievements || [],
          journey: content?.journey || [],
          speakers: content?.speakers || [],
          agenda: content?.agenda || [],
          formattedDate: response.data.eventDate
            ? new Date(response.data.eventDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : 'Date TBD',
          formattedTime: response.data.eventDate
            ? new Date(response.data.eventDate).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'Time TBD',
          isPast: response.data.eventDate
            ? new Date(response.data.eventDate) < new Date()
            : false,
          isUpcoming: response.data.eventDate
            ? new Date(response.data.eventDate) > new Date()
            : false,
          registrationCount: response.data.registrations?.length || 0,
          about: content?.about || [],
          status: response.data.isActive
            ? response.data.eventDate
              ? new Date(response.data.eventDate) < new Date()
                ? 'Completed'
                : 'Upcoming'
              : 'Active'
            : 'Inactive',
        };

        setEvent(transformedEvent);

        const stored = localStorage.getItem('registeredEvents') || '[]';
        const registeredEvents = JSON.parse(stored);
        setIsRegistered(registeredEvents.includes(transformedEvent.id));
      } catch (e) {
        setError(e.message || 'An error occurred while loading the event');
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6D190D] mx-auto mb-4" />
          <p className="text-gray-600 font-poppins">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-poppins">
            {error || 'Event not found'}
          </p>
          <Link
            href="/events"
            className="inline-flex items-center text-[#6D190D] mt-4 hover:underline font-poppins"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const relatedEvents = [
    {
      id: 3,
      title: 'Hygiene Education Workshop',
      image:
        '/images/campains/Sponsor_for_Hygienic_Living_Program/titleimage.jpg',
      date: 'November 22, 2024',
    },
    {
      id: 4,
      title: 'Youth Awareness Program',
      image: '/images/campains/Self_Medication_Drug_Abuse/titleImage.jpg',
      date: 'December 5, 2024',
    },
  ];

  const heroStatusClass = [
    'px-2 py-1 rounded-full text-sm font-semibold',
    event.status === 'Completed'
      ? 'bg-green-500 text-white'
      : event.status === 'Upcoming'
      ? 'bg-[#FFD700] text-[#6D190D]'
      : 'bg-gray-500 text-white',
    'font-poppins',
  ].join(' ');

  const sidebarStatusClass = [
    'inline-block px-3 py-1 rounded-full text-sm font-semibold',
    event.status === 'Completed'
      ? 'bg-green-100 text-green-800'
      : event.status === 'Upcoming'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-gray-100 text-gray-800',
    'font-poppins',
  ].join(' ');

  return (
    <div className="min-h-screen bg-[#fcf9e3]">
      {showThankYou && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm border border-[#f3e1a5] shadow-xl">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h3 className="text-2xl font-bold text-[#222222] mb-2 font-playfair">
              Thank You!
            </h3>
            <p className="text-gray-600 mb-6 font-poppins">
              Your registration has been submitted successfully. We will contact
              you shortly with further details.
            </p>
            <button
              type="button"
              onClick={() => setShowThankYou(false)}
              className="bg-[#6D190D] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8B2317] transition-colors font-poppins"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
            <Link
              href="/events"
              className="inline-flex items-center text-xs md:text-sm mb-4 px-3 py-1 rounded-full bg-white/90 text-[#6D190D] font-poppins shadow-sm hover:bg-white"
            >
              <ArrowLeft className="mr-2" size={16} />
              Back to Events
            </Link>
            <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 font-playfair max-w-3xl">
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-xs md:text-sm font-poppins">
              <div className="flex items-center">
                <Calendar className="mr-2" size={16} />
                {event.formattedDate}
              </div>
              <div className="flex items-center">
                <Clock className="mr-2" size={16} />
                {event.formattedTime}
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2" size={16} />
                {event.location}
              </div>
            </div>
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full font-semibold">
              <span className={heroStatusClass}>{event.status}</span>
              {event.registrationCount > 0 && (
                <span className="ml-2 text-sm font-poppins">
                  • {event.registrationCount} registered
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Event Content */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Event Description */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
                  <h2 className="text-2xl font-bold text-[#222222] mb-6 font-playfair">
                    About This Event
                  </h2>
                  <div className="prose max-w-none font-poppins text-gray-700">
                    {event.about && event.about.length > 0 ? (
                      event.about.map((paragraph, index) => (
                        <p key={index} className="mb-4">
                          {paragraph}
                        </p>
                      ))
                    ) : (
                      <p>{event.fullDescription}</p>
                    )}
                  </div>
                </div>

                {/* Event Journey */}
                {event.journey && event.journey.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
                    <h2 className="text-2xl font-bold text-[#222222] mb-6 font-playfair">
                      Event Journey
                    </h2>
                    <div className="space-y-8">
                      {event.journey.map((step, index) => (
                        <div key={index} className="flex items-start">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#FFD700] flex items-center justify-center text-xl mr-4 mt-1">
                            {step.icon || '📊'}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-[#222222] mb-2 font-playfair">
                              {step.title}
                            </h3>
                            <p className="text-gray-700 mb-4 font-poppins">
                              {step.description}
                            </p>
                            {step.imageUrl && (
                              <div className="aspect-video overflow-hidden rounded-lg">
                                <img
                                  src={step.imageUrl}
                                  alt={step.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Achievements */}
                {event.achievements && event.achievements.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
                    <h2 className="text-2xl font-bold text-[#222222] mb-6 font-playfair">
                      Key Achievements
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {event.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="text-[#FFD700] mr-3 mt-1" size={20} />
                          <p className="text-gray-700 font-poppins">
                            {achievement}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Speakers */}
                {event.speakers && event.speakers.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
                    <h2 className="text-2xl font-bold text-[#222222] mb-6 font-playfair">
                      Speakers & Organizers
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {event.speakers.map((speaker, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-[#fcf9e3] rounded-lg border border-[#FFD700]/20">
                          <div className="w-12 h-12 bg-[#6D190D] rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-lg">{speaker.name?.charAt(0) || '?'}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-[#222222] font-poppins">{speaker.name}</div>
                            {speaker.role && <div className="text-sm text-gray-600 font-poppins">{speaker.role}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Agenda */}
                {event.agenda && event.agenda.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-2xl font-bold text-[#222222] mb-6 font-playfair">
                      Event Schedule
                    </h2>
                    <div className="space-y-4">
                      {event.agenda.map((item, index) => (
                        <div key={index} className="flex gap-4 items-start">
                          {item.time && (
                            <div className="flex-shrink-0 bg-[#6D190D] text-white px-3 py-1 rounded-lg text-sm font-semibold font-poppins min-w-[90px] text-center">
                              {item.time}
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="font-semibold text-[#222222] font-poppins">{item.title}</div>
                            {item.description && <div className="text-sm text-gray-600 font-poppins mt-1">{item.description}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 lg:sticky lg:top-8 space-y-8">
                {/* Event Details Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                  <h3 className="text-xl font-bold text-[#222222] mb-6 font-playfair">
                    Event Details
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-start">
                      <Calendar className="text-[#6D190D] mr-3 mt-1" size={20} />
                      <div>
                        <div className="font-semibold text-[#222222] font-poppins">
                          Date
                        </div>
                        <div className="text-gray-600 font-poppins">
                          {event.formattedDate}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Clock className="text-[#6D190D] mr-3 mt-1" size={20} />
                      <div>
                        <div className="font-semibold text-[#222222] font-poppins">
                          Time
                        </div>
                        <div className="text-gray-600 font-poppins">
                          {event.formattedTime}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="text-[#6D190D] mr-3 mt-1" size={20} />
                      <div>
                        <div className="font-semibold text-[#222222] font-poppins">
                          Location
                        </div>
                        <div className="text-gray-600 font-poppins">
                          {event.location}
                        </div>
                        {event.address && (
                          <div className="text-sm text-gray-500 mt-1 font-poppins">
                            {event.address}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Users className="text-[#6D190D] mr-3" size={20} />
                      <div>
                        <div className="font-semibold text-[#222222] font-poppins">
                          Participants
                        </div>
                        <div className="text-gray-600 font-poppins">
                          {event.registrationCount} registered
                        </div>
                      </div>
                    </div>

                    {event.campaign && (
                      <div className="flex items-center">
                        <Target className="text-[#6D190D] mr-3" size={20} />
                        <div>
                          <div className="font-semibold text-[#222222] font-poppins">
                            Campaign
                          </div>
                          <div className="text-gray-600 font-poppins">
                            {event.campaign.title}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center">
                      <TrendingUp className="text-[#6D190D] mr-3" size={20} />
                      <div>
                        <div className="font-semibold text-[#222222] font-poppins">
                          Status
                        </div>
                        <div className={sidebarStatusClass}>{event.status}</div>
                      </div>
                    </div>
                  </div>

                  {event.isUpcoming && (
                    <div className="space-y-4">
                      <button
                        type="button"
                        onClick={() => !isRegistered && setShowRegistrationModal(true)}
                        disabled={isRegistered}
                        className={[
                          'w-full text-white py-3 rounded-lg font-semibold transition-colors font-poppins',
                          isRegistered
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#6D190D] hover:bg-[#8B2317]',
                        ].join(' ')}
                      >
                        {isRegistered ? 'Registered ✓' : 'Register Now'}
                      </button>

                      {showRegistrationModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                          <div className="bg-white rounded-xl p-6 w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-xl font-bold text-[#222222] font-playfair">
                                Event Registration
                              </h3>
                              <button
                                type="button"
                                onClick={() => setShowRegistrationModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                ✕
                              </button>
                            </div>

                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                const stored =
                                  localStorage.getItem('registeredEvents') || '[]';
                                const registeredEvents = JSON.parse(stored);
                                if (!registeredEvents.includes(event.id)) {
                                  registeredEvents.push(event.id);
                                  localStorage.setItem(
                                    'registeredEvents',
                                    JSON.stringify(registeredEvents),
                                  );
                                }
                                setShowRegistrationModal(false);
                                setShowThankYou(true);
                                setIsRegistered(true);
                                setRegistrationData({
                                  name: '',
                                  number: '',
                                  email: '',
                                });
                              }}
                            >
                              <div className="mb-4">
                                <label className="block text-gray-700 mb-2 font-poppins">
                                  Full Name *
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={registrationData.name}
                                  onChange={(e) =>
                                    setRegistrationData({
                                      ...registrationData,
                                      name: e.target.value,
                                    })
                                  }
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent font-poppins"
                                  placeholder="Enter your full name"
                                />
                              </div>

                              <div className="mb-4">
                                <label className="block text-gray-700 mb-2 font-poppins">
                                  Phone Number *
                                </label>
                                <input
                                  type="tel"
                                  required
                                  value={registrationData.number}
                                  onChange={(e) =>
                                    setRegistrationData({
                                      ...registrationData,
                                      number: e.target.value,
                                    })
                                  }
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent font-poppins"
                                  placeholder="Enter your phone number"
                                />
                              </div>

                              <div className="mb-6">
                                <label className="block text-gray-700 mb-2 font-poppins">
                                  Email Address *
                                </label>
                                <input
                                  type="email"
                                  required
                                  value={registrationData.email}
                                  onChange={(e) =>
                                    setRegistrationData({
                                      ...registrationData,
                                      email: e.target.value,
                                    })
                                  }
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent font-poppins"
                                  placeholder="Enter your email address"
                                />
                              </div>

                              <div className="flex gap-3">
                                <button
                                  type="submit"
                                  className="flex-1 bg-[#6D190D] text-white py-3 rounded-lg font-semibold hover:bg-[#8B2317] transition-colors font-poppins"
                                >
                                  Submit Registration
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setShowRegistrationModal(false)}
                                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors font-poppins"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {event.isPast && (
                    <div className="text-center p-4 bg-green-50 border border-green-200 rounded-xl">
                      <p className="text-green-700 font-semibold font-poppins">
                        Thank you for your participation!
                      </p>
                      <p className="text-green-600 text-sm font-poppins mt-1">
                        This event has been completed successfully.
                      </p>
                    </div>
                  )}
                </div>

                {/* Related Events */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-[#222222] mb-4 font-playfair">
                    Related Events
                  </h3>
                  <div className="space-y-4">
                    {relatedEvents.map((related) => (
                      <Link
                        key={related.id}
                        href={`/events/${related.id}`}
                        className="block group"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={related.image}
                            alt={related.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div>
                            <h4 className="font-semibold text-[#222222] group-hover:text-[#6D190D] transition-colors font-poppins">
                              {related.title}
                            </h4>
                            <p className="text-sm text-gray-600 font-poppins">
                              {related.date}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventDetails;

