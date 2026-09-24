import type { BookingType } from '@/types';

export const BOOKING_REQUEST_EVENT = 'hasmmat:booking-request';
export const SELECTED_DATES_EVENT = 'hasmmat:selected-dates';

export type SelectedDatesDetail = {
  checkIn: string;
  checkOut: string;
};

export type BookingRequestDetail = {
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  bookingType: BookingType;
  total: number;
  savingsLabel: string;
};

export type GuestBookingDetails = {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestAddress: string;
  specialRequests: string;
};
