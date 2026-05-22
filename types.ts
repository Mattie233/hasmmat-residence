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

export type SmoobuAvailabilityRequest = {
  arrivalDate: string;
  departureDate: string;
  apartments: number[];
  customerId: number;
  guests?: number;
};

export type SmoobuAvailabilityResponse = {
  availableApartments?: number[];
  prices?: Record<string, { price: number; currency: string }>;
  errorMessages?: Record<
    string,
    {
      errorCode?: number;
      message?: string;
      minimumLengthOfStay?: number;
      numberOfGuest?: number;
      leadTime?: number;
      minimumLengthBetweenBookings?: number;
      arrivalDays?: string[];
    }
  >;
  title?: string;
  detail?: string;
};

export type SmoobuRateDay = {
  price: number | null;
  min_length_of_stay: number | null;
  available: number;
};

export type SmoobuRatesResponse = {
  data?: Record<string, Record<string, SmoobuRateDay>>;
  status?: number;
  title?: string;
  detail?: string;
};

export type CalendarAvailabilityDay = {
  available: boolean;
  price: number | null;
  minLengthOfStay: number | null;
};

export type CalendarAvailabilityResponse = {
  days: Record<string, CalendarAvailabilityDay>;
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
