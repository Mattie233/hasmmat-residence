import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

const MAX_FEEDBACK_LENGTH = 700;

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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      author?: string;
      rating?: number;
      feedback?: string;
    };

    const author = body.author?.trim();
    const feedback = body.feedback?.trim();
    const rating = Number(body.rating);

    if (!author || author.length < 2) {
      return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Please choose a rating from 1 to 5.' }, { status: 400 });
    }

    if (!feedback || feedback.length < 10) {
      return NextResponse.json({ error: 'Please write a short review.' }, { status: 400 });
    }

    if (feedback.length > MAX_FEEDBACK_LENGTH) {
      return NextResponse.json({ error: 'Please keep your review under 700 characters.' }, { status: 400 });
    }

    const review = (await prisma.review.create({
      data: {
        author,
        rating,
        feedback,
      },
    })) as StoredReview;

    return NextResponse.json(
      {
        review: serializeReview(review),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Reviews API error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Unable to save your review.' }, { status: 500 });
  }
}
