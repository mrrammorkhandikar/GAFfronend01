'use client';

import React from 'react';
import Image from 'next/image';

// Define the paths to your custom icon images
const ICON_PATHS = {
  // Use the people icon for Volunteer and Partner
  people: '/images/Png/getinvolvedpeople.png',
  // Use the donate icon for Donate to Support
  donate: '/images/Png/GetinvolvedDonate.png',
};

const Card = ({ iconPath, title, description, buttonText, buttonLink }) => (
  <div className="bg-white p-6 md:p-10 border border-gray-100 shadow-md transition-shadow duration-300 hover:shadow-xl rounded-lg flex flex-col items-center text-center max-w-sm mx-auto h-full">
    {/* Icon Container - Using <img> for the custom PNGs */}
    <div className="mb-6 relative w-16 h-16 sm:w-20 sm:h-20 mx-auto">
      {/* The width and height are set to match the large size shown in the image.
        We use object-contain to ensure the image scales properly if the container size is tweaked.
      */}
      <Image 
        src={iconPath}
        alt={`${title} icon`}
        fill
        className="object-contain"
      />
    </div>

    {/* Title */}
    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 font-playfair">
      {title}
    </h3>

    {/* Description */}
    <p className="text-gray-600 mb-8 flex-grow font-poppins">
      {description}
    </p>

    {/* CTA Button - Solid Yellow Style */}
    <a
      href={buttonLink}
      // Note: The button color is based on the image's yellow tone.
      className="inline-block py-3 px-8 text-sm font-semibold uppercase tracking-wider rounded-md text-gray-800 bg-[#FFD700] transition-colors duration-200 hover:bg-[#E6C300] shadow-md hover:shadow-lg font-poppins"
    >
      {buttonText}
    </a>
  </div>
);

const GetInvolved = () => {
  // Define the data for the three cards, now using the icon paths
  const cardsData = [
    {
      iconPath: ICON_PATHS.people,
      title: 'Become A Volunteer',
      description:
        'Contribute by joining as a volunteer for online or offline campaigns. You may have the skills that we are looking for.',
      buttonText: 'Join us now',
      buttonLink: '/volunteer', 
    },
    {
      iconPath: ICON_PATHS.donate,
      title: 'Donate to Support',
      description:
        'Every donation is used in improving the healthcare programs. Your donations will help us spread more smiles.',
      buttonText: 'Donate now',
      buttonLink: '/donate', 
    },
    {
      iconPath: ICON_PATHS.people,
      title: 'Become A Partner',
      description:
        'If you are an organization looking to partner with us and serve the cause, we are happy to collaborate with you.',
      buttonText: 'Contact now',
      buttonLink: '/partner', 
    },
  ];

  return (
    // Section Container: Uses the soft cream background (#FFFBEF) and generous vertical padding
    <section className="py-20 md:py-32 bg-[#fcf9e3]">
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Content */}
          <div className="text-center mb-12 md:mb-16">
            <p className="uppercase text-sm font-semibold tracking-widest text-[#D4A71C] mb-2 font-poppins">
              Get Involved
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight font-playfair"
            style={{ fontFamily: "'Playfair Display', serif" }}>
              Let&apos;s Make a Difference Today!
            </h2>
          </div>

          {/* Three-Column Grid for Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-12">
            {cardsData.map((card, index) => (
              <Card key={index} {...card} />
            ))}
          </div>
        </div>
        
        {/* Scroll to top arrow - matching the position in the original image */}
        <div className="fixed bottom-4 right-4 z-10">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll to top"
            className="bg-white p-2 rounded-full shadow-lg border border-gray-200 text-gray-600 hover:text-[#FFD700] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default GetInvolved;