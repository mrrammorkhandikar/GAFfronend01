import Link from 'next/link';
import SiteApiService from '@/app/services/site-api';
import PartnersCollaborationForm from './PartnersCollaborationForm.js';

export const metadata = {
  title: 'Partners | Guru Akanksha Foundation',
  description:
    'Health camps, education programmes, and community events with Guru Akanksha Foundation.',
};

export default async function PartnersPage() {
  let partners = [];
  let error = null;

  try {
    const response = await SiteApiService.getAllPartners();
    if (response.success) {
      partners = Array.isArray(response.data) ? response.data : [];
    } else {
      error = response.message || 'Failed to load this page';
    }
  } catch (e) {
    console.error('Error loading partners:', e);
    error = 'An error occurred while loading this page';
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
              Impact & collaboration
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#222222] font-playfair mb-4 leading-tight">
              Health, education, and community—together.
            </h1>
            <p className="text-sm md:text-base text-gray-700 font-poppins leading-relaxed mb-4">
              Hospitals, clinics, schools, and mission-driven teams work with Guru Akanksha Foundation on health
              camps, awareness drives, and learning programmes grounded in local needs.
            </p>
            <p className="text-sm md:text-base text-gray-700 font-poppins leading-relaxed mb-6">
              From multi-specialty outreach to programmes like <span className="font-semibold">&ldquo;Healthy Smile&rdquo;</span>,
              we focus on careful planning, dignified delivery, and clear communication with communities.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#6D190D] text-white text-sm font-semibold font-poppins shadow hover:bg-[#8B2317]"
              >
                Talk to our team
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-[#D4A71C] text-[#6D190D] text-sm font-semibold font-poppins bg-white/80 hover:bg-[#fff5cc]"
              >
                See programmes & events
              </Link>
            </div>
          </div>

          <div className="relative bg-white rounded-2xl shadow-lg border border-[#f3e1a5] overflow-hidden">
            <img
              src="/images/campains/Healthy_Smile_For_Underprivileged_Children/titleImage.jpg"
              alt="Healthy Smile programme"
              className="w-full h-52 md:h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <p className="text-xs text-white font-poppins mb-1">
                Healthy Smile dental outreach
              </p>
              <p className="text-sm font-semibold text-white font-poppins">
                Screening and education in schools and communities
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#222222] font-playfair mb-4">
              How programmes come together
            </h2>
            <p className="text-sm md:text-base text-gray-700 font-poppins mb-4">
              We keep planning practical for medical teams, educators, and CSR leads—from first conversation to
              follow-up after the day in the community.
            </p>
            <ul className="space-y-2 text-sm text-gray-700 font-poppins">
              <li>
                <span className="font-semibold text-[#6D190D]">Design together:</span> We shape activities that fit
                your strengths—camps, school health days, awareness sessions, or learning labs.
              </li>
              <li>
                <span className="font-semibold text-[#6D190D]">Operate jointly:</span> GAF supports mobilisation,
                permissions, and community coordination while your teams deliver services.
              </li>
              <li>
                <span className="font-semibold text-[#6D190D]">Share outcomes:</span> You receive a concise snapshot
                with photos and highlights, suitable for internal updates and external communication.
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
                  Community health outreach
                </p>
                <p className="text-sm font-semibold text-white font-poppins">
                  Joint screening days with volunteer clinicians
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs md:text-sm font-poppins text-gray-700 pt-2">
              <div>
                <p className="font-semibold text-[#222222]">Multi-location programmes</p>
                <p>Across regions we serve</p>
              </div>
              <div>
                <p className="font-semibold text-[#222222]">Ongoing collaboration</p>
                <p>Many teams join us for more than one initiative</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-[#222222] font-playfair mb-3">
              Why teams work with Guru Akanksha Foundation
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
              body="Co‑host awareness campaigns around self‑medication, substance abuse, and mental health with our field teams and schools."
            />
            <WhyCard
              image="/images/campains/Sponsor_for_Hygienic_Living_Program/titleimage.jpg"
              title="Grow your social footprint"
              body="Align your CSR or social-impact goals with programs that are already trusted by schools, communities, and local leaders."
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#fcf9e3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-[#222222] font-playfair mb-3">
              Who we work with
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
              Stories Are on Their Way
            </h2>
            <p className="text-gray-600 font-poppins text-base max-w-lg mx-auto">
              We are documenting collaborations and field work. Check back soon, or reach out if you would like to connect.
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
              Stories Are on Their Way
            </h2>
            <p className="text-gray-600 font-poppins text-base max-w-lg mx-auto">
              We are documenting collaborations and field work. Check back soon, or reach out if you would like to connect.
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
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-[#222222] font-playfair mb-3">
                  What you can expect
                </h2>
                <p className="text-sm md:text-base text-gray-700 font-poppins">
                  Clear roles, strong on‑ground execution, and dignified storytelling from the field.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm text-gray-700 font-poppins">
                <div className="bg-[#fcf9e3] rounded-2xl border border-[#f3e1a5] p-5">
                  <p className="font-semibold text-[#6D190D] mb-2">Programme design support</p>
                  <p>
                    We help scope realistic, high‑impact activities that fit your team&apos;s bandwidth and strengths.
                  </p>
                </div>
                <div className="bg-[#fcf9e3] rounded-2xl border border-[#f3e1a5] p-5">
                  <p className="font-semibold text-[#6D190D] mb-2">On‑ground operations</p>
                  <p>
                    Mobilisation, permissions, and community coordination are managed by our field teams.
                  </p>
                </div>
                <div className="bg-[#fcf9e3] rounded-2xl border border-[#f3e1a5] p-5">
                  <p className="font-semibold text-[#6D190D] mb-2">Field snapshots</p>
                  <p>
                    Concise reporting with photos and highlights—ready to share with your leadership and stakeholders.
                  </p>
                </div>
                <div className="bg-[#fcf9e3] rounded-2xl border border-[#f3e1a5] p-5">
                  <p className="font-semibold text-[#6D190D] mb-2">Long‑term collaboration</p>
                  <p>
                    We look beyond single events toward sustained initiatives and co‑branded outreach where it fits.
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
        </>
      )}

      {/* Final CTA band — shown for every visitor (same inbox as /contact) */}
      <section className="py-16 bg-[#e8f5f2]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#222222] font-playfair mb-3">
              Get involved today
            </h2>
            <p className="text-sm md:text-base text-gray-700 font-poppins mb-4">
              Share a few details about your organization or practice, and our team will get in touch with formats
              that fit you—single-day camps, recurring programmes, or longer campaigns.
            </p>
            <ul className="list-disc list-inside text-xs md:text-sm text-gray-700 font-poppins space-y-1 mb-4">
              <li>Typical response time: within 3–5 working days.</li>
              <li>No obligation – we start with a conversation and a draft concept note.</li>
              <li>Available across Mumbai, Pune, and expanding cities.</li>
            </ul>
          </div>
          <PartnersCollaborationForm />
        </div>
      </section>

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
                Ready to connect?
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-playfair">
                Talk to our team
              </h2>
              <p className="text-sm md:text-base text-gray-100 max-w-md font-poppins">
                Interested in collaborating? Whether you represent a hospital, school, NGO, or CSR initiative, we are
                glad to explore how we can work together.
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
            Featured
          </span>
        ) : (
          <span className="text-gray-400">Collaborator</span>
        )}
        <span className="text-[#6D190D] font-semibold group-hover:underline">
          Read their story →
        </span>
      </div>
    </Link>
  );
}

