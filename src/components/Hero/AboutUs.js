'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Image path for the main about us image
const ABOUT_US_IMAGE = '/images/Aboutus/Aboutushome.jpg';

const AboutUs = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-0 md:py-32 bg-white">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Grid for content (Image + Text/Stats) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left Column: Image */}
            <div className="relative">
              <Image
                src={ABOUT_US_IMAGE}
                alt="Group of happy children"
                width={600}
                height={400}
                className="rounded-lg shadow-xl w-full h-auto object-cover"
              />
            </div>

            {/* Right Column: About Us Text */}
            <div className="lg:pt-0">
              {/* Header - Poppins Default */}
              <p className="font-poppins uppercase text-sm font-semibold tracking-widest text-[#D4A71C] mb-2">
                About Us
              </p>
              
              {/* Main Heading: Playfair Display 900, 32px, #222222 */}
              <h2 
                className="text-[32px] font-black leading-[38px] text-[#222222] mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Our work promise to uphold the trust placed
              </h2>

              {/* Description - Poppins Default */}
              <p className="font-poppins text-gray-600 text-lg mb-8 max-w-xl">
                We conduct various healthcare awareness programs at multiple locations for underprivileged folks
              </p>
              
              <div className="mt-8">
                <motion.a 
                  href="/careers"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-colors font-poppins inline-block"
                >
                  Join Us
                </motion.a>
              </div>

              <div className="flex flex-col lg:flex-row gap-8 items-start mb-10">
                <div className="font-poppins grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-gray-700 text-lg w-full">
                  <p className="flex items-center">
                    <svg className="w-5 h-5 text-[#FFD700] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Schools
                  </p>
                  <p className="flex items-center">
                    <svg className="w-5 h-5 text-[#FFD700] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Community Centres
                  </p>
                  <p className="flex items-center">
                    <svg className="w-5 h-5 text-[#FFD700] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    NGOs, Shelter homes
                  </p>
                  <p className="flex items-center">
                    <svg className="w-5 h-5 text-[#FFD700] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Rural Areas
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>   
    </div>
  );
};

export default AboutUs;