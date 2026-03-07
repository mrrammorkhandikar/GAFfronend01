import SiteApiService from '@/app/services/site-api';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata = {
  title: 'Campaigns | Global Aid Foundation',
  description: 'Discover our ongoing campaigns focused on education, healthcare, and community development. Every contribution helps us reach more people in need.',
};

export default async function CampaignsPage() {
  let campaigns = [];
  let error = null;

  try {
    const response = await SiteApiService.getAllCampaigns();
    if (response.success && response.data) {
      campaigns = Array.isArray(response.data) ? response.data.map((campaign) => ({
        id: campaign.id,
        imageSrc: campaign.imageUrl || '/images/campains/helpforpoorfamilies.jpg',
        title: campaign.title,
        raised: `Rs. ${(campaign.raisedAmount || 0).toLocaleString()}`,
        remaining: `Rs. ${Math.max(0, ((campaign.amount || 0) - (campaign.raisedAmount || 0))).toLocaleString()}`,
        goal: `Rs. ${(campaign.amount || 0).toLocaleString()}`,
        progress: (campaign.amount && campaign.amount > 0) ? Math.round(((campaign.raisedAmount || 0) / campaign.amount) * 100) : 0,
        description: campaign.description?.substring(0, 150) + '...' || 'Campaign description coming soon...',
      })) : [];
    } else {
      error = response.message || 'Failed to fetch campaigns';
    }
  } catch (err) {
    error = 'An error occurred while fetching campaigns';
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

  if (campaigns.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Campaigns Found</h2>
          <p className="text-gray-600">There are currently no active campaigns available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 min-h-[320px] bg-cover bg-center" style={{ backgroundImage: "url('/images/campains/Healthy_Smile_For_Underprivileged_Children/titleImage.jpg')" }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="font-poppins uppercase text-sm font-semibold tracking-widest text-[#FFD700] mb-2">
              Our Campaigns
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 font-playfair"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              Transforming Lives Through Our Initiatives
            </h1>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto font-poppins">
              Discover our ongoing campaigns focused on education, healthcare, and community development. 
              Every contribution helps us reach more people in need.
            </p>
          </div>
        </div>
      </section>

      {/* Campaigns Grid */}
      <section className="py-20 bg-[#fcf9e3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
                <div className="relative">
                  <img 
                    src={campaign.imageSrc} 
                    alt={campaign.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-[#FFD700] text-[#6D190D] px-3 py-1 rounded-full text-sm font-bold font-poppins">
                    {campaign.progress}% funded
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-[#222222] mb-3 font-playfair">
                    {campaign.title}
                  </h3>
                  <p className="text-gray-600 mb-6 font-poppins">
                    {campaign.description}
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div 
                      className="bg-[#D4A71C] h-2.5 rounded-full" 
                      style={{ width: `${Math.min(campaign.progress, 100)}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-sm font-semibold text-gray-700 mb-6 font-poppins">
                    <span>Raised: {campaign.raised}</span>
                    <span>Goal: {campaign.goal}</span>
                  </div>
                  
                  <div className="flex gap-4">
                    <Link 
                      href={`/campaigns/${campaign.id}`}
                      className="flex-1 bg-white border-2 border-[#D4A71C] text-[#D4A71C] py-3 rounded-lg font-bold text-center hover:bg-[#D4A71C] hover:text-white transition-colors font-poppins"
                    >
                      View Details
                    </Link>
                    <Link 
                      href="/donate"
                      className="flex-1 bg-[#D4A71C] text-white py-3 rounded-lg font-bold text-center hover:bg-[#b89018] transition-colors font-poppins"
                    >
                      Donate Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
