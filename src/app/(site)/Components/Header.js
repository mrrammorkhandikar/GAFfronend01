'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHomepage = pathname === '/';

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    // Set initial scroll state after mount to prevent hydration mismatch
    const timer = setTimeout(() => {
      setScrolled(window.scrollY > 50);
    }, 0);
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/60 shadow-md backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.img
              src="/images/GAF_Website_logo-removebg.png"
              alt="Guru Akanksha Foundation"
              className="h-10 w-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center font-poppins">
            {["HOME", "ABOUT", "CAMPAIGNS", "EVENTS", "PARTNERS", "CAREERS"].map((item, index) => (
              <motion.a
                key={item}
                href={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
                // Force update for hydration mismatch fix
                className={`text-sm font-medium transition-colors text-black hover:text-yellow-600`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
              >
                {item}
              </motion.a>
            ))}

            <motion.button
              className="px-5 py-2 rounded-md text-sm font-semibold transition-all bg-yellow-500 text-black hover:bg-yellow-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/donate'}
            >
              DONATE NOW
            </motion.button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md focus:outline-none ${
                scrolled
                  ? "text-gray-700 hover:text-black"
                  : "text-yellow-400"
              }`}
            >
              {!isOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu with Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`md:hidden font-poppins shadow-lg backdrop-blur-md ${
              scrolled || !isHomepage ? "bg-white/90" : "bg-black/90"
            }`}
          >
            <div className="px-4 pt-3 pb-5 space-y-3">
              {["HOME", "ABOUT", "CAMPAIGNS", "EVENTS", "PARTNERS", "CAREERS"].map((item) => (
                <a
                  key={item}
                  href={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    scrolled || !isHomepage
                      ? "text-gray-700 hover:text-black hover:bg-gray-50/50"
                      : "text-white hover:text-yellow-400"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button
                className="w-full px-4 py-2 rounded-md text-base font-semibold bg-yellow-500 text-black hover:bg-yellow-600 shadow-sm"
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = '/donate';
                }}
              >
                DONATE NOW
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
