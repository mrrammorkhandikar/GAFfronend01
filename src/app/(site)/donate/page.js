'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const Donate = () => {
  const [donationAmount, setDonationAmount] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const presetAmounts = [500, 1000, 2000, 5000, 10000];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle donation submission
    console.log('Donation submitted:', { donationAmount, formData });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 min-h-[320px] bg-cover bg-center" style={{ backgroundImage: "url('/images/Png/GetinvolvedDonate.png')" }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="font-poppins uppercase text-sm font-semibold tracking-widest text-[#FFD700] mb-2">
              Make a Donation
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 font-playfair"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              Your Support Creates Lasting Change
            </h1>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto font-poppins">
              Every contribution, no matter the size, helps us provide education, healthcare, 
              and hope to those who need it most. Join us in making a difference today.
            </p>
          </div>
        </div>
      </section>

      {/* Donation Form Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Donation Options */}
            <div>
              <h2 className="text-2xl font-bold text-[#222222] mb-6 font-playfair">Choose Your Donation</h2>
              
              {/* Preset Amounts */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#222222] mb-4 font-poppins">Select Amount</h3>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {presetAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setDonationAmount(amount.toString())}
                      className={`py-3 rounded-lg font-semibold transition-colors font-poppins ${
                        donationAmount === amount.toString()
                          ? 'bg-[#FFD700] text-[#222222]'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-poppins">₹</span>
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    placeholder="Enter custom amount"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FFD700] font-poppins"
                  />
                </div>
              </div>

              {/* Impact Information */}
              <div className="bg-[#fcf9e3] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#222222] mb-4 font-playfair">Your Impact</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#FFD700] rounded-full mr-3"></div>
                    <span className="text-gray-700 font-poppins">₹500 can provide health check-ups for 2 children</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#FFD700] rounded-full mr-3"></div>
                    <span className="text-gray-700 font-poppins">₹1000 can sponsor educational materials for 5 students</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#FFD700] rounded-full mr-3"></div>
                    <span className="text-gray-700 font-poppins">₹2000 can fund a hygiene awareness session</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Donor Information */}
            <div>
              <h2 className="text-2xl font-bold text-[#222222] mb-6 font-playfair">Your Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FFD700] font-poppins"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FFD700] font-poppins"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FFD700] font-poppins"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FFD700] font-poppins"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FFD700] font-poppins"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FFD700] font-poppins"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">ZIP Code</label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FFD700] font-poppins"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-[#6D190D] text-white py-4 rounded-lg font-semibold hover:bg-[#8B2317] transition-colors font-poppins"
                  >
                    {donationAmount ? `Donate ₹${donationAmount}` : 'Make a Donation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Certificate & How We Use Your Donation */}
      <section className="py-20 bg-[#fcf9e3]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#222222] mb-4 font-playfair">Your Donation, Our Promise</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-poppins">
              Transparency and accountability are at the heart of how we use every contribution.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="text-3xl shrink-0">📜</div>
                <div>
                  <h3 className="text-xl font-bold text-[#6D190D] mb-2 font-playfair">Donation Certificate</h3>
                  <p className="text-gray-600 font-poppins">
                    After your donation, you will receive a donation certificate and official receipt by email for your records. This acknowledgement confirms your support and can be used for your personal documentation and financial planning.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="text-3xl shrink-0">🎯</div>
                <div>
                  <h3 className="text-xl font-bold text-[#6D190D] mb-2 font-playfair">Where Your Donation Goes</h3>
                  <p className="text-gray-600 font-poppins mb-3">
                    Your contribution directly supports our programmes: education, healthcare, livelihood, and community welfare. Funds are allocated to specific campaigns and events so you can see the impact of your generosity.
                  </p>
                  <p className="text-gray-600 font-poppins text-sm">
                    We publish annual reports and programme updates so you can see how donations are used across our initiatives.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="text-3xl shrink-0">📬</div>
                <div>
                  <h3 className="text-xl font-bold text-[#6D190D] mb-2 font-playfair">Stay Updated on Your Impact</h3>
                  <p className="text-gray-600 font-poppins mb-3">
                    We keep our donors informed about how their donation is used. You will receive updates linked to the campaigns and events your contribution supports—including stories, outcomes, and impact metrics.
                  </p>
                  <p className="text-gray-600 font-poppins text-sm">
                    For more information on a specific campaign or event, or to request a detailed impact report, contact us and we will be happy to share the latest updates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get in Touch CTA */}
      <section className="py-20">
        <div
          className="max-w-6xl mx-auto rounded-3xl overflow-hidden bg-center bg-cover relative"
          style={{ backgroundImage: "url('/images/donate-cta-bg.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 p-10 md:p-14 text-white">
            <div>
              <p className="font-poppins uppercase text-xs tracking-[0.25em] mb-3 text-[#FFD700]">
                Have Questions?
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-playfair">
                Talk to the Guru Akanksha Foundation team
              </h2>
              <p className="text-sm md:text-base text-gray-100 max-w-md font-poppins">
                If you would like more information about how we use donations, specific campaigns or events, or need
                help completing your contribution, our team is here to help you.
              </p>
            </div>
            <div className="flex items-center md:justify-end">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#FFD700] text-[#222222] font-semibold font-poppins shadow-lg hover:bg-[#f5c700] transition-colors"
              >
                Go to Contact Page
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donate;