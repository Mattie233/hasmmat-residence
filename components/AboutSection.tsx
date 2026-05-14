'use client';

import { motion } from 'framer-motion';

export function AboutSection() {
  return (
    <section id="about" className="container py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 inline-flex rounded-full border border-brand-300/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.27em] text-brand-200">
          About Hasmmat Residence
        </p>
        <h2 className="text-4xl font-semibold text-white">Family-run hosting with premium standards and local Leeds expertise</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-brand-200">
          We blend boutique hospitality with the convenience of serviced accommodation to deliver clean, elevated stays in every season.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7 }}
        className="mt-14 grid gap-8 lg:grid-cols-3"
      >
        <div className="rounded-[2rem] border border-white/10 bg-black/50 p-8 shadow-soft backdrop-blur-xl">
          <h3 className="text-xl font-semibold text-white">Professional hosting</h3>
          <p className="mt-4 text-brand-200 leading-7">
            Fast responses, dependable check-in, and a seamless stay designed for busy visitors.
          </p>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-black/50 p-8 shadow-soft backdrop-blur-xl">
          <h3 className="text-xl font-semibold text-white">Immaculate standards</h3>
          <p className="mt-4 text-brand-200 leading-7">
            Deep cleaning, fresh linen, and boutique setup for families and contractors alike.
          </p>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-black/50 p-8 shadow-soft backdrop-blur-xl">
          <h3 className="text-xl font-semibold text-white">Long stay ready</h3>
          <p className="mt-4 text-brand-200 leading-7">
            Comfortable workspaces, laundry facilities, and flexible rates for extended bookings.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
