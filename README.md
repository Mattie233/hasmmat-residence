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

Deploy on Vercel using the `next` framework. Provide the Smoobu variables for live pricing and the Resend variables for booking confirmation emails.

```env
SMOOBU_API_KEY=your_smoobu_api_key
SMOOBU_CUSTOMER_ID=1705732
SMOOBU_APARTMENT_ID=3264062
RESEND_API_KEY=your_resend_api_key
BOOKING_EMAIL_FROM="Hasmmat Residence <bookings@your-domain.com>"
NEXT_PUBLIC_SITE_URL=https://www.hasmmat-residence.com
```

## Notes

- Uses Next.js App Router, Tailwind CSS, Framer Motion, and Smoobu availability/pricing.
- The booking form sends guest confirmation and host notification emails through Resend from a secure server-side API route.
- `RESEND_API_KEY` must only be stored in Vercel Environment Variables and must never be exposed to client-side code.
- The enquiry form opens the guest's email app with their details and exact booking selection prefilled.
# hasmmat-residence
# hasmmat-residence
