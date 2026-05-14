export function getServerEnv(): {
  PRICELABS_API_KEY: string;
  PRICELABS_LISTING_ID: string;
  DATABASE_URL: string;
  STRIPE_SECRET_KEY: string;
} {
  const missing = [] as string[];

  const PRICELABS_API_KEY = process.env.PRICELABS_API_KEY;
  const PRICELABS_LISTING_ID = process.env.PRICELABS_LISTING_ID;
  const DATABASE_URL = process.env.DATABASE_URL;
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

  if (!PRICELABS_API_KEY) missing.push('PRICELABS_API_KEY');
  if (!PRICELABS_LISTING_ID) missing.push('PRICELABS_LISTING_ID');
  if (!DATABASE_URL) missing.push('DATABASE_URL');
  if (!STRIPE_SECRET_KEY) missing.push('STRIPE_SECRET_KEY');

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return {
    PRICELABS_API_KEY: PRICELABS_API_KEY!,
    PRICELABS_LISTING_ID: PRICELABS_LISTING_ID!,
    DATABASE_URL: DATABASE_URL!,
    STRIPE_SECRET_KEY: STRIPE_SECRET_KEY!,
  };
}
