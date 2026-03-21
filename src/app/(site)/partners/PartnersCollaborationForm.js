'use client';

import { useState } from 'react';
import SiteApiService from '@/app/services/site-api';

const INTEREST_OPTIONS = [
  { value: '', label: 'How would you like to collaborate?' },
  { value: 'Host a health camp', label: 'Host a health camp' },
  { value: 'Run awareness sessions', label: 'Run awareness sessions' },
  { value: 'Support education programs', label: 'Support education programs' },
  { value: 'CSR / funding support', label: 'CSR / funding support' },
  { value: 'Volunteer as an individual', label: 'Volunteer as an individual' },
];

export default function PartnersCollaborationForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedDetails = details.trim();

    if (!trimmedName) {
      setError('Please enter your name or organization.');
      return;
    }
    if (!trimmedEmail) {
      setError('Please enter your email so we can reply.');
      return;
    }

    const interestLabel =
      INTEREST_OPTIONS.find((o) => o.value === interest)?.label || 'General enquiry';
    const subject =
      interest && interestLabel !== 'How would you like to collaborate?'
        ? `Partners page — ${interest}`
        : 'Partners page — Collaboration enquiry';

    const message = [
      '[Submitted from Partners page]',
      '',
      `Interest: ${interest || 'Not specified'}`,
      '',
      'Additional details:',
      trimmedDetails || '(none)',
      '',
      `— ${trimmedName}`,
    ].join('\n');

    setLoading(true);
    try {
      const result = await SiteApiService.submitContactForm({
        name: trimmedName,
        email: trimmedEmail,
        subject,
        message,
      });
      if (result.success) {
        setSuccess(true);
        setName('');
        setEmail('');
        setInterest('');
        setDetails('');
      } else {
        setError(result.message || 'Could not send. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm font-semibold text-[#222222] font-poppins">
          Tell us how you&apos;d like to collaborate:
        </p>
        <div className="space-y-3 text-xs font-poppins">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
            placeholder="Your name or organization"
            autoComplete="name"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
            placeholder="Email / phone"
            autoComplete="email"
          />
          <select
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
          >
            {INTEREST_OPTIONS.map((o) => (
              <option key={o.value || 'empty'} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <textarea
            rows={3}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
            placeholder="Share a few lines about your idea or context (optional)"
          />
        </div>
        {error && (
          <p className="text-[10px] text-red-600 font-poppins" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="text-[10px] text-green-700 font-poppins">
            Thank you — your message was sent. We will get back to you soon.
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg bg-[#6D190D] text-white text-sm font-semibold font-poppins hover:bg-[#8B2317] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending…' : 'Send message'}
        </button>
      </form>
    </div>
  );
}
