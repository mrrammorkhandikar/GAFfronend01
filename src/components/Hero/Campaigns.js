'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CampaignCard from './CampaignCard';
import SiteApiService from '@/app/services/site-api';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        
        const response = await SiteApiService.getActiveCampaigns(2); // Fetch 2 campaigns for the homepage
        
        // Check if response.data has the nested structure
        const campaignData = response.data && response.data.success && response.data.data ? response.data.data : response.data;
  
        
        if (response.success && campaignData) {

          
          // Transform the campaign data to match the expected format for CampaignCard
          let transformedCampaigns = [];
          
          if (Array.isArray(campaignData)) {
         
            transformedCampaigns = campaignData.map((campaign, index) => {

              
              // Calculate values safely
              const amount = campaign.amount || 0;
              const raisedAmount = campaign.raisedAmount || 0;
              const remaining = Math.max(0, amount - raisedAmount);
              const progress = (amount > 0) ? Math.round((raisedAmount / amount) * 100) : 0;
              
              const transformedCampaign = {
                id: campaign.id,
                imageSrc: campaign.imageUrl || '/images/campains/helpforpoorfamilies.jpg',
                title: campaign.title,
                raised: `Rs. ${raisedAmount.toLocaleString()}`,
                remaining: `Rs. ${remaining.toLocaleString()}`,
                goal: `Rs. ${amount.toLocaleString()}`,
                progress: progress,
              };
              
             
              return transformedCampaign;
            });
            
          } else {
            console.log('=== campaignData is not an array ===');
            console.log('campaignData:', campaignData);
          }

          setCampaigns(transformedCampaigns);
        } else {
          console.log('=== Response validation failed ===');

          setError(response.message || 'Failed to load campaigns');
        }
      } catch (error) {
   
        setError('An error occurred while fetching campaigns');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) {
    return (
      <section className="py-20 md:py-32 bg-white ">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <p className="font-poppins uppercase text-sm font-semibold tracking-widest text-[#D4A71C] mb-2">
                Loading Campaigns...
              </p>
              <h2 
                className="text-3xl md:text-4xl font-black text-[#222222]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Loading Campaigns...
              </h2>
            </div>
            <Link
              href="/campaigns"
              className="mt-6 md:mt-0 inline-block py-3 px-8 text-sm font-semibold uppercase tracking-wider rounded-md text-gray-800 bg-[#FFD700] transition-colors duration-200 hover:bg-[#E6C300] shadow-md hover:shadow-lg font-poppins"
            >
              View All Campaigns
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 justify-center items-center pl-[15px]"
          style={{paddingLeft: "40px"}}>
            {[1, 2].map((item) => (
              <div key={item} className="animate-pulse flex flex-col space-y-4">
                <div className="h-64 bg-gray-200 rounded-xl"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || campaigns.length === 0) {
    return (
      <section className="py-20 md:py-32 bg-white ">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <p className="font-poppins uppercase text-sm font-semibold tracking-widest text-[#D4A71C] mb-2">
                Recent Campaigns
              </p>
              <h2 
                className="text-3xl md:text-4xl font-black text-[#222222]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Donate To Support Holistic Healthcare<br></br> Awareness In India
              </h2>
            </div>
            <Link
              href="/campaigns"
              className="mt-6 md:mt-0 inline-block py-3 px-8 text-sm font-semibold uppercase tracking-wider rounded-md text-gray-800 bg-[#FFD700] transition-colors duration-200 hover:bg-[#E6C300] shadow-md hover:shadow-lg font-poppins"
            >
              View All Campaigns
            </Link>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600 font-poppins">
              {error || 'No campaigns available at the moment. Please check back later or visit our campaigns page.'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    // Section Container: Uses a soft cream background (#FCF9E3)
    <section className="py-20 md:py-32 bg-white ">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          
          <div>
            {/* Subheading: Poppins, Yellow */}
            <p className="font-poppins uppercase text-sm font-semibold tracking-widest text-[#D4A71C] mb-2">
              Recent Campaigns
            </p>
            
            {/* Main Title: Playfair Display 900, Large Text, Dark Color */}
            <h2 
              className="text-3xl md:text-4xl font-black text-[#222222]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Donate To Support Holistic Healthcare<br></br> Awareness In India
            </h2>
          </div>
          
          {/* View All Campaigns Button */}
          <Link
            href="/campaigns" // Placeholder link
            className="mt-6 md:mt-0 inline-block py-3 px-8 text-sm font-semibold uppercase tracking-wider rounded-md text-gray-800 bg-[#FFD700] transition-colors duration-200 hover:bg-[#E6C300] shadow-md hover:shadow-lg font-poppins"
          >
            View All Campaigns
          </Link>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 justify-center items-center pl-[15px]"
        style={{paddingLeft: "40px"}}>
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} {...campaign} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Campaigns;
