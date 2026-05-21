const DEFAULT_SMOOBU_CUSTOMER_ID = 1705732;
const DEFAULT_SMOOBU_APARTMENT_ID = 3264062;

export function getSmoobuEnv(): {
  SMOOBU_API_KEY: string;
  SMOOBU_CUSTOMER_ID: number;
  SMOOBU_APARTMENT_ID: number;
} {
  const missing = [] as string[];

  const SMOOBU_API_KEY = process.env.SMOOBU_API_KEY;
  const SMOOBU_CUSTOMER_ID = Number(process.env.SMOOBU_CUSTOMER_ID || DEFAULT_SMOOBU_CUSTOMER_ID);
  const SMOOBU_APARTMENT_ID = Number(process.env.SMOOBU_APARTMENT_ID || DEFAULT_SMOOBU_APARTMENT_ID);

  if (!SMOOBU_API_KEY) missing.push('SMOOBU_API_KEY');
  if (!Number.isInteger(SMOOBU_CUSTOMER_ID)) missing.push('SMOOBU_CUSTOMER_ID');
  if (!Number.isInteger(SMOOBU_APARTMENT_ID)) missing.push('SMOOBU_APARTMENT_ID');

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return {
    SMOOBU_API_KEY: SMOOBU_API_KEY!,
    SMOOBU_CUSTOMER_ID,
    SMOOBU_APARTMENT_ID,
  };
}
