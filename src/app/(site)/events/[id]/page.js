'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Globe,
  Clock,
  Users,
  Target,
  ArrowLeft,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import SiteApiService from '@/app/services/site-api';
import AboutBlocksDisplay from '@/components/AboutBlocksDisplay';
import { aboutBlocksHaveContent } from '@/lib/aboutBlocks';
import { isRegistrationEnabled } from '@/lib/eventRegistration';

function locationLooksLikeUrl(text) {
  if (!text || typeof text !== 'string') return false;
  return /^https?:\/\//i.test(text.trim());
}

const EventDetails = ({ params }) => {
  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareStatus, setShareStatus] = useState(null);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const resolvedParams = typeof params?.then === 'function' ? await params : params;
        const idOrSlug = resolvedParams?.id ?? resolvedParams?.slug;
        if (!idOrSlug) {
          throw new Error('Event identifier is missing from parameters');
        }

        const response = await SiteApiService.getEvent(idOrSlug);
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
            response.data.description || response.data.details || '',
          eventDate: response.data.eventDate,
          location: response.data.location,
          isOnline: Boolean(response.data.isOnline),
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
          registrationEnabled: isRegistrationEnabled(response.data.registrationEnabled),
          registrationFee: response.data.registrationFee ?? 0,
          registrationCount:
            response.data.registrationCount ?? response.data.registrations?.length ?? 0,
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

        const listRes = await SiteApiService.getAllEvents();
        if (listRes.success && Array.isArray(listRes.data)) {
          const now = Date.now();
          const others = listRes.data.filter(
            (e) => e.id !== transformedEvent.id && e.isActive !== false
          );
          const sameCampaign =
            transformedEvent.campaignId &&
            others.filter((e) => e.campaignId === transformedEvent.campaignId);
          const pool =
            sameCampaign && sameCampaign.length > 0 ? sameCampaign : others;
          const mapped = [...pool]
            .sort((a, b) => {
              const at = a.eventDate ? new Date(a.eventDate).getTime() : 0
              const bt = b.eventDate ? new Date(b.eventDate).getTime() : 0
              const aPast = at > 0 ? at < now : false
              const bPast = bt > 0 ? bt < now : false
              // upcoming/ongoing first
              if (aPast !== bPast) return aPast ? 1 : -1
              // within upcoming: soonest first; within past: latest first
              return aPast ? bt - at : at - bt
            })
            .slice(0, 5)
            .map((e) => ({
              id: e.id,
              slug: e.slug,
              title: e.title,
              image: e.imageUrl || '/images/campains/helpforpoorfamilies.jpg',
              date: e.eventDate
                ? new Date(e.eventDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : '',
            }));
          setRelatedEvents(mapped);
        } else {
          setRelatedEvents([]);
        }
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

  const handleShare = async () => {
    try {
      const url = typeof window !== 'undefined' ? window.location.href : '';
      const title = event?.title ? `Event: ${event.title}` : 'Event';

      setShareStatus(null);

      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        await navigator.share({ title, url });
        return;
      }

      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setShareStatus('Link copied!');
        return;
      }

      window.prompt('Copy this link:', url);
    } catch (e) {
      console.error('Share failed:', e);
      setShareStatus('Could not share. Please copy the link.');
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9e3]">
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
                {event.isOnline ? (
                  <Globe className="mr-2 flex-shrink-0" size={16} />
                ) : (
                  <MapPin className="mr-2 flex-shrink-0" size={16} />
                )}
                {event.isOnline && locationLooksLikeUrl(event.location) ? (
                  <a
                    href={event.location.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-white/90 break-all"
                  >
                    Join online
                  </a>
                ) : (
                  <span>
                    {event.isOnline && <span className="font-semibold">Online · </span>}
                    {event.location}
                  </span>
                )}
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
                    {aboutBlocksHaveContent(event.about) ? (
                      <AboutBlocksDisplay
                        about={event.about}
                        paragraphClassName="mb-4 last:mb-0"
                        listClassName="list-disc pl-6 mb-4 space-y-2 last:mb-0"
                      />
                    ) : event.fullDescription ? (
                      <p>{event.fullDescription}</p>
                    ) : null}
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
                      {event.isOnline ? (
                        <Globe className="text-[#6D190D] mr-3 mt-1 flex-shrink-0" size={20} />
                      ) : (
                        <MapPin className="text-[#6D190D] mr-3 mt-1 flex-shrink-0" size={20} />
                      )}
                      <div>
                        <div className="font-semibold text-[#222222] font-poppins">
                          {event.isOnline ? 'Online' : 'Location'}
                        </div>
                        <div className="text-gray-600 font-poppins break-words">
                          {event.isOnline && locationLooksLikeUrl(event.location) ? (
                            <a
                              href={event.location.trim()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#6D190D] hover:underline"
                            >
                              Open meeting link
                            </a>
                          ) : (
                            event.location
                          )}
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

                  {!event.isPast && event.registrationEnabled && (
                    <div className="space-y-4">
                      <Link
                        href={`/events/register?event=${encodeURIComponent(event.slug || event.id)}`}
                        className="block w-full text-center text-white py-3 rounded-lg font-semibold transition-colors font-poppins bg-[#6D190D] hover:bg-[#8B2317]"
                      >
                        Register for event
                      </Link>
                      {Number(event.registrationFee) > 0 && (
                        <p className="text-xs text-gray-500 text-center font-poppins">
                          Registration fee: ₹{Number(event.registrationFee).toLocaleString('en-IN')}
                        </p>
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

                  <button
                    type="button"
                    onClick={handleShare}
                    className="w-full border-2 border-[#6D190D] text-[#6D190D] py-3 rounded-lg font-semibold hover:bg-[#6D190D] hover:text-white transition-colors font-poppins mt-6"
                  >
                    Share Event
                  </button>
                  {shareStatus && (
                    <p className="mt-3 text-sm text-gray-600 font-poppins text-center">{shareStatus}</p>
                  )}
                </div>

                {/* Other events (API — same campaign when possible) */}
                {relatedEvents.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-xl font-bold text-[#222222] mb-4 font-playfair">
                      More events
                    </h3>
                    <div className="space-y-4">
                      {relatedEvents.map((related) => (
                        <Link
                          key={related.id}
                          href={`/events/${related.slug || related.id}`}
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
                              {related.date ? (
                                <p className="text-sm text-gray-600 font-poppins">{related.date}</p>
                              ) : null}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Link
                      href="/events"
                      className="mt-4 inline-block text-sm font-semibold text-[#6D190D] hover:underline font-poppins"
                    >
                      View all events
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventDetails;

