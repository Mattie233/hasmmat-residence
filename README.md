# Hasmmat Residence

Stylish direct booking website for Hasmmat Residence, a well-presented 4-bedroom serviced accommodation in Leeds.

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

Deploy on Vercel using the `next` framework. Provide the Smoobu variables for live pricing and the Resend variables for booking confirmation emails.

```env
SMOOBU_API_KEY=your_smoobu_api_key
SMOOBU_CUSTOMER_ID=1705732
SMOOBU_APARTMENT_ID=3264062
RESEND_API_KEY=your_resend_api_key
BOOKING_EMAIL_FROM="Hasmmat Residence <bookings@hasmmatresidence.com>"
BOOKING_NOTIFICATION_EMAIL=bookings@hasmmatresidence.com
NEXT_PUBLIC_SITE_URL=https://hasmmatresidence.com
```

## Notes

- Uses Next.js App Router, Tailwind CSS, Framer Motion, and Smoobu availability/pricing.
- Paid bookings use `/api/checkout`, Stripe Checkout, the verified Stripe webhook, Smoobu reservation creation, and then the paid guest confirmation and owner notification emails. The legacy `/api/booking` submission endpoint is disabled.
- The direct enquiry form posts to `/api/contact`, which sends guest confirmation and host notification emails through the same Resend helper.
- `RESEND_API_KEY` must only be stored in Vercel Environment Variables and must never be exposed to client-side code.
# hasmmat-residence
# hasmmat-residence
