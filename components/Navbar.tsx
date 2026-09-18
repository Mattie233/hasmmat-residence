'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Accommodation', href: '/accommodation' },
  { label: 'Family Stays', href: '/accommodation-near-elland-road' },
  { label: 'Contractor Stays', href: '/contractor-accommodation-leeds' },
  { label: 'Group Stays', href: '/group-accommodation-leeds' },
  { label: 'Location', href: '/location' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'House Rules', href: '/house-rules' }
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
        <a href="/" className="flex flex-col gap-1 text-white">
          <span className="text-lg font-semibold tracking-[0.22em] uppercase">Hasmmat Residence</span>
          <span className="text-xs text-brand-300">Stylish Leeds Stays</span>
        </a>
        <nav className="hidden items-center gap-4 text-sm text-brand-200 lg:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          aria-label="Open navigation menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xl text-white lg:hidden"
        >
          <span aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
        </button>
        <a
          href="/enquire"
          className="rounded-full border border-brand-300/30 bg-brand-400/10 px-5 py-3 text-sm font-semibold text-brand-100 transition hover:border-brand-100 hover:bg-brand-400/20"
        >
          Send an Enquiry
        </a>
      </div>
      {menuOpen ? (
        <nav className="border-t border-white/10 bg-black/95 px-6 py-5 lg:hidden">
          <div className="container grid gap-2 text-sm text-brand-100">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="rounded-2xl px-4 py-3 transition hover:bg-white/5 hover:text-white">
                {link.label}
              </a>
            ))}
            <a href="/enquire" className="mt-2 rounded-2xl bg-brand-400 px-4 py-3 text-center font-semibold text-white">
              Send an Enquiry
            </a>
          </div>
        </nav>
      ) : null}
    </motion.header>
  );
}
