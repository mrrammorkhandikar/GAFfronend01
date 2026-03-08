import Link from 'next/link';
import SiteApiService from '@/app/services/site-api';

export const metadata = {
  title: 'Partners | Guru Akanksha Foundation',
  description:
    'Learn how organizations and individuals partner with Guru Akanksha Foundation to run health camps, education programs, and community events.',
};

export default async function PartnersPage() {
  let partners = [];
  let error = null;

  try {
    const response = await SiteApiService.getAllPartners();
    if (response.success) {
      partners = Array.isArray(response.data) ? response.data : [];
    } else {
      error = response.message || 'Failed to load partners';
    }
  } catch (e) {
    console.error('Error loading partners:', e);
    error = 'An error occurred while loading partners';
  }

  const featured = partners.filter((p) => p.isFeatured);
  const others = partners.filter((p) => !p.isFeatured);

  return (
    <div className="min-h-screen bg-[#fcf9e3]">
      {/* Hero section - light theme, consistent with site */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#fff7d6] via-[#fcf9e3] to-[#ffe6d6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-10 items-center">
          <div>
            <p className="font-poppins uppercase text-xs md:text-sm tracking-[0.3em] text-[#D4A71C] mb-3">
              Partners in impact
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#222222] font-playfair mb-4 leading-tight">
              Become a health & education impact partner.
            </h1>
            <p className="text-sm md:text-base text-gray-700 font-poppins leading-relaxed mb-4">
              Join hospitals, clinics, schools, and mission‑driven companies who co‑create health
              camps, drug‑awareness drives, and learning programs with Guru Akanksha Foundation.
            </p>
            <p className="text-sm md:text-base text-gray-700 font-poppins leading-relaxed mb-6">
              From organizing a multi‑specialty camp with <span className="font-semibold">Zen Medical</span>
              , to running our <span className="font-semibold">&ldquo;Healthy Smile&rdquo;</span>{' '}
              dental program, we turn your expertise into concrete, trackable community outcomes.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#6D190D] text-white text-sm font-semibold font-poppins shadow hover:bg-[#8B2317]"
              >
                Talk to our partnerships team
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-[#D4A71C] text-[#6D190D] text-sm font-semibold font-poppins bg-white/80 hover:bg-[#fff5cc]"
              >
                See live programs & events
              </Link>
            </div>

            <div className="mt-8 space-y-2">
              <p className="text-xs uppercase tracking-[0.25em] text-[#A67C00] font-poppins">
                Trusted by partners like
              </p>
              <div className="flex flex-wrap gap-4 items-center text-xs md:text-sm font-poppins text-gray-700">
                <span className="inline-flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-[#fcf9e3] border border-[#f3e1a5] flex items-center justify-center text-[10px] font-bold text-[#6D190D]">
                    Z
                  </span>
                  Zen Medical Hospital
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-[#fcf9e3] border border-[#f3e1a5] flex items-center justify-center text-[10px] font-bold text-[#6D190D]">
                    B
                  </span>
                  Bright Minds Coaching
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-[#fcf9e3] border border-[#f3e1a5] flex items-center justify-center text-[10px] font-bold text-[#6D190D]">
                    A
                  </span>
                  Dr. Ananya Verma
                </span>
              </div>
            </div>
          </div>

          <div className="relative bg-white rounded-2xl shadow-lg border border-[#f3e1a5] overflow-hidden">
            <img
              src="/images/campains/Healthy_Smile_For_Underprivileged_Children/titleImage.jpg"
              alt="Healthy Smile program"
              className="w-full h-52 md:h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <p className="text-xs text-white font-poppins mb-1">
                Partner‑led Healthy Smile dental camp
              </p>
              <p className="text-sm font-semibold text-white font-poppins">
                1500+ children screened across schools and communities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How partnership works - moved content from original hero */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#222222] font-playfair mb-4">
              How partnership with GAF works
            </h2>
            <p className="text-sm md:text-base text-gray-700 font-poppins mb-4">
              We keep things simple for busy medical teams, educators, and CSR leaders – from first
              conversation to post‑event reporting.
            </p>
            <ul className="space-y-2 text-sm text-gray-700 font-poppins">
              <li>
                <span className="font-semibold text-[#6D190D]">Design together:</span> We co‑create
                a program that fits your expertise – medical camps, school health days, awareness
                rallies, or learning labs.
              </li>
              <li>
                <span className="font-semibold text-[#6D190D]">Operate jointly:</span> GAF teams
                handle mobilisation, permissions, and community coordination while your teams deliver
                services.
              </li>
              <li>
                <span className="font-semibold text-[#6D190D]">Share the story:</span> You receive a
                simple impact snapshot with participant numbers, photos, and key outcomes, ready for
                internal and external communication.
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 md:p-6 space-y-4">
            <div className="relative overflow-hidden rounded-xl">
              <img
                src="/images/helppoor.jpg"
                alt="Community health outreach"
                className="w-full h-48 md:h-60 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <p className="text-xs text-white font-poppins mb-1">
                  Joint community health outreach
                </p>
                <p className="text-sm font-semibold text-white font-poppins">
                  400+ people screened in a single day with partner doctors
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs md:text-sm font-poppins text-gray-700 pt-2">
              <div>
                <p className="font-semibold text-[#222222]">Multi‑city programs</p>
                <p>Mumbai, Pune & expanding locations</p>
              </div>
              <div>
                <p className="font-semibold text-[#222222]">Repeat collaborations</p>
                <p>Most partners return for new initiatives</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why partners work with us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-[#222222] font-playfair mb-3">
              Why partners choose Guru Akanksha Foundation
            </h2>
            <p className="text-sm md:text-base text-gray-700 font-poppins">
              We make it easy for medical institutions, educators, and mission-driven businesses to
              plug into meaningful, well-run community programs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <WhyCard
              image="/images/campains/Healthy_Smile_For_Underprivileged_Children/titleImage.jpg"
              title="End community health gaps"
              body="Turn your hospital or clinic’s expertise into structured outreach – dental camps, general check‑ups, and preventive screenings in low‑income areas."
            />
            <WhyCard
              image="/images/campains/Self_Medication_Drug_Abuse/titleImage.jpg"
              title="Help young people stay safe"
              body="Co‑host awareness campaigns around self‑medication, substance abuse, and mental health with our field teams and school partners."
            />
            <WhyCard
              image="/images/campains/Sponsor_for_Hygienic_Living_Program/titleimage.jpg"
              title="Grow your social footprint"
              body="Align your CSR or social-impact goals with programs that are already trusted by schools, communities, and local leaders."
            />
          </div>
        </div>
      </section>

      {/* Who we partner with */}
      <section className="py-16 bg-[#fcf9e3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-[#222222] font-playfair mb-3">
              Who we partner with
            </h2>
            <p className="text-sm md:text-base text-gray-700 font-poppins">
              Whether you are an institution or an individual expert, there is a way to collaborate
              with us.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-semibold text-[#222222] font-playfair mb-2">
                Hospitals & clinics
              </h3>
              <p className="text-sm text-gray-700 font-poppins mb-3">
                Multi‑specialty hospitals, dental colleges, diagnostic centers, and private
                practices that want to serve beyond their walls.
              </p>
              <ul className="list-disc list-inside text-xs text-gray-600 font-poppins space-y-1">
                <li>Host multi‑day health camps with our field teams.</li>
                <li>Offer specialist consultations for complex community cases.</li>
                <li>Run school‑based check‑ups and awareness sessions.</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-semibold text-[#222222] font-playfair mb-2">
                Schools, NGOs & colleges
              </h3>
              <p className="text-sm text-gray-700 font-poppins mb-3">
                Educational institutions and grassroots organizations that want structured health,
                hygiene, and life‑skills inputs for their children and youth.
              </p>
              <ul className="list-disc list-inside text-xs text-gray-600 font-poppins space-y-1">
                <li>Integrate health & hygiene modules into your school calendar.</li>
                <li>Co‑design bridge courses and mentoring for adolescents.</li>
                <li>Access speakers and facilitators for awareness days.</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-semibold text-[#222222] font-playfair mb-2">
                CSR teams & individuals
              </h3>
              <p className="text-sm text-gray-700 font-poppins mb-3">
                Companies, foundations, and individual professionals who want clear, transparent
                impact with children and communities.
              </p>
              <ul className="list-disc list-inside text-xs text-gray-600 font-poppins space-y-1">
                <li>Sponsor full programs or specific events.</li>
                <li>Volunteer skills, time, or pro‑bono services.</li>
                <li>Support long‑term campaigns like &ldquo;Healthy Smile&rdquo;.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Error / data states around partner grids */}
      {error ? (
        <section className="py-20 bg-white">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-20 h-20 bg-[#fcf9e3] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🤝</span>
            </div>
            <p className="font-poppins uppercase text-xs tracking-[0.25em] text-[#D4A71C] mb-3">
              Coming Soon
            </p>
            <h2 className="text-3xl font-bold text-[#222222] mb-4 font-playfair">
              Partner Showcases Are on Their Way
            </h2>
            <p className="text-gray-600 font-poppins text-base max-w-lg mx-auto">
              We are busy documenting the incredible work our partners do with us. Check back soon to see their stories, or reach out to start a new collaboration.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center mt-8 px-8 py-3 rounded-full bg-[#FFD700] text-[#222222] font-semibold font-poppins shadow hover:bg-[#f5c700] transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </section>
      ) : partners.length === 0 ? (
        <section className="py-20 bg-white">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-20 h-20 bg-[#fcf9e3] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🤝</span>
            </div>
            <p className="font-poppins uppercase text-xs tracking-[0.25em] text-[#D4A71C] mb-3">
              Coming Soon
            </p>
            <h2 className="text-3xl font-bold text-[#222222] mb-4 font-playfair">
              Partner Showcases Are on Their Way
            </h2>
            <p className="text-gray-600 font-poppins text-base max-w-lg mx-auto">
              We are busy documenting the incredible work our partners do with us. Check back soon to see their stories, or reach out to start a new collaboration.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center mt-8 px-8 py-3 rounded-full bg-[#FFD700] text-[#222222] font-semibold font-poppins shadow hover:bg-[#f5c700] transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </section>
      ) : (
        <>
          {/* What our partners get */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-[#222222] font-playfair mb-3">
                  What our partners get
                </h2>
                <p className="text-sm md:text-base text-gray-700 font-poppins">
                  Clear roles, strong on‑ground execution, and stories your teams can be proud of.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm text-gray-700 font-poppins">
                <div className="bg-[#fcf9e3] rounded-2xl border border-[#f3e1a5] p-5">
                  <p className="font-semibold text-[#6D190D] mb-2">Program design support</p>
                  <p>
                    We help you scope realistic, high‑impact activities that fit your team&apos;s
                    bandwidth and strengths.
                  </p>
                </div>
                <div className="bg-[#fcf9e3] rounded-2xl border border-[#f3e1a5] p-5">
                  <p className="font-semibold text-[#6D190D] mb-2">On‑ground operations</p>
                  <p>
                    Mobilisation, permissions, and community coordination are managed by our field
                    teams.
                  </p>
                </div>
                <div className="bg-[#fcf9e3] rounded-2xl border border-[#f3e1a5] p-5">
                  <p className="font-semibold text-[#6D190D] mb-2">Impact snapshots</p>
                  <p>
                    Simple reporting – participant numbers, photos, and key outcomes – ready to share
                    with your leadership and stakeholders.
                  </p>
                </div>
                <div className="bg-[#fcf9e3] rounded-2xl border border-[#f3e1a5] p-5">
                  <p className="font-semibold text-[#6D190D] mb-2">Long‑term relationships</p>
                  <p>
                    We look beyond one‑off events towards multi‑year partnerships and co‑branded
                    initiatives.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Partner grids */}
          {featured.length > 0 && (
            <section className="py-16 bg-[#fcf9e3]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#222222] font-playfair">
                    Meet some of our partners
                  </h2>
                  <p className="text-sm text-gray-700 font-poppins max-w-xl">
                    These organizations and individuals co‑create programs with us – from mega health
                    camps to intimate school workshops.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featured.map((partner) => (
                    <PartnerCard key={partner.id} partner={partner} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {others.length > 0 && (
            <section className="py-12 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-[#222222] font-playfair">
                    More friends of Guru Akanksha Foundation
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {others.map((partner) => (
                    <PartnerCard key={partner.id} partner={partner} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Final CTA band */}
          <section className="py-16 bg-[#e8f5f2]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-10 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#222222] font-playfair mb-3">
                  Become a partner today
                </h2>
                <p className="text-sm md:text-base text-gray-700 font-poppins mb-4">
                  Share a few details about your organization or practice, and our partnerships team
                  will get in touch with formats that fit you – one‑day camps, recurring programs, or
                  long‑term campaigns.
                </p>
                <ul className="list-disc list-inside text-xs md:text-sm text-gray-700 font-poppins space-y-1 mb-4">
                  <li>Typical response time: within 3–5 working days.</li>
                  <li>No obligation – we start with a conversation and a draft concept note.</li>
                  <li>Available across Mumbai, Pune, and expanding cities.</li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-4">
                <p className="text-sm font-semibold text-[#222222] font-poppins">
                  Tell us how you&apos;d like to partner:
                </p>
                <div className="space-y-3 text-xs font-poppins">
                  <input
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
                    placeholder="Your name or organization"
                  />
                  <input
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
                    placeholder="Email / phone"
                  />
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent">
                    <option value="">How would you like to partner?</option>
                    <option>Host a health camp</option>
                    <option>Run awareness sessions</option>
                    <option>Support education programs</option>
                    <option>CSR / funding partnership</option>
                    <option>Volunteer as an individual</option>
                  </select>
                  <textarea
                    rows={3}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
                    placeholder="Share a few lines about your idea or context (optional)"
                  />
                </div>
                <p className="text-[10px] text-gray-500 font-poppins">
                  This mini form is just for illustration. To send a real enquiry, please use our main
                  contact form.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg bg-[#6D190D] text-white text-sm font-semibold font-poppins hover:bg-[#8B2317]"
                >
                  Go to full partnership form
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-[#fcf9e3]">
        <div
          className="max-w-6xl mx-auto rounded-3xl overflow-hidden bg-center bg-cover relative"
          style={{ backgroundImage: "url('/images/campains/Sponsor_for_Hygienic_Living_Program/titleimage.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/60 pointer-events-none" />
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 p-10 md:p-14 text-white">
            <div>
              <p className="font-poppins uppercase text-xs tracking-[0.25em] mb-3 text-[#FFD700]">
                Ready to Partner?
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-playfair">
                Talk to Our Partnerships Team
              </h2>
              <p className="text-sm md:text-base text-gray-100 max-w-md font-poppins">
                Interested in collaborating? Whether you're a hospital, school, NGO, or CSR team, our partnerships team is ready to explore how we can make an impact together.
              </p>
            </div>
            <div className="flex items-center md:justify-end">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#FFD700] text-[#222222] font-semibold font-poppins shadow-lg hover:bg-[#f5c700] transition-colors"
              >
                Start a Conversation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function WhyCard({ image, title, body }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="h-40 w-full overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-5 space-y-2 flex-1 flex flex-col">
        <h3 className="text-base font-semibold text-[#222222] font-playfair">{title}</h3>
        <p className="text-sm text-gray-700 font-poppins flex-1">{body}</p>
      </div>
    </div>
  );
}

function PartnerCard({ partner }) {
  const location =
    [partner.city, partner.country].filter(Boolean).join(', ') || 'Based in multiple locations';

  return (
    <Link
      href={`/partners/${partner.slug}`}
      className="group bg-white rounded-2xl shadow-md border border-gray-100 p-5 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-xl border border-gray-100 bg-[#fcf9e3] flex items-center justify-center overflow-hidden">
          {partner.logoUrl ? (
            <img
              src={partner.logoUrl}
              alt={partner.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-sm font-semibold text-[#6D190D] font-poppins">
              {partner.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-[#222222] group-hover:text-[#6D190D] font-poppins line-clamp-2">
            {partner.name}
          </h3>
          <p className="text-xs text-gray-500 font-poppins">
            {partner.type} • {location}
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-600 font-poppins mb-3 line-clamp-3">
        {partner.shortDescription}
      </p>
      <div className="mt-auto flex items-center justify-between text-xs font-poppins">
        {partner.isFeatured ? (
          <span className="inline-flex items-center px-2 py-1 rounded-full bg-[#fcf9e3] text-[#6D190D] border border-[#f3e1a5]">
            Featured partner
          </span>
        ) : (
          <span className="text-gray-400">Long-term partner</span>
        )}
        <span className="text-[#6D190D] font-semibold group-hover:underline">
          Read their story →
        </span>
      </div>
    </Link>
  );
}

