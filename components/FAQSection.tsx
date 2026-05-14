'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { faqs } from '@/lib/data';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="container py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 inline-flex rounded-full border border-brand-300/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.27em] text-brand-200">
          Frequently asked questions
        </p>
        <h2 className="text-4xl font-semibold text-white">Everything guests need to know before booking direct</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-brand-200">
          Clear policies, check-in guidance, and direct booking benefits for a smooth Leeds stay.
        </p>
      </div>

      <div className="mt-14 space-y-4">
        {faqs.map((item, index) => (
          <motion.div
            key={item.question}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: index * 0.05 }}
            className="rounded-[2rem] border border-white/10 bg-black/50 p-6 shadow-soft backdrop-blur-xl"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between gap-4 text-left text-lg font-semibold text-white"
            >
              <span>{item.question}</span>
              <span className="text-brand-200">{openIndex === index ? '−' : '+'}</span>
            </button>
            {openIndex === index ? <p className="mt-4 leading-7 text-brand-200">{item.answer}</p> : null}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
