# Hasmmat Residence

Premium direct booking website for Hasmmat Residence, a luxury 4-bedroom serviced accommodation in Leeds.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## Deployment

Deploy on Vercel using the `next` framework. Provide `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY` as environment variables.

## Notes

- Uses Next.js App Router, Tailwind CSS, Framer Motion, and Stripe API.
- Placeholder images are remote assets from Unsplash.
- Booking API route is ready for Stripe Checkout integration.
