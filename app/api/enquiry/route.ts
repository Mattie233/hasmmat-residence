import { NextResponse } from 'next/server';
import { siteInfo } from '@/lib/data';
import type { BookingRequestDetail } from '@/lib/bookingRequest';

export const dynamic = 'force-dynamic';

type EnquiryRequest = {
  name?: string;
  email?: string;
  phone?: string;
  dates?: string;
  guests?: string;
  message?: string;
  booking?: BookingRequestDetail | null;
};

function formatBookingType(value?: string) {
  return value === 'nonrefundable' ? 'Non-refundable' : 'Refundable';
}

function formatBookingDetails(booking?: BookingRequestDetail | null) {
  if (!booking) {
    return 'No booking selection was attached.';
  }

  return [
    `Check-in: ${booking.checkIn}`,
    `Check-out: ${booking.checkOut}`,
    `Guests: ${booking.guests}`,
    `Nights: ${booking.nights}`,
    `Booking type: ${formatBookingType(booking.bookingType)}`,
    `Quoted total: £${booking.total.toFixed(0)}`,
    `Rate: ${booking.savingsLabel}`,
  ].join('\n');
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.ENQUIRY_FROM_EMAIL || 'Hasmmat Residence <onboarding@resend.dev>';
    const body = (await request.json()) as EnquiryRequest;

    const name = body.name?.trim();
    const email = body.email?.trim();
    const phone = body.phone?.trim();
    const dates = body.dates?.trim();
    const guests = body.guests?.trim();
    const message = body.message?.trim();

    if (!name || name.length < 2) {
      return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!message || message.length < 5) {
      return NextResponse.json({ error: 'Please add a short message.' }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Email sending is not configured yet. Please add RESEND_API_KEY in Vercel.' },
        { status: 503 },
      );
    }

    const text = [
      'New Hasmmat Residence enquiry',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone/WhatsApp: ${phone || 'Not provided'}`,
      `Dates field: ${dates || 'Not provided'}`,
      `Guests field: ${guests || 'Not provided'}`,
      '',
      'Selected booking details',
      formatBookingDetails(body.booking),
      '',
      'Guest message',
      message,
    ].join('\n');

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [siteInfo.email],
        reply_to: email,
        subject: `Direct booking enquiry from ${name}`,
        text,
      }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      return NextResponse.json(
        { error: data?.message || 'Unable to send enquiry email.' },
        { status: response.status },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Enquiry API error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Unable to send enquiry at this time.' }, { status: 500 });
  }
}
