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
      <section className="py-20 md:py-32 bg-white">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Grid for content (Image + Text/Stats) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left Column: Image and Statistics Cards */}
            <div className="relative">
              {/* Main Image */}
              <Image
                src={ABOUT_US_IMAGE}
                alt="Group of happy children"
                width={600}
                height={400}
                className="rounded-lg shadow-xl w-full h-auto object-cover"
              />

              {/* Statistics Cards Container - positioned absolutely at the bottom, overlapping */}
              <div 
                className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[90%] md:w-[80%] lg:w-[100%] xl:w-[90%] bg-[#f2e57f] p-4 sm:p-6 rounded-lg shadow-2xl grid grid-cols-3 gap-4 bg-opacity-80"
                // Applying Playfair Display to the entire stats container
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                
                {/* Statistic 1: Volunteers */}
                <div className="text-center">
                  {/* Statistics Numbers: Playfair Display 800, 30px, #6D190D */}
                  <p className="text-[30px] font-extrabold leading-[30px] text-[#6D190D]">4k+</p>
                  <p className="font-poppins text-sm sm:text-base text-gray-800 mt-1">Volunteers</p>
                </div>
                {/* Statistic 2: Camps */}
                <div className="text-center">
                  {/* Statistics Numbers: Playfair Display 800, 30px, #6D190D */}
                  <p className="text-[30px] font-extrabold leading-[30px] text-[#6D190D]">50+</p>
                  <p className="font-poppins text-sm sm:text-base text-gray-800 mt-1">Camps</p>
                </div>
                {/* Statistic 3: Participants */}
                <div className="text-center">
                  {/* Statistics Numbers: Playfair Display 800, 30px, #6D190D */}
                  <p className="text-[30px] font-extrabold leading-[30px] text-[#6D190D]">20k+</p>
                  <p className="font-poppins text-sm sm:text-base text-gray-800 mt-1">Participants</p>
                </div>

              </div>
            </div>

            {/* Right Column: About Us Text and Experience Box */}
            <div className="pt-24 lg:pt-0"> {/* Add padding top to prevent content being hidden by stats box */}
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

              {/* START: Combined Div for Impact List and Experience Box */}
              <div className="flex flex-col lg:flex-row gap-8 items-start mb-10">

                {/* Impact Areas List - Poppins Default */}
                <div className="font-poppins grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-gray-700 text-lg lg:w-2/3">
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

                {/* Years of Experience Box - Vertical Stacked, Centered, Fixed width (1/3rd) */}
                <div className="flex-shrink-0 p-6 rounded-lg shadow-md bg-opacity-80 bg-[#f2e57f] flex flex-col items-center justify-center w-full lg:w-1/3">
                  <div 
                    // Applying Playfair Display to the number
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {/* Increased size and used custom color for number */}
                    <p className="text-7xl font-black text-[#6D190D] leading-none">6</p>
                  </div>
                  <div className="text-center mt-2">
                    {/* Poppins for the descriptor text */}
                    <p className="font-poppins text-sm font-semibold uppercase tracking-wider text-gray-800">
                      Years <br /> Of Experience
                    </p>
                  </div>
                </div>

              </div>
              {/* END: Combined Div for Impact List and Experience Box */}

            </div>
          </div>
        </div>
      </section>   
    </div>
  );
};

export default AboutUs;