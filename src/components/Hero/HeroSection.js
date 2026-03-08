'use client';

import React from 'react';

import Link from 'next/link';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <div className="relative w-full h-screen">
      {/* Background Image */}
      <Image
        src="/images/home-hero-ba-image.jpg"
        alt="Guru Akanksha Foundation Background"
        fill
        className="object-cover"
        priority
      />

      {/* Black overlay mask */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        {/* Logo */}
        <Image
          src="/images/GAF_Website_logo-removebg.png"
          alt="Guru Akanksha Foundation Logo"
          width={300}
          height={100}
          className="w-60 md:w-72 mb-8 h-auto"
        />

        {/* Heading */}
        <h2 className="uppercase text-sm md:text-base tracking-wider mb-3 font-poppins">
          Donate to contribute
        </h2>

        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 font-playfair"
        style={{ fontFamily: "'Playfair Display', serif" }}>
          let&apos;s spread holistic<br />healthcare together
        </h1>

        <p className="text-lg md:text-xl mb-10 font-poppins">
          that begins with good oral hygiene
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/donate"
            className="bg-yellow-500 text-black font-semibold px-8 py-3 rounded-full text-lg hover:bg-yellow-600 transition-all font-poppins inline-block text-center"
          >
            Donate Funds
          </Link>
          <Link 
            href="/campaigns" 
            className="border-2 border-yellow-500 text-yellow-500 font-semibold px-8 py-3 rounded-full text-lg hover:bg-yellow-500 hover:text-black transition-all font-poppins inline-block text-center"
          >
            Campaigns
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;