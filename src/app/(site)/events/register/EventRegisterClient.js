'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import SiteApiService from '@/app/services/site-api';
import { isRegistrationEnabled } from '@/lib/eventRegistration';

export default function EventRegisterClient() {
  const searchParams = useSearchParams();
  const eventParam = searchParams.get('event');

  const [ev, setEv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [feeAmount, setFeeAmount] = useState('');
  const [paymentInfo, setPaymentInfo] = useState(null);
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

  useEffect(() => {
    if (!eventParam) {
      setPageError('No event selected. Please open registration from the events page.');
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await SiteApiService.getEvent(eventParam);
        if (cancelled) return;
        if (!res.success || !res.data) {
          setPageError(res.message || 'Event not found');
          setLoading(false);
          return;
        }
        const e = res.data;
        setEv(e);
        const fee = Number(e.registrationFee) || 0;
        setFeeAmount(fee > 0 ? String(fee) : '0');

        if (!isRegistrationEnabled(e.registrationEnabled)) {
          setPageError('Registration is not open for this event.');
        } else if (!e.isActive) {
          setPageError('This event is not active.');
        } else if (e.eventDate && new Date(e.eventDate) < new Date()) {
          setPageError('This event has already taken place.');
        }

        const payRes = await SiteApiService.getDonationPaymentInfo();
        if (!cancelled && payRes.success && payRes.data) {
          setPaymentInfo(payRes.data);
        }
      } catch {
        if (!cancelled) setPageError('Could not load this event.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [eventParam]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const buildAddressLine = () => {
    const parts = [formData.address, formData.city, formData.state, formData.zip].filter(Boolean);
    return parts.join(', ') || null;
  };

  const validateForm = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      alert('Please fill in your name, email, and phone.');
      return false;
    }
    return true;
  };

  const submitPayload = async () => {
    const amt = parseFloat(String(feeAmount).replace(/,/g, ''));
    const addressLine = buildAddressLine();
    const res = await SiteApiService.submitEventRegistration({
      eventId: ev.id,
      name: formData.name.trim(),
      email: formData.email.trim(),
      mobile: formData.phone.trim(),
      ...(addressLine ? { address: addressLine } : {}),
      amount: Number.isNaN(amt) ? 0 : amt,
      currency: 'INR',
    });
    if (res.success) {
      setSubmitSuccess(true);
      setShowPaymentModal(false);
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
      setSubmitError(res.message || 'Could not submit registration.');
    }
  };

  const onFormContinue = (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validateForm()) return;
    const fee = Number(ev?.registrationFee) || 0;
    if (fee > 0) {
      setPaymentTab('upi');
      setShowPaymentModal(true);
    } else {
      (async () => {
        setSubmitting(true);
        setSubmitError('');
        try {
          await submitPayload();
        } catch (err) {
          console.error(err);
          setSubmitError('Something went wrong. Please try again.');
        } finally {
          setSubmitting(false);
        }
      })();
    }
  };

  const onModalDone = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      await submitPayload();
    } catch (err) {
      console.error(err);
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const qrSrc = paymentInfo?.upiQrUrl || '/images/donate-upi-qr.svg';
  const fee = Number(ev?.registrationFee) || 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 font-poppins">Loading…</p>
      </div>
    );
  }

  if (!ev && pageError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <p className="text-gray-800 font-poppins text-center mb-4">{pageError}</p>
        <Link href="/events" className="text-[#6D190D] font-semibold hover:underline font-poppins">
          Back to events
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section
        className="relative py-16 md:py-24 min-h-[240px] bg-cover bg-center"
        style={{ backgroundImage: "url('/images/campains/helpforpoorfamilies.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <p className="font-poppins uppercase text-sm font-semibold tracking-widest text-[#FFD700] mb-2">Event registration</p>
          <h1 className="text-3xl md:text-4xl font-black font-playfair mb-2">{ev.title}</h1>
          <p className="font-poppins text-gray-100 text-sm md:text-base max-w-2xl mx-auto">
            Complete the form below. {fee > 0 ? 'After paying the fee via UPI or bank, click Done to submit.' : 'There is no fee for this event.'}
          </p>
        </div>
      </section>

      {submitSuccess && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-4 text-center text-green-800 font-poppins text-sm">
          Thank you! Your registration was submitted. Our team will verify payment if applicable and email you once it is approved.
        </div>
      )}

      {pageError && ev && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 text-center text-amber-900 font-poppins text-sm">{pageError}</div>
      )}

      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-[#222222] mb-4 font-playfair">Registration fee</h2>
              <p className="text-3xl font-bold text-[#6D190D] font-poppins mb-2">
                {fee > 0 ? `₹${fee.toLocaleString('en-IN')}` : 'Free'}
              </p>
              <p className="text-sm text-gray-600 font-poppins">
                Amount is set by the organiser and must match your payment when a fee applies.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-[#222222] mb-6 font-playfair">Your details</h2>
              <form onSubmit={onFormContinue} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">Full name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={!!pageError}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FFD700] font-poppins disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={!!pageError}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FFD700] font-poppins disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    disabled={!!pageError}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FFD700] font-poppins disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!!pageError}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FFD700] font-poppins disabled:bg-gray-100"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={!!pageError}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FFD700] font-poppins disabled:bg-gray-100"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    disabled={!!pageError}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FFD700] font-poppins disabled:bg-gray-100"
                  />
                  <input
                    type="text"
                    name="zip"
                    placeholder="PIN"
                    value={formData.zip}
                    onChange={handleInputChange}
                    disabled={!!pageError}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FFD700] font-poppins disabled:bg-gray-100"
                  />
                </div>
                {submitError && <p className="text-sm text-red-600 font-poppins">{submitError}</p>}
                <button
                  type="submit"
                  disabled={!!pageError || submitting}
                  className="w-full bg-[#6D190D] text-white py-3 rounded-lg font-semibold hover:bg-[#8B2317] transition-colors font-poppins disabled:opacity-50"
                >
                  {fee > 0 ? 'Continue to payment' : 'Submit registration'}
                </button>
                <p className="text-xs text-gray-500 font-poppins text-center">
                  <Link href={`/events/${ev.slug || ev.id}`} className="text-[#6D190D] hover:underline">
                    ← Back to event
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {showPaymentModal && fee > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 font-poppins">
            <h2 className="text-xl font-bold text-[#222222] font-playfair mb-1">Complete your payment</h2>
            <p className="text-sm text-gray-600 mb-4">
              Amount: <strong>₹{parseFloat(feeAmount || 0).toLocaleString('en-IN')}</strong>
            </p>

            <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-4">
              <button
                type="button"
                onClick={() => setPaymentTab('upi')}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                  paymentTab === 'upi' ? 'bg-[#6D190D] text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                UPI
              </button>
              <button
                type="button"
                onClick={() => setPaymentTab('bank')}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors border-l border-gray-200 ${
                  paymentTab === 'bank' ? 'bg-[#6D190D] text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Bank
              </button>
            </div>

            {paymentTab === 'upi' && (
              <div className="space-y-4 text-center">
                <div className="flex justify-center rounded-lg bg-gray-50 p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrSrc} alt="UPI QR code" className="max-w-[220px] w-full h-auto object-contain" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">UPI ID</p>
                  <p className="text-lg font-mono font-semibold text-[#222222] break-all">
                    {paymentInfo?.upiId || '—'}
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
                  <p className="font-mono font-semibold text-[#222222] break-all">{paymentInfo?.bankAccount || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">IFSC</p>
                  <p className="font-mono font-semibold text-[#222222]">{paymentInfo?.bankIfsc || '—'}</p>
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-4">
              After you have sent the payment, click <strong>Done</strong> so we can match it to your registration.
            </p>

            {submitError && <p className="mt-3 text-sm text-red-600">{submitError}</p>}

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
                onClick={onModalDone}
                className="flex-1 py-3 rounded-lg bg-[#6D190D] text-white font-semibold hover:bg-[#8B2317] disabled:opacity-60"
              >
                {submitting ? 'Submitting…' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
