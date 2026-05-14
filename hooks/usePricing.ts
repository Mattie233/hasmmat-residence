'use client';

import { useEffect, useState } from 'react';
import type { BookingType, PricingBreakdown } from '@/types';

type UsePricingArgs = {
  checkIn: string;
  checkOut: string;
  guests: number;
  bookingType: BookingType;
  listingId?: string;
};

type UsePricingResult = {
  pricing: PricingBreakdown | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function usePricing({ checkIn, checkOut, guests, bookingType, listingId }: UsePricingArgs): UsePricingResult {
  const [pricing, setPricing] = useState<PricingBreakdown | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPricing = async () => {
    if (!checkIn || !checkOut || guests < 1) {
      setPricing(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkIn, checkOut, guests, bookingType, listingId }),
      });
      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Unable to load pricing.');
      }

      setPricing(data as PricingBreakdown);
    } catch (fetchError) {
      setPricing(null);
      setError(fetchError instanceof Error ? fetchError.message : 'Pricing service unavailable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, [checkIn, checkOut, guests, bookingType, listingId]);

  return {
    pricing,
    loading,
    error,
    refresh: fetchPricing,
  };
}
