'use client';

import { locationPoints } from '@/lib/data';
import { motion } from 'framer-motion';

const propertyAddress = '62 Cross Flatts Grove, Leeds';
const encodedAddress = encodeURIComponent(propertyAddress);
const googleMapsEmbedUrl = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;
const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

export function LocationSection() {
  return (
    <section id="location" className="container py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 inline-flex rounded-full border border-brand-300/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.27em] text-brand-200">
          Prime Leeds location
        </p>
        <h2 className="text-4xl font-semibold text-white">A home base for fans, city breaks and longer working stays</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-brand-200">
          Minutes from Elland Road, Leeds city centre, transport links and the city’s best shopping and dining.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/50 p-6 shadow-soft backdrop-blur-xl">
          <iframe
            title={`Map showing ${propertyAddress}`}
            src={googleMapsEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[350px] w-full rounded-[2rem] border-0 bg-brand-950/90"
          />
          <div className="mt-6 text-brand-100">
            <p className="mb-3 text-sm uppercase tracking-[0.25em] text-brand-300">Find us</p>
            <p className="text-xl font-semibold text-white">{propertyAddress}</p>
            <p className="text-base leading-7 text-brand-200">
              View the area, nearby transport links, and route options before you arrive.
            </p>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex rounded-full border border-brand-300/30 px-5 py-3 text-sm font-semibold text-brand-100 transition hover:border-brand-100 hover:bg-white/5"
            >
              Open in Google Maps
            </a>
          </div>
        </div>

        <div className="space-y-5">
          {locationPoints.map((point, index) => (
            <motion.div
              key={point.label}
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: index * 0.07 }}
              className="rounded-[2rem] border border-white/10 bg-black/50 p-6 shadow-soft backdrop-blur-xl"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xl font-semibold text-white">{point.label}</p>
                  <p className="mt-2 text-sm text-brand-200">{point.note}</p>
                </div>
                <span className="rounded-full bg-brand-400/10 px-4 py-2 text-sm text-brand-100">{point.distance}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
