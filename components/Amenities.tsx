'use client';

import { motion } from 'framer-motion';
import { amenities } from '@/lib/data';

const iconMap: Record<string, string> = {
  'Fast WiFi': '⚡',
  'Smart TV': '📺',
  'Fully Equipped Kitchen': '🍳',
  'Workspace Desk': '💼',
  'Washing Machine': '🧺',
  'Free Parking': '🚗',
  'Self Check-in': '🔐',
  'Fresh Linen': '🛏️'
};

export function Amenities() {
  return (
    <section id="amenities" className="container py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 inline-flex rounded-full border border-brand-300/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.27em] text-brand-200">
          Premium amenities
        </p>
        <h2 className="text-4xl font-semibold text-white">Designed for premium comfort and seamless stays</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-brand-200">
          A complete serviced accommodation experience for families, contractors, professionals and groups visiting Leeds.
        </p>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {amenities.map((item) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="group rounded-[2rem] border border-white/10 bg-black/50 p-7 text-brand-100 shadow-soft backdrop-blur-xl"
          >
            <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-brand-400/10 text-2xl">
              {iconMap[item.title] ?? '✔️'}
            </div>
            <h3 className="mb-3 text-xl font-semibold text-white">{item.title}</h3>
            <p className="text-sm leading-7 text-brand-200">{item.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
