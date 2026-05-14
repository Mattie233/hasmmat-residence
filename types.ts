export type HeroSlide = {
  title: string;
  subtitle: string;
  image: string;
};

export type GalleryItem = {
  category: string;
  title: string;
  src: string;
};

export type Amenity = {
  title: string;
  description: string;
};

export type Review = {
  author: string;
  rating: number;
  feedback: string;
};

export type LocationPoint = {
  label: string;
  distance: string;
  note: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type BookingType = 'flexible' | 'nonrefundable';

export type PriceLabsRawRate = {
  date: string;
  airbnb_rate?: number | null;
  pricelabs_rate?: number | null;
  rate?: number | null;
  min_stay?: number | null;
  available?: boolean | null;
};

export type PriceLabsApiResponse = {
  listing_id: string;
  currency: string;
  rates: PriceLabsRawRate[];
};

export type NormalizedNightlyRate = {
  date: string;
  airbnbRate: number;
  priceLabsRate: number;
  minStay: number | null;
  available: boolean;
};

export type PropertyPricingConfig = {
  propertyId: string;
  listingId: string;
  name: string;
  cleaningFee: number;
  includedGuests: number;
  extraGuestFee: number;
  stripeFeeRate: number;
  fallbackNightlyRate: number;
};

export interface PricingRequest {
  checkIn: string;
  checkOut: string;
  guests: number;
  bookingType: BookingType;
  listingId?: string;
}

export interface PricingBreakdown {
  valid: boolean;
  listingId: string;
  currency: string;
  nights: number;
  rateTotal: number;
  airbnbTotal: number;
  subtotal: number;
  cleaningFee: number;
  extraGuestFeeTotal: number;
  discountRate: number;
  discountAmount: number;
  totalAfterDiscount: number;
  stripeFeeEstimate: number;
  hostPayoutEstimate: number;
  guestSavings: number;
  guestSavingsPercentage: number;
  nightlyRates: number[];
  airbnbRates: number[];
  bookingType: BookingType;
  savingsLabel: string;
  fallbackUsed: boolean;
}

export type PricingApiResponse = PricingBreakdown & {
  listingId: string;
  currency: string;
  fallbackUsed: boolean;
};

