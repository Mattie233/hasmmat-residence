import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

type StoredReview = {
  author: string;
  rating: number;
  feedback: string;
  createdAt: Date;
};

const serializeReview = (review: StoredReview) => ({
  author: review.author,
  rating: review.rating,
  feedback: review.feedback,
  createdAt: review.createdAt.toISOString(),
});

export async function GET() {
  try {
    const reviews = (await prisma.review.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 12,
    })) as StoredReview[];

    return NextResponse.json({
      reviews: reviews.map(serializeReview),
    });
  } catch (error) {
    console.error('Reviews API error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Unable to load reviews.' }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({ error: 'Guest review submissions are disabled.' }, { status: 405 });
}
