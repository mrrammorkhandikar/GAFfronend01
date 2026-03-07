import Link from 'next/link';
import SiteApiService from '@/app/services/site-api';

export async function generateMetadata({ params }) {
  const { slug } = params;
  try {
    const response = await SiteApiService.getPartnerBySlug(slug);
    if (response.success && response.data) {
      return {
        title: `${response.data.name} | GAF Partner`,
        description: response.data.shortDescription || 'Partnership story with Guru Akanksha Foundation.',
      };
    }
  } catch {
    // ignore and fall back
  }
  return {
    title: 'Partner | Guru Akanksha Foundation',
  };
}

export default async function PartnerStoryPage({ params }) {
  const { slug } = params;

  let partner = null;
  let error = null;

  try {
    const response = await SiteApiService.getPartnerBySlug(slug);
    if (response.success && response.data) {
      partner = response.data;
    } else {
      error = response.message || 'Partner not found';
    }
  } catch (e) {
    console.error('Error loading partner story:', e);
    error = 'An error occurred while loading this partner story';
  }

  if (error || !partner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcf9e3]">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold text-[#222222] mb-2 font-playfair">
            Partner story not available
          </h1>
          <p className="text-gray-600 font-poppins mb-4 text-sm">{error}</p>
          <Link
            href="/partners"
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#6D190D] text-white text-sm font-semibold font-poppins hover:bg-[#8B2317]"
          >
            Back to Partners
          </Link>
        </div>
      </div>
    );
  }

  let content = partner.content;
  if (typeof content === 'string') {
    try {
      content = JSON.parse(content);
    } catch {
      content = {};
    }
  }
  content = content || {};

  const about = Array.isArray(content.about) ? content.about : [];
  const programs = Array.isArray(content.programs) ? content.programs : [];
  const highlights = Array.isArray(content.highlights) ? content.highlights : [];
  const quote = content.quote;

  const location =
    [partner.city, partner.country].filter(Boolean).join(', ') || null;

  const heroStatus =
    partner.isActive && partner.isFeatured
      ? 'Active • Featured partnership'
      : partner.isActive
      ? 'Active partnership'
      : 'Past / Inactive partnership';

  return (
    <div className="min-h-screen bg-[#fcf9e3]">
      {/* Hero */}
      <section className="relative">
        <div className="relative h-72 md:h-80 bg-gradient-to-r from-[#6D190D] via-[#8B2317] to-[#D4A71C]">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,_#ffffff,_transparent_50%)]" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/10 border border-white/40 flex items-center justify-center overflow-hidden">
                  {partner.logoUrl ? (
                    <img
                      src={partner.logoUrl}
                      alt={partner.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-white font-poppins">
                      {partner.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#ffe9a8] font-poppins mb-2">
                    Partner story
                  </p>
                  <h1 className="text-2xl md:text-4xl font-bold text-white font-playfair mb-2 max-w-2xl">
                    {partner.name}
                  </h1>
                  <p className="text-xs md:text-sm text-[#ffe9a8] font-poppins">
                    {partner.type}
                    {location ? ` • ${location}` : ''}
                  </p>
                  <p className="mt-3 text-xs md:text-sm text-white/90 font-poppins max-w-xl">
                    {partner.shortDescription}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end gap-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-white font-poppins border border-white/30">
                  {heroStatus}
                </span>
                <div className="flex gap-3">
                  <Link
                    href="/partners"
                    className="inline-flex items-center px-4 py-2 rounded-lg border border-white/60 text-white text-xs md:text-sm font-semibold font-poppins hover:bg-white/10"
                  >
                    Back to all partners
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-[#FFD700] text-[#6D190D] text-xs md:text-sm font-semibold font-poppins shadow hover:bg-[#f2c800]"
                  >
                    Explore partnership
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Story */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h2 className="text-xl font-bold text-[#222222] mb-3 font-playfair">
                  How we work together
                </h2>
                <div className="space-y-3 text-sm text-gray-700 font-poppins leading-relaxed">
                  {about.length > 0
                    ? about.map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))
                    : partner.shortDescription && <p>{partner.shortDescription}</p>}
                </div>
              </div>

              {programs.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                  <h2 className="text-xl font-bold text-[#222222] mb-3 font-playfair">
                    Programs & events with this partner
                  </h2>
                  <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 font-poppins">
                    {programs.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {highlights.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-sm font-semibold text-[#222222] mb-2 font-playfair">
                    Impact at a glance
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-xs md:text-sm text-gray-700 font-poppins">
                    {highlights.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {quote?.text && (
                <div className="bg-[#fcf9e3] rounded-2xl border border-[#f3e1a5] p-5">
                  <p className="text-sm italic text-gray-800 font-poppins">
                    “{quote.text}”
                  </p>
                  {(quote.author || quote.role) && (
                    <p className="mt-3 text-xs text-gray-700 font-poppins">
                      {quote.author && <span className="font-semibold">{quote.author}</span>}
                      {quote.author && quote.role && <span> • </span>}
                      {quote.role}
                    </p>
                  )}
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
                <h3 className="text-sm font-semibold text-[#222222] font-playfair">
                  Partner with Guru Akanksha Foundation
                </h3>
                <p className="text-xs text-gray-600 font-poppins">
                  Inspired by this story? Let&apos;s explore how your organization or practice can
                  support children&apos;s education, health, and dignity.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#6D190D] text-white text-xs font-semibold font-poppins hover:bg-[#8B2317]"
                >
                  Talk to our partnerships team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

