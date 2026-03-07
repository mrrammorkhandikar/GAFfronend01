'use client';

import React from 'react';
import Image from 'next/image';

const ACTION_IMAGE = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80';

const CallToAction = () => {
  // Styles for the Playfair Display font (used until Tailwind config is fully working)
  const playfairStyle = { fontFamily: "'Playfair Display', serif" };
  
  return (
    <section className="relative w-full h-[700px] overflow-hidden">
      {/* Background Image and Dark Overlay */}
      <Image
        src={ACTION_IMAGE}
        alt="Happy children reaching out"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40"
      style={{opacity:"40%"}}></div>

      {/* Content Container (Text, Video Button, Form) */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-between max-w-7xl sm:px-6 lg:px-8">
        
        {/* Left Side: Text and Video CTA */}
        <div className="w-full lg:w-1/2 text-white p-4">
          
          <p className="uppercase text-sm font-semibold tracking-wider text-[#FFD700] mb-3 font-poppins">
            Call to Action
          </p>

          <h1 
            className="text-4xl md:text-5xl font-black leading-tight mb-6" 
            style={playfairStyle}
          >
            Fundraising For People And Causes You Care About
          </h1>

          <p className="text-lg mb-12 max-w-lg font-poppins">
            Your contribution means a lot to us. It will change someone&apos;s life forever. Give them a reason to smile.
          </p>

        </div>

        {/* Right Side: Contact Form Card */}
        <div className="hidden lg:block w-[400px] p-10 rounded-xl shadow-2xl backdrop-blur-sm ">
          <h3 
            className="text-3xl font-black mb-8 text-white"
            style={playfairStyle}
          >
            Involve Yourself
          </h3>
          
          <form className="space-y-6">
            <input 
              type="text" 
              placeholder="Enter Name*" 
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FFD700] bg-white text-gray-800 font-poppins"
            />
            <input 
              type="email" 
              placeholder="Enter Email*" 
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FFD700] bg-white text-gray-800 font-poppins"
            />
            <input 
              type="tel" 
              placeholder="Enter Phone No.*" 
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FFD700] bg-white text-gray-800 font-poppins"
            />
            
            <button 
              type="submit" 
              className="w-full bg-[#6D190D] text-white font-semibold py-4 rounded-lg text-lg uppercase tracking-wider transition-colors duration-200 hover:bg-[#8B2317] shadow-md font-poppins"
            >
              Involve Now
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;