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

Deploy on Vercel using the `next` framework. Provide the Smoobu environment variables required by the pricing route.

```env
SMOOBU_API_KEY=your_smoobu_api_key
SMOOBU_CUSTOMER_ID=1705732
SMOOBU_APARTMENT_ID=3264062
STRIPE_SECRET_KEY=sk_live_or_test_key
NEXT_PUBLIC_SITE_URL=https://www.hasmmat-residence.com
RESEND_API_KEY=your_resend_api_key
ENQUIRY_FROM_EMAIL=Hasmmat Residence <bookings@your-verified-domain.com>
```

## Notes

- Uses Next.js App Router, Tailwind CSS, Framer Motion, and Smoobu availability/pricing.
- Placeholder images are remote assets from Unsplash.
- Stripe Checkout takes secure card payments from the selected booking details.
- The enquiry form emails the guest details and exact booking selection to `hasmmatresidence@yahoo.com` through Resend.
# hasmmat-residence
# hasmmat-residence
