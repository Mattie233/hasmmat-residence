import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  return NextResponse.json(
    {
      error: 'This legacy booking endpoint is no longer available. Please use the secure Stripe checkout flow.',
    },
    { status: 410 },
  );
}
