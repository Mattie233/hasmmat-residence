import { NextResponse } from 'next/server';
import { sendEnquiryEmails, type DirectEnquiryDetails } from '@/lib/bookingEmails';

export const dynamic = 'force-dynamic';

const REQUIRED_ERROR = 'Please complete all required enquiry details before sending.';
const SEND_ERROR =
  'Sorry, we could not send your enquiry right now. Please try again later or contact Hasmmat Residence directly.';

type DirectEnquiryRequest = Omit<DirectEnquiryDetails, 'submittedAt'>;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getMissingFields(body: DirectEnquiryRequest) {
  const missing: string[] = [];

  if (!body.name?.trim()) missing.push('name');
  if (!isValidEmail(body.email || '')) missing.push('email');
  if (!body.phone?.trim()) missing.push('phone');
  if (!body.guests?.trim()) missing.push('guests');
  if (!body.dates?.trim()) missing.push('dates');
  if (!body.message?.trim()) missing.push('message');

  return missing;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DirectEnquiryRequest;
    const missingFields = getMissingFields(body);

    if (missingFields.length > 0) {
      console.warn('Direct enquiry API validation failed:', { missingFields });
      return NextResponse.json({ error: REQUIRED_ERROR }, { status: 400 });
    }

    await sendEnquiryEmails({
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      guests: body.guests.trim(),
      dates: body.dates.trim(),
      message: body.message.trim(),
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      message:
        "Thank you for contacting Hasmmat Residence. We've received your enquiry and a confirmation email has been sent to your email address.",
    });
  } catch (error) {
    console.error('Direct enquiry API Resend email failed:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ error: SEND_ERROR }, { status: 500 });
  }
}
