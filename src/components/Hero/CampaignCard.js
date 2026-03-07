'use client';

import React from 'react';
import Image from 'next/image';

// Reusable Card Component for a single campaign
const CampaignCard = ({ imageSrc, title, raised, remaining, goal, progress }) => {
  // Use a softer yellow for the card background
  const cardBgColor = 'bg-white'; // Very light yellow/cream for the card background
  
  return (
    <div className={`rounded-xl shadow-lg overflow-hidden border border-gray-100 ${cardBgColor} w-124`}>
      {/* Campaign Image */}
      <div className="h-80 overflow-hidden rounded-2xl relative">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover rounded-t-xl"
        />
      </div>

      <div className="p-6">
        {/* Campaign Title: Playfair Display 900, Large Text */}
        <h3 
          className="text-xl md:text-2xl font-black text-[#222222] mb-4 text-center"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {title}
        </h3>

        {/* Financial Details */}
        <div className="grid grid-cols-3 text-center border-y border-gray-200 py-3 mb-6">
          
          {/* Raised */}
          <div className="flex flex-col items-center justify-center border-r border-gray-200">
            <span className="font-poppins text-xs uppercase text-gray-500 font-medium">Raised</span>
            <span className="text-lg font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>{raised}</span>
          </div>
          
          {/* Remaining */}
          <div className="flex flex-col items-center justify-center border-r border-gray-200">
            <span className="font-poppins text-xs uppercase text-gray-500 font-medium">Remaining</span>
            <span className="text-lg font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>{remaining}</span>
          </div>
          
          {/* Goal/Target */}
          <div className="flex flex-col items-center justify-center">
            <span className="font-poppins text-xs uppercase text-gray-500 font-medium">Goal</span>
            <span className="text-lg font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>{goal}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-8 relative px-10">
          <div 
            className="h-4 rounded-full bg-[#FFD700] absolute left-0" 
            style={{ width: `${progress}%` }}
          >
            <span className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-[#FFD700] text-gray-800 text-xs font-bold px-2 rounded-full font-poppins">
              Raised Funds {progress}%
            </span>
          </div>
          {/* Progress Percentage Text */}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button className="bg-[#FFD700] text-gray-800 font-poppins font-semibold px-6 py-2 rounded-full hover:bg-[#E6C300] transition-colors shadow-md">
            Donate Now
          </button>
          <button className="border-2 border-[#FFD700] text-[#D4A71C] font-poppins font-semibold px-6 py-2 rounded-full hover:bg-[#FFD700] hover:text-gray-800 transition-colors shadow-md">
            Program Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;