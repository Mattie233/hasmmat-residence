'use client';

import { type FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { siteInfo } from '@/lib/data';

export function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dates, setDates] = useState('');
  const [guests, setGuests] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = encodeURIComponent('Direct booking enquiry');
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone/WhatsApp: ${phone || 'Not provided'}`,
        `Dates: ${dates || 'Not provided'}`,
        `Guests: ${guests || 'Not provided'}`,
        '',
        message
      ].join('\n'),
    );

    window.location.href = `mailto:${siteInfo.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="container py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 inline-flex rounded-full border border-brand-300/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.27em] text-brand-200">
          Contact & support
        </p>
        <h2 className="text-4xl font-semibold text-white">Ready to book or need a custom stay plan?</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-brand-200">
          Use the direct enquiry form or message us on WhatsApp for contractor rates, long stays, or match-day plans near Elland Road.
        </p>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65 }}
          className="rounded-[2rem] border border-white/10 bg-black/50 p-8 shadow-soft backdrop-blur-xl"
        >
          <div className="grid gap-4">
            <p className="text-sm uppercase tracking-[0.22em] text-brand-300">Direct enquiry form</p>
            <label className="text-sm uppercase tracking-[0.18em] text-brand-300">Name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none focus:border-brand-300"
              placeholder="Your name"
            />
            <label className="text-sm uppercase tracking-[0.18em] text-brand-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none focus:border-brand-300"
              placeholder="you@example.com"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-4">
                <label className="text-sm uppercase tracking-[0.18em] text-brand-300">Phone or WhatsApp</label>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none focus:border-brand-300"
                  placeholder="+44..."
                />
              </div>
              <div className="grid gap-4">
                <label className="text-sm uppercase tracking-[0.18em] text-brand-300">Guests</label>
                <input
                  value={guests}
                  onChange={(event) => setGuests(event.target.value)}
                  className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none focus:border-brand-300"
                  placeholder="How many guests?"
                />
              </div>
            </div>
            <label className="text-sm uppercase tracking-[0.18em] text-brand-300">Preferred dates</label>
            <input
              value={dates}
              onChange={(event) => setDates(event.target.value)}
              className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none focus:border-brand-300"
              placeholder="Check-in and check-out dates"
            />
            <label className="text-sm uppercase tracking-[0.18em] text-brand-300">Message</label>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              required
              className="min-h-[160px] rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none focus:border-brand-300"
              placeholder="Ask about long stay rates, match-day availability or direct booking benefits."
            />
            <button type="submit" className="rounded-full bg-brand-400 px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand-300">
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
            <p className="mt-3 text-2xl font-semibold text-white">{siteInfo.phone}</p>
            <a
              href={siteInfo.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex rounded-full bg-brand-400 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-300"
            >
              WhatsApp contact button
            </a>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-brand-300">Email support</p>
            <p className="mt-3 text-2xl font-semibold text-white">{siteInfo.email}</p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-brand-300">Social links</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <a
                href={siteInfo.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-brand-100 transition hover:border-brand-300 hover:text-white"
              >
                Instagram link
              </a>
              <a
                href={siteInfo.tiktokUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-brand-100 transition hover:border-brand-300 hover:text-white"
              >
                TikTok link
              </a>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white">Book direct & save</h3>
            <p className="mt-3 text-brand-200 leading-7">
              Public direct website pricing is 10% below the standard channel rate, with stronger discounts available for returning guests, non-refundable bookings, last-minute dates, and stays of 28+ nights.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
