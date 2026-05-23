'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { siteInfo } from '@/lib/data';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Amenities', href: '#amenities' },
  { label: 'Availability', href: '#booking' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Location', href: '#location' },
  { label: 'Rules', href: '#policies' },
  { label: 'Contact', href: '#contact' }
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 backdrop-blur-xl transition-all duration-300 ${
        scrolled ? 'bg-black/80 shadow-soft' : 'bg-transparent'
      }`}
    >
      <div className="container flex items-center justify-between gap-6 py-4 lg:py-5">
        <a href="#home" className="flex flex-col gap-1 text-white">
          <span className="text-lg font-semibold tracking-[0.22em] uppercase">Hasmmat Residence</span>
          <span className="text-xs text-brand-300">Premium Leeds Stays</span>
        </a>
        <nav className="hidden items-center gap-4 text-sm text-brand-200 lg:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#booking"
          className="rounded-full border border-brand-300/30 bg-brand-400/10 px-5 py-3 text-sm font-semibold text-brand-100 transition hover:border-brand-100 hover:bg-brand-400/20"
        >
          Book Now
        </a>
      </div>
    </motion.header>
  );
}
