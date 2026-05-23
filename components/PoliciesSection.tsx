'use client';

import { motion } from 'framer-motion';
import { cancellationPolicy, directBookingTerms, houseRules, pricingRules } from '@/lib/data';

const bookingRules = [
  'Booking is not confirmed until payment is received',
  'Check-in details are only released after full payment',
  'The business reserves the right to decline bookings'
];

export function PoliciesSection() {
  return (
    <section id="policies" className="container py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 inline-flex rounded-full border border-brand-300/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.27em] text-brand-200">
          Rules & policies
        </p>
        <h2 className="text-4xl font-semibold text-white">Direct booking terms made clear before you reserve</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-brand-200">
          Please review the booking rules, house rules, cancellation policy, and payment terms before sending an enquiry.
        </p>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {bookingRules.map((rule, index) => (
          <motion.div
            key={rule}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: index * 0.06 }}
            className="rounded-[2rem] border border-brand-300/20 bg-brand-400/10 p-6 text-brand-100 shadow-soft backdrop-blur-xl"
          >
            <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Important</p>
            <p className="mt-4 text-xl font-semibold leading-8 text-white">{rule}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="rounded-[2rem] border border-white/10 bg-black/50 p-8 shadow-soft backdrop-blur-xl"
        >
          <p className="text-sm uppercase tracking-[0.22em] text-brand-300">House rules</p>
          <h3 className="mt-4 text-2xl font-semibold text-white">Guest conduct during the stay</h3>
          <ul className="mt-6 grid gap-3 text-sm leading-6 text-brand-200 sm:grid-cols-2">
            {houseRules.map((rule) => (
              <li key={rule} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                {rule}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="space-y-6 rounded-[2rem] border border-white/10 bg-black/50 p-8 shadow-soft backdrop-blur-xl"
        >
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-brand-300">Cancellation policy</p>
            <h3 className="mt-4 text-2xl font-semibold text-white">Balanced terms for direct bookings</h3>
          </div>
          <div className="grid gap-4">
            {cancellationPolicy.map((policy) => (
              <div key={policy.title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                <p className="font-semibold text-white">{policy.title}</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-brand-200">
                  {policy.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-brand-950/80 p-5">
            <p className="text-sm uppercase tracking-[0.18em] text-brand-300">Direct pricing guide</p>
            <div className="mt-4 space-y-3 text-sm text-brand-100">
              {pricingRules.map((rule) => (
                <div key={rule.label} className="flex flex-col gap-1 border-b border-white/10 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                  <span>{rule.label}</span>
                  <strong className="text-white">{rule.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="mt-8 rounded-[2rem] border border-white/10 bg-black/50 p-8 shadow-soft backdrop-blur-xl"
      >
        <p className="text-sm uppercase tracking-[0.22em] text-brand-300">Direct booking terms & conditions</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {directBookingTerms.map((term) => (
            <div key={term.title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
              <h3 className="text-lg font-semibold text-white">{term.title}</h3>
              <p className="mt-3 text-sm leading-7 text-brand-200">{term.body}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
