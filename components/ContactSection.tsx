'use client';

import { motion } from 'framer-motion';

export function ContactSection() {
  return (
    <section id="contact" className="container py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 inline-flex rounded-full border border-brand-300/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.27em] text-brand-200">
          Contact & support
        </p>
        <h2 className="text-4xl font-semibold text-white">Ready to book or need a custom stay plan?</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-brand-200">
          Use the form below or message us directly for contractor rates, long stays, or match-day plans near Elland Road.
        </p>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.form
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65 }}
          className="rounded-[2rem] border border-white/10 bg-black/50 p-8 shadow-soft backdrop-blur-xl"
        >
          <div className="grid gap-4">
            <label className="text-sm uppercase tracking-[0.18em] text-brand-300">Name</label>
            <input className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none focus:border-brand-300" placeholder="Your name" />
            <label className="text-sm uppercase tracking-[0.18em] text-brand-300">Email</label>
            <input className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none focus:border-brand-300" placeholder="you@example.com" />
            <label className="text-sm uppercase tracking-[0.18em] text-brand-300">Message</label>
            <textarea className="min-h-[160px] rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none focus:border-brand-300" placeholder="Ask about long stay rates, match-day availability or direct booking benefits." />
            <button type="button" className="rounded-full bg-brand-400 px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand-300">
              Send enquiry
            </button>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="space-y-6 rounded-[2rem] border border-white/10 bg-black/50 p-8 shadow-soft backdrop-blur-xl"
        >
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-brand-300">WhatsApp</p>
            <p className="mt-3 text-2xl font-semibold text-white">+44 7700 900123</p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-brand-300">Email support</p>
            <p className="mt-3 text-2xl font-semibold text-white">hello@hasmmat-residence.com</p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-brand-300">Emergency contact</p>
            <p className="mt-3 text-2xl font-semibold text-white">+44 7722 334455</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white">Book direct & save</h3>
            <p className="mt-3 text-brand-200 leading-7">
              Direct bookings avoid marketplace fees, guarantee our best rates, and unlock priority guest support.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
