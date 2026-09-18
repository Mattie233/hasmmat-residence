import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function createNonce() {
  return crypto.randomUUID().replace(/-/g, '');
}

export function middleware(request: NextRequest) {
  const nonce = createNonce();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('x-csp-nonce', nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });

  const developmentScriptSource = process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : '';
  const cspHeader = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${developmentScriptSource} https://js.stripe.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob: https://*.googleusercontent.com https://*.gstatic.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "connect-src 'self' https://api.stripe.com https://*.stripe.com https://*.google.com https://*.googleapis.com",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://www.google.com https://*.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
