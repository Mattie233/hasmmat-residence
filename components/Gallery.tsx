'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { galleryImages } from '@/lib/data';

export function Gallery() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="gallery" className="container py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 inline-flex rounded-full border border-brand-300/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.27em] text-brand-200">
          Curated property showcase
        </p>
        <h2 className="text-4xl font-semibold text-white">A visual story of space, design and comfort.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-brand-200">
          Explore the rooms and shared spaces with elegant layouts, premium finishes, and warm hospitality styling.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {galleryImages.map((photo, index) => (
          <motion.button
            key={photo.title}
            onClick={() => setActive(index)}
            whileHover={{ y: -6 }}
            className="group overflow-hidden rounded-[2rem] border border-white/10 bg-black/50 shadow-soft"
          >
            <div className="relative h-72 w-full">
              <Image
                src={photo.src}
                alt={photo.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <div className="border-t border-white/10 px-5 py-4 text-left">
              <p className="text-xs uppercase tracking-[0.3em] text-brand-300">{photo.category}</p>
              <h3 className="mt-2 text-lg font-semibold text-white">{photo.title}</h3>
            </div>
          </motion.button>
        ))}
      </div>

      {active !== null ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
          <button
            onClick={() => setActive(null)}
            className="absolute right-6 top-6 rounded-full border border-white/20 bg-black/70 px-4 py-2 text-sm text-white"
          >
            Close
          </button>
          <div className="relative h-full w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-black/80 shadow-soft">
            <Image
              src={galleryImages[active].src}
              alt={galleryImages[active].title}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
              <h3 className="text-2xl font-semibold text-white">{galleryImages[active].title}</h3>
              <p className="mt-2 text-sm text-brand-100/90">{galleryImages[active].category}</p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
