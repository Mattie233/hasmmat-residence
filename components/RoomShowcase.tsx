'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { roomShowcase } from '@/lib/data';

export function RoomShowcase() {
  return (
    <section id="showcase" className="container py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 inline-flex rounded-full border border-brand-300/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.27em] text-brand-200">
          Room features
        </p>
        <h2 className="text-4xl font-semibold text-white">Spaces crafted for work, rest and memorable group stays</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-brand-200">
          Each area of the house is styled for premium comfort, from cosy bedrooms to smart entertainment zones.
        </p>
      </div>

      <div className="mt-14 space-y-10">
        {roomShowcase.map((room, index) => (
          <motion.div
            key={room.title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: index * 0.08 }}
            className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"
          >
            <div className="rounded-[2rem] border border-white/10 bg-black/50 p-8 shadow-soft backdrop-blur-xl">
              <span className="text-sm uppercase tracking-[0.24em] text-brand-300">{room.title}</span>
              <h3 className="mt-5 text-3xl font-semibold text-white">{room.title}</h3>
              <p className="mt-5 text-base leading-8 text-brand-200">{room.description}</p>
            </div>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-soft">
              <Image src={room.image} alt={room.title} width={1200} height={900} className="h-full w-full object-cover" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
