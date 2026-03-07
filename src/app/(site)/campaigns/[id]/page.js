'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Users, Target, Calendar, MapPin, ArrowLeft, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';
import SiteApiService from '@/app/services/site-api';

const CampaignDetails = ({ params }) => {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        console.log('CampaignDetails: Starting to load campaign...');
        
        // Handle params as Promise in Next.js 15
        const resolvedParams = await params;
        console.log('CampaignDetails: Resolved params:', resolvedParams);
        
        const id = resolvedParams.id;
        if (!id) {
            throw new Error('Campaign ID is missing from parameters');
        }
        
        // Fetch campaign from API
        console.log(`CampaignDetails: Fetching campaign with ID: ${id}`);
        const response = await SiteApiService.getCampaign(id);
        console.log('CampaignDetails: API Response:', response);
        
        if (response.success) {
          // Parse content if it's a string
          let content = response.data.content;
          if (typeof content === 'string') {
            try {
              content = JSON.parse(content);
              console.log('CampaignDetails: Parsed content JSON:', content);
            } catch (e) {
              console.error('CampaignDetails: Failed to parse content JSON:', e);
              content = {};
            }
          } else {
             console.log('CampaignDetails: Content is already object or null:', content);
          }

          // Transform the campaign data to match the expected format
          const transformedCampaign = {
            id: response.data.id,
            slug: response.data.slug,
            title: response.data.title,
            image: response.data.imageUrl || '/images/campains/helpforpoorfamilies.jpg',
            description: response.data.description,
            fullDescription: response.data.description || response.data.fullDescription || 'Campaign details coming soon...',
            location: response.data.location,
            amount: response.data.amount || 0,
            raisedAmount: response.data.raisedAmount || 0,
            startDate: response.data.startDate,
            endDate: response.data.endDate,
            isActive: response.data.isActive,
            content: content,
            events: response.data.events || [],
            progress: response.data.amount > 0 ? Math.round((response.data.raisedAmount / response.data.amount) * 100) : 0,
            formattedRaised: `Rs. ${(response.data.raisedAmount || 0).toLocaleString()}`,
            formattedGoal: `Rs. ${(response.data.amount || 0).toLocaleString()}`,
            formattedStartDate: response.data.startDate ? new Date(response.data.startDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) : 'Start Date TBD',
            formattedEndDate: response.data.endDate ? new Date(response.data.endDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) : 'End Date TBD',
            about: content?.about || [],
            impactGallery: content?.impactGallery || [],
            keyFocusAreas: content?.keyFocusAreas || [],
            impactNumbers: content?.impactNumbers || [],
            testimonials: content?.testimonials || [],
            isCompleted: response.data.amount > 0 && response.data.raisedAmount >= response.data.amount
          };
          
          setCampaign(transformedCampaign);
        } else {
          setError(response.message || 'Failed to load campaign');
        }
      } catch (error) {
        console.error('Error loading campaign:', error);
        setError(error.message || 'An error occurred while loading the campaign');
      } finally {
        setLoading(false);
      }
    };
    
    loadCampaign();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6D190D] mx-auto mb-4"></div>
          <p className="text-gray-600 font-poppins">Loading campaign details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-poppins">{error || 'Campaign not found'}</p>
          <Link href="/campaigns" className="inline-flex items-center text-[#6D190D] mt-4 hover:underline font-poppins">
            <ArrowLeft className="mr-2" size={16} />
            Back to Campaigns
          </Link>
        </div>
      </div>
    );
  }

  const relatedCampaigns = [
    { id: 3, title: 'Sponsor for Hygienic Living Program', image: '/images/campains/Sponsor_for_Hygienic_Living_Program/titleimage.jpg', description: 'Promoting hygiene awareness and sanitation facilities.' },
    { id: 4, title: 'Self Medication & Drug Abuse Awareness', image: '/images/campains/Self_Medication_Drug_Abuse/titleImage.jpg', description: 'Educating youth about dangers of self-medication and drug abuse.' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <img 
            src={campaign.image} 
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
            <Link href="/campaigns" className="inline-flex items-center text-sm mb-4 hover:underline">
              <ArrowLeft className="mr-2" size={16} />
              Back to Campaigns
            </Link>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 font-playfair">{campaign.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <Calendar className="mr-2" size={16} />
                {campaign.formattedStartDate}
              </div>
              {campaign.endDate && (
                <div className="flex items-center">
                  <Clock className="mr-2" size={16} />
                  {campaign.formattedEndDate}
                </div>
              )}
              <div className="flex items-center">
                <MapPin className="mr-2" size={16} />
                {campaign.location}
              </div>
            </div>
            {campaign.isCompleted && (
              <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-full font-semibold">
                <TrendingUp className="mr-2" size={20} />
                Goal Achieved!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Campaign Content */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Campaign Description */}
              <div className="bg-white rounded-xl shadow-md p-8 mb-8">
                <h2 className="text-2xl font-bold text-[#222222] mb-6 font-playfair">About This Campaign</h2>
                <div className="prose max-w-none font-poppins text-gray-700">
                  {campaign.about.length > 0 ? (
                    campaign.about.map((paragraph, index) => (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ))
                  ) : (
                    <p>{campaign.fullDescription}</p>
                  )}
                </div>
              </div>

              {/* Impact Gallery */}
              {campaign.impactGallery && campaign.impactGallery.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-8 mb-8">
                  <h2 className="text-2xl font-bold text-[#222222] mb-6 font-playfair">Our Impact Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {campaign.impactGallery.slice(0, 4).map((img, index) => (
                      <div key={index} className="aspect-square overflow-hidden rounded-lg">
                        <img 
                          src={img} 
                          alt={`${campaign.title} ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Focus Areas */}
              {campaign.keyFocusAreas && campaign.keyFocusAreas.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-8 mb-8">
                  <h2 className="text-2xl font-bold text-[#222222] mb-6 font-playfair">Key Focus Areas</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {campaign.keyFocusAreas.map((area, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-[#FFD700] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p className="text-gray-700 font-poppins">{area}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Impact Numbers */}
              {campaign.impactNumbers && campaign.impactNumbers.length > 0 && (
                <div className="bg-[#6D190D] rounded-xl p-8 mb-8">
                  <h2 className="text-2xl font-bold text-white mb-6 font-playfair">Our Impact</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {campaign.impactNumbers.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="text-3xl font-bold text-[#FFD700] font-playfair mb-1">{stat.value}</div>
                        <div className="text-sm text-white/80 font-poppins">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Testimonials */}
              {campaign.testimonials && campaign.testimonials.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-8 mb-8">
                  <h2 className="text-2xl font-bold text-[#222222] mb-6 font-playfair">What People Say</h2>
                  <div className="space-y-6">
                    {campaign.testimonials.map((t, index) => (
                      <div key={index} className="bg-[#fcf9e3] rounded-lg p-6 border-l-4 border-[#FFD700]">
                        <p className="text-gray-700 italic font-poppins mb-3">"{t.quote}"</p>
                        <div>
                          <span className="font-semibold text-[#222222] font-poppins">{t.author}</span>
                          {t.role && <span className="text-gray-500 text-sm font-poppins ml-2">— {t.role}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Events */}
              {campaign.events && campaign.events.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-8">
                  <h2 className="text-2xl font-bold text-[#222222] mb-6 font-playfair">Related Events</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {campaign.events.map((event) => (
                      <Link 
                        key={event.id} 
                        href={`/events/${event.slug || event.id}`}
                        className="block group"
                      >
                        <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                          <h3 className="text-lg font-semibold text-[#222222] group-hover:text-[#6D190D] transition-colors font-poppins mb-2">
                            {event.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600 mb-2 font-poppins">
                            <Calendar className="mr-2" size={16} />
                            {new Date(event.eventDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-4 font-poppins">
                            <MapPin className="mr-2" size={16} />
                            {event.location}
                          </div>
                          <p className="text-sm text-gray-600 font-poppins line-clamp-2">
                            {event.description}
                          </p>
                          <div className="mt-4 text-[#6D190D] font-semibold font-poppins group-hover:underline">
                            View Event Details →
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Progress Card */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-8 sticky top-6">
                <h3 className="text-xl font-bold text-[#222222] mb-4 font-playfair">Campaign Progress</h3>
                
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2 font-poppins">
                    <span>Raised: {campaign.formattedRaised}</span>
                    <span>Goal: {campaign.formattedGoal}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        campaign.isCompleted ? 'bg-green-500' : 'bg-[#FFD700]'
                      }`}
                      style={{ width: `${Math.min(campaign.progress, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-center mt-2 text-sm font-semibold font-poppins">
                    {campaign.isCompleted ? (
                      <span className="text-green-600">🎉 Goal Achieved!</span>
                    ) : (
                      <span className="text-[#6D190D]">{campaign.progress}% funded</span>
                    )}
                  </div>
                </div>

                <Link 
                  href="/donate"
                  className="w-full bg-[#6D190D] text-white py-3 rounded-lg font-semibold hover:bg-[#8B2317] transition-colors mb-4 font-poppins text-center inline-block"
                >
                  Donate Now
                </Link>
                
                <button className="w-full border-2 border-[#6D190D] text-[#6D190D] py-3 rounded-lg font-semibold hover:bg-[#6D190D] hover:text-white transition-colors font-poppins">
                  Share Campaign
                </button>
              </div>

              {/* Campaign Stats */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h3 className="text-xl font-bold text-[#222222] mb-4 font-playfair">Campaign Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-poppins">Duration</span>
                    <span className="font-semibold text-[#222222] font-poppins">
                      {campaign.startDate && campaign.endDate 
                        ? `${new Date(campaign.startDate).toLocaleDateString()} - ${new Date(campaign.endDate).toLocaleDateString()}`
                        : 'Ongoing'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-poppins">Location</span>
                    <span className="font-semibold text-[#222222] font-poppins">{campaign.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-poppins">Events</span>
                    <span className="font-semibold text-[#222222] font-poppins">{campaign.events.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-poppins">Status</span>
                    <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      campaign.isCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    } font-poppins`}>
                      {campaign.isCompleted ? 'Completed' : 'Active'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Related Campaigns */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-[#222222] mb-4 font-playfair">Other Campaigns</h3>
                <div className="space-y-4">
                  {relatedCampaigns.map((related) => (
                    <Link 
                      key={related.id} 
                      href={`/campaigns/${related.id}`}
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
                          <p className="text-sm text-gray-600 font-poppins">{related.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CampaignDetails;
