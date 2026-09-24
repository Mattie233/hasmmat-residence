export const PRODUCTION_SITE_URL = 'https://hasmmatresidence.com';

type SiteUrlEnvironment = {
  NEXT_PUBLIC_SITE_URL?: string;
  NODE_ENV?: string;
};

export function getCanonicalSiteUrl(environment: SiteUrlEnvironment = process.env) {
  const configuredUrl = environment.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configuredUrl) {
    if (environment.NODE_ENV === 'production') {
      throw new Error('Missing NEXT_PUBLIC_SITE_URL.');
    }

    return 'http://localhost:3000';
  }

  let url: URL;
  try {
    url = new URL(configuredUrl);
  } catch {
    throw new Error('NEXT_PUBLIC_SITE_URL must be a valid absolute URL.');
  }

  if (url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('NEXT_PUBLIC_SITE_URL must contain only the site origin.');
  }

  if (environment.NODE_ENV === 'production' && url.origin !== PRODUCTION_SITE_URL) {
    throw new Error(`NEXT_PUBLIC_SITE_URL must be ${PRODUCTION_SITE_URL} in production.`);
  }

  if (url.protocol !== 'https:' && url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') {
    throw new Error('NEXT_PUBLIC_SITE_URL must use HTTPS.');
  }

  return url.origin;
}

export function getStripeReturnUrls(siteUrl: string) {
  return {
    successUrl: `${siteUrl}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${siteUrl}/enquire?payment=cancelled#booking`,
  };
}
