'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SiteApiService from '@/app/services/site-api';

const Donate = () => {
  const [donationAmount, setDonationAmount] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentTab, setPaymentTab] = useState('upi');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [campRes, payRes] = await Promise.all([
          SiteApiService.getPublicCampaignsList(),
          SiteApiService.getDonationPaymentInfo(),
        ]);
        if (!cancelled && campRes.success && campRes.data) {
          setCampaigns(Array.isArray(campRes.data) ? campRes.data : []);
        }
        if (!cancelled && payRes.success && payRes.data) {
          setPaymentInfo(payRes.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoadingCampaigns(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buildAddressLine = () => {
    const parts = [formData.address, formData.city, formData.state, formData.zip].filter(Boolean);
    return parts.join(', ') || null;
  };

  const openPaymentModal = (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);

    if (!campaignId) {
      alert('Please select a campaign to support.');
      return;
    }
    const amt = parseFloat(donationAmount);
    if (!donationAmount || Number.isNaN(amt) || amt < 1) {
      alert('Please enter a valid donation amount (minimum ₹1).');
      return;
    }
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      alert('Please fill in your name, email, and phone.');
      return;
    }

    setPaymentTab('upi');
    setShowPaymentModal(true);
  };

  const handleSubmitDonation = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const amt = parseFloat(donationAmount);
      const addressLine = buildAddressLine();
      const res = await SiteApiService.submitDonation({
        donorName: formData.name.trim(),
        donorEmail: formData.email.trim(),
        donorPhone: formData.phone.trim(),
        ...(addressLine ? { donorAddress: addressLine } : {}),
        amount: amt,
        currency: 'INR',
        campaignId,
        isAnonymous: false,
      });
      if (res.success) {
        setSubmitSuccess(true);
        setShowPaymentModal(false);
        setDonationAmount('');
        setCampaignId('');
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          zip: '',
        });
      } else {
        setSubmitError(res.message || 'Could not submit your donation. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setSubmitError('Something went wrong. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const qrSrc = paymentInfo?.upiQrUrl || '/images/donate-upi-qr.svg';

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative py-20 md:py-32 min-h-[320px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/images/campains/Healthy_Smile_For_Underprivileged_Children/titleImage.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="font-poppins uppercase text-sm font-semibold tracking-widest text-[#FFD700] mb-2">
              Make a Donation
            </p>
            <h1
              className="text-4xl md:text-5xl font-black text-white mb-6 font-playfair"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Your Support Creates Lasting Change
            </h1>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto font-poppins">
              Every contribution, no matter the size, helps us provide education, healthcare, and hope to those who
              need it most. Join us in making a difference today.
            </p>
          </div>
        </div>
      </section>

      {submitSuccess && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-4 text-center text-green-800 font-poppins text-sm">
          Thank you! Your donation request was submitted. Our team will verify your payment and email you once it is
          approved.
        </div>
      )}

      {/* Donation Form Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Donation Options */}
            <div>
              <h2 className="text-2xl font-bold text-[#222222] mb-6 font-playfair">Choose Your Donation</h2>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#222222] mb-4 font-poppins">Select Amount</h3>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {presetAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
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
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-poppins">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    placeholder="Enter custom amount"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FFD700] font-poppins"
                  />
                </div>
              </div>

              <div className="bg-[#fcf9e3] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#222222] mb-4 font-playfair">Your Impact</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#FFD700] rounded-full mr-3" />
                    <span className="text-gray-700 font-poppins">₹500 can provide health check-ups for 2 children</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#FFD700] rounded-full mr-3" />
                    <span className="text-gray-700 font-poppins">
                      ₹1000 can sponsor educational materials for 5 students
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#FFD700] rounded-full mr-3" />
                    <span className="text-gray-700 font-poppins">₹2000 can fund a hygiene awareness session</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Donor Information */}
            <div>
              <h2 className="text-2xl font-bold text-[#222222] mb-6 font-playfair">Your Information</h2>

              <form onSubmit={openPaymentModal} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                    Select campaign <span className="text-red-600">*</span>
                  </label>
                  <select
                    required
                    value={campaignId}
                    onChange={(e) => setCampaignId(e.target.value)}
                    disabled={loadingCampaigns}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FFD700] font-poppins bg-white"
                  >
                    <option value="">{loadingCampaigns ? 'Loading campaigns…' : '— Choose a campaign —'}</option>
                    {campaigns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

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

                {submitError && (
                  <p className="text-sm text-red-600 font-poppins">{submitError}</p>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-[#6D190D] text-white py-4 rounded-lg font-semibold hover:bg-[#8B2317] transition-colors font-poppins"
                  >
                    {donationAmount ? `Donate ₹${donationAmount}` : 'Make a Donation'}
                  </button>
                  <p className="mt-2 text-xs text-gray-500 font-poppins text-center">
                    You will see UPI and bank details to complete your transfer, then confirm with Done.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Payment modal */}
      {showPaymentModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          role="dialog"
          aria-modal="true"
          aria-labelledby="donate-modal-title"
        >
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 font-poppins">
            <h2 id="donate-modal-title" className="text-xl font-bold text-[#222222] font-playfair mb-1">
              Complete your payment
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Amount: <strong>₹{parseFloat(donationAmount || 0).toLocaleString('en-IN')}</strong>
            </p>

            <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-4">
              <button
                type="button"
                onClick={() => setPaymentTab('upi')}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                  paymentTab === 'upi' ? 'bg-[#6D190D] text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                UPI details
              </button>
              <button
                type="button"
                onClick={() => setPaymentTab('bank')}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors border-l border-gray-200 ${
                  paymentTab === 'bank' ? 'bg-[#6D190D] text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Bank details
              </button>
            </div>

            {paymentTab === 'upi' && (
              <div className="space-y-4 text-center">
                <div className="flex justify-center rounded-lg bg-gray-50 p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrSrc}
                    alt="UPI QR code"
                    className="max-w-[220px] w-full h-auto object-contain"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">UPI ID</p>
                  <p className="text-lg font-mono font-semibold text-[#222222] break-all">
                    {paymentInfo?.upiId || '— Set DONATION_UPI_ID on server —'}
                  </p>
                </div>
              </div>
            )}

            {paymentTab === 'bank' && (
              <div className="space-y-3 text-sm">
                {paymentInfo?.bankName && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Bank name</p>
                    <p className="font-semibold text-[#222222]">{paymentInfo.bankName}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 uppercase">Account number</p>
                  <p className="font-mono font-semibold text-[#222222] break-all">
                    {paymentInfo?.bankAccount || '— Set DONATION_BANK_ACCOUNT —'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">IFSC code</p>
                  <p className="font-mono font-semibold text-[#222222]">{paymentInfo?.bankIfsc || '— Set DONATION_BANK_IFSC —'}</p>
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-4">
              After you have sent the payment, click <strong>Done</strong> so we can match it to your details. An admin
              will verify and approve your donation.
            </p>

            {submitError && (
              <p className="mt-3 text-sm text-red-600 font-poppins">{submitError}</p>
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmitDonation}
                className="flex-1 py-3 rounded-lg bg-[#6D190D] text-white font-semibold hover:bg-[#8B2317] disabled:opacity-60"
              >
                {submitting ? 'Submitting…' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

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
                    After your donation is approved, you will receive a confirmation email and can request an official
                    receipt for your records.
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
                    Your contribution directly supports our programmes: education, healthcare, livelihood, and community
                    welfare. You choose the campaign your gift supports.
                  </p>
                  <p className="text-gray-600 font-poppins text-sm">
                    We publish annual reports and programme updates so you can see how donations are used across our
                    initiatives.
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
                    We keep our donors informed about how their donation is used, including stories linked to the
                    campaigns you support.
                  </p>
                  <p className="text-gray-600 font-poppins text-sm">
                    For more information, contact us and we will be happy to share the latest updates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div
          className="max-w-6xl mx-auto rounded-3xl overflow-hidden bg-center bg-cover relative"
          style={{ backgroundImage: "url('/images/Aboutus/Aboutuspage.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/60 pointer-events-none" />
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 p-10 md:p-14 text-white">
            <div>
              <p className="font-poppins uppercase text-xs tracking-[0.25em] mb-3 text-[#FFD700]">Have Questions?</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-playfair">Talk to the Guru Akanksha Foundation team</h2>
              <p className="text-sm md:text-base text-gray-100 max-w-md font-poppins">
                If you would like more information about how we use donations, specific campaigns or events, or need help
                completing your contribution, our team is here to help you.
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
