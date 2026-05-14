'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { heroSlides } from '@/lib/data';

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => setIndex((prev) => (prev + 1) % heroSlides.length), 6000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative overflow-hidden pt-24">
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-x-0 top-10 h-72 bg-gradient-to-b from-brand-700/80 to-transparent blur-3xl" />
      <div className="container relative min-h-[calc(100vh-96px)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroSlides[index].title}
            initial={{ opacity: 0.12 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            <Image
              src={heroSlides[index].image}
              alt={heroSlides[index].title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="relative flex min-h-[70vh] flex-col justify-end gap-8 pb-16 text-white">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="max-w-3xl"
          >
            <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.3em] text-brand-200 shadow-soft">
              Luxury serviced accommodation in Leeds
            </p>
            <h1 className="text-5xl font-semibold leading-tight lg:text-6xl">
              Luxury 4 Bedroom Stay in Leeds
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-brand-100/90">
              Sleeps 8 • Free Parking • Fast WiFi • Near Elland Road. Book direct for the best rate and a boutique Leeds stay.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#booking"
                className="inline-flex items-center justify-center rounded-full bg-brand-400 px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand-300"
              >
                Book Direct
              </a>
              <a
                href="#gallery"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-3 text-sm text-brand-100 transition hover:border-brand-300 hover:text-white"
              >
                View Gallery
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="grid gap-4 rounded-3xl border border-white/10 bg-black/50 p-6 shadow-soft backdrop-blur-xl md:grid-cols-2 lg:max-w-4xl"
          >
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Availability</p>
              <p className="mt-3 text-2xl font-semibold">Early summer slots available — secure your stay today.</p>
            </div>
            <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-brand-100">
              <div className="flex items-center justify-between">
                <span>Guest Capacity</span>
                <strong>Up to 8 guests</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Free Parking</span>
                <strong>Free street parking</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>High-speed WiFi</span>
                <strong>900 Mbps + WiFi Mesh</strong>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
