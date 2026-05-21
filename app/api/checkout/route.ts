import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      error: 'Online checkout is disabled. Please contact Hasmmat Residence to confirm bank transfer details.',
    },
    { status: 410 },
  );
}
