import { NextResponse } from 'next/server';
import type { BookingConfirmationRequest } from '@/lib/bookingRequest';
import { sendBookingConfirmationEmails } from '@/lib/bookingEmails';

export const dynamic = 'force-dynamic';

const REQUIRED_ERROR = 'Please complete all required booking details before confirming your booking.';
const SEND_ERROR =
  'Sorry, we could not confirm your booking right now. Please try again later or contact Hasmmat Residence directly.';

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function hasRequiredFields(body: BookingConfirmationRequest) {
  return Boolean(
    body.guestName?.trim() &&
      isValidEmail(body.guestEmail || '') &&
      body.guestPhone?.trim() &&
      body.propertyName?.trim() &&
      body.checkIn?.trim() &&
      body.checkOut?.trim() &&
      Number(body.guests) > 0 &&
      Number(body.total) > 0,
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BookingConfirmationRequest;

    if (!hasRequiredFields(body)) {
      return NextResponse.json({ error: REQUIRED_ERROR }, { status: 400 });
    }

    await sendBookingConfirmationEmails({
      ...body,
      guestName: body.guestName.trim(),
      guestEmail: body.guestEmail.trim(),
      guestPhone: body.guestPhone.trim(),
      propertyName: body.propertyName.trim(),
      guestAddress: body.guestAddress?.trim() || 'Not provided',
      specialRequests: body.specialRequests?.trim() || 'None',
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      message:
        'Thank you for your booking! A confirmation email has been sent to your email address. If you do not receive it within a few minutes, please check your spam or junk folder.',
    });
  } catch (error) {
    console.error('Booking confirmation email error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: SEND_ERROR }, { status: 500 });
  }
}
