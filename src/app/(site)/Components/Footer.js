'use client';

import React from "react";
import Link from "next/link";
import { Mail, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#FFFBEF] border-t border-gray-200 py-12 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
        {/* About */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 font-poppins">About GAF</h3>
          <p className="text-gray-700 leading-relaxed font-poppins">
            We are a not-for-profit organization working towards holistic healthcare development, 
            integrating the latest AI and technology to improve lives. 
            All our projects are driven by evidence-based research.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 font-poppins">Get in Touch</h3>
          <div className="flex flex-col items-center md:items-start text-gray-700 space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-yellow-600" />
              <p className="font-poppins">guruuakanksha2019@gmail.com</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3 font-poppins">
            Become a Volunteer
          </h3>
          <p className="text-gray-700 font-poppins">guruuakanksha2019@gmail.com</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-12 border-t border-gray-300 pt-6 text-center">
        <div className="flex justify-center space-x-6 mb-4">
          <a
            href="#"
            className="text-gray-500 hover:text-yellow-600 transition-colors"
            aria-label="Facebook"
          >
            <Facebook size={20} />
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-yellow-600 transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={20} />
          </a>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 mb-4">
          <Link href="/about" className="hover:text-yellow-600 transition-colors px-2 py-1 font-poppins">About Us</Link>
          <Link href="/campaigns" className="hover:text-yellow-600 transition-colors px-2 py-1 font-poppins">Campaigns</Link>
          <Link href="/events" className="hover:text-yellow-600 transition-colors px-2 py-1 font-poppins">Events</Link>
          <Link href="/careers" className="hover:text-yellow-600 transition-colors px-2 py-1 font-poppins">Careers</Link>
        </div>
        <p className="text-sm text-gray-600 font-poppins">
          © 2024 Guru Akanksha Foundation. All rights reserved.
        </p>
        <p className="text-xs text-gray-500 mt-1 font-poppins">
          Designed with ❤️ by the GAF Web Team
        </p>
      </div>
    </footer>
  );
};

export default Footer;