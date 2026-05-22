'use client';

import { type FormEvent, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { reviews } from '@/lib/data';
import type { Review } from '@/types';

type ReviewsResponse = {
  reviews?: Review[];
  error?: string;
};

export function Reviews() {
  const [liveReviews, setLiveReviews] = useState<Review[]>(reviews);
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;

    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews');
        const data = (await response.json()) as ReviewsResponse;

        if (!response.ok || data.error || !data.reviews?.length) {
          return;
        }

        if (!ignore) {
          setLiveReviews(data.reviews);
        }
      } catch {
        // Keep showing curated fallback reviews if the database is unavailable.
      }
    };

    fetchReviews();

    return () => {
      ignore = true;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, rating, feedback }),
      });
      const data = (await response.json()) as { review?: Review; error?: string };
      const savedReview = data.review;

      if (!response.ok || data.error || !savedReview) {
        throw new Error(data.error || 'Unable to save your review.');
      }

      setLiveReviews((currentReviews) => [savedReview, ...currentReviews]);
      setAuthor('');
      setRating(5);
      setFeedback('');
      setStatus('Thanks for sharing your review.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to save your review.');
    } finally {
      setSubmitting(false);
    }
  };

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

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="mx-auto mt-12 max-w-3xl rounded-[2rem] border border-white/10 bg-black/50 p-7 shadow-soft backdrop-blur-xl"
      >
        <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
          <div>
            <label className="mb-3 block text-sm uppercase tracking-[0.18em] text-brand-300">Name</label>
            <input
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              required
              minLength={2}
              className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none transition focus:border-brand-300"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="mb-3 block text-sm uppercase tracking-[0.18em] text-brand-300">Rating</label>
            <select
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
              required
              className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none transition focus:border-brand-300"
            >
              {[5, 4, 3, 2, 1].map((option) => (
                <option key={option} value={option}>
                  {option}/5
                </option>
              ))}
            </select>
          </div>
        </div>
        <label className="mt-5 block text-sm uppercase tracking-[0.18em] text-brand-300">Review</label>
        <textarea
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
          required
          minLength={10}
          maxLength={700}
          className="mt-3 min-h-[140px] w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none transition focus:border-brand-300"
          placeholder="Tell future guests what you enjoyed about your stay."
        />
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-brand-400 px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Saving review...' : 'Submit review'}
          </button>
          {status ? <p className="text-sm text-brand-200">{status}</p> : null}
        </div>
      </motion.form>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {liveReviews.map((review, index) => (
          <motion.article
            key={`${review.author}-${review.createdAt || index}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: index * 0.08 }}
            className="rounded-[2rem] border border-white/10 bg-black/50 p-7 shadow-soft backdrop-blur-xl"
          >
            <div className="mb-4 flex items-center gap-2 text-brand-300">
              <span className="rounded-full bg-brand-400/10 px-3 py-1 text-xs uppercase">Guest review</span>
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
