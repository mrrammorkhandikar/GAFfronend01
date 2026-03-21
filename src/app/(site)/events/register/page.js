import { Suspense } from 'react';
import EventRegisterClient from './EventRegisterClient';

export const metadata = {
  title: 'Register for event | Global Aid Foundation',
  description: 'Complete your event registration with Guru Akanksha Foundation.',
};

function RegisterFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-600 font-poppins">Loading…</p>
    </div>
  );
}

export default function EventRegisterPage() {
  return (
    <Suspense fallback={<RegisterFallback />}>
      <EventRegisterClient />
    </Suspense>
  );
}
