import type { BookingType } from '@/types';

export const BOOKING_REQUEST_EVENT = 'hasmmat:booking-request';

export type BookingRequestDetail = {
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  bookingType: BookingType;
  total: number;
  savingsLabel: string;
};
