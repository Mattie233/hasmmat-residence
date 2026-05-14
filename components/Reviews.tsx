'use client';

import { motion } from 'framer-motion';
import { reviews } from '@/lib/data';

export function Reviews() {
  return (
    <section id="reviews" className="container py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 inline-flex rounded-full border border-brand-300/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.27em] text-brand-200">
          Guest feedback
        </p>
        <h2 className="text-4xl font-semibold text-white">Trusted by families, professionals and visiting groups</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-brand-200">
          High ratings and repeat bookings from guests who value our blend of premium style and practical convenience.
        </p>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {reviews.map((review, index) => (
          <motion.article
            key={review.author}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: index * 0.08 }}
            className="rounded-[2rem] border border-white/10 bg-black/50 p-7 shadow-soft backdrop-blur-xl"
          >
            <div className="mb-4 flex items-center gap-2 text-brand-300">
              <span className="rounded-full bg-brand-400/10 px-3 py-1 text-xs uppercase">Verified stay</span>
              <span>•</span>
              <span className="text-sm">{review.rating}/5 stars</span>
            </div>
            <p className="text-base leading-8 text-brand-100">“{review.feedback}”</p>
            <p className="mt-6 text-sm uppercase tracking-[0.22em] text-brand-300">{review.author}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
