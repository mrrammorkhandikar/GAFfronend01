'use client';

import React from 'react';
import Image from 'next/image';

const EventCard = ({ imagePath, title, time, location, description, dateDay, dateMonth }) => {
  // Styles for the Playfair Display font (used until Tailwind config is fully working)
  const playfairStyle = { fontFamily: "'Playfair Display', serif" };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-xl transform transition duration-300 hover:shadow-2xl h-[400px]">
      {/* Event Image - used as background for the card area */}
      <Image
        src={imagePath}
        alt={title}
        fill
        className="object-cover rounded-2xl"
      />
      
      {/* Content Overlay */}
      <div className="absolute inset-0 bg-black/40 p-6 rounded-2xl flex flex-col justify-end">
        
        {/* Date Badge (Absolutely Positioned) */}
        <div className="absolute top-6 right-6 w-16 h-16 bg-[#FFD700] rounded-lg flex flex-col items-center justify-center shadow-lg" style={playfairStyle}>
          <span className="text-xl font-extrabold text-[#6D190D] leading-none">{dateDay}</span>
          <span className="text-sm font-semibold text-[#6D190D] uppercase leading-none">{dateMonth}</span>
        </div>

        {/* Event Title (Playfair Display) */}
        <h3 className="text-2xl font-black text-white mb-2" style={playfairStyle}>
          {title}
        </h3>

        {/* Time and Location (Poppins Default) */}
        <div className="flex items-center space-x-4 text-white text-sm mb-3 font-poppins">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {time}
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            {location}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-200 mb-6 font-poppins">
          {description}
        </p>

        {/* View Details Button */}
        <button className="w-32 py-2 text-sm font-semibold rounded-full text-gray-800 bg-[#FFD700] transition-colors duration-200 hover:bg-[#E6C300] shadow-md hover:shadow-lg font-poppins">
          View Details
        </button>
      </div>
    </div>
  );
};

export default EventCard;