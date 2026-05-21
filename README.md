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
```

## Notes

- Uses Next.js App Router, Tailwind CSS, Framer Motion, and Smoobu availability/pricing.
- Placeholder images are remote assets from Unsplash.
- The website does not take online card payments. Guests send booking requests and receive bank transfer details for deposits and balances after confirmation.
# hasmmat-residence
# hasmmat-residence
