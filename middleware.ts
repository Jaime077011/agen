import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE      = 'site_preview';
const LANG_COOKIE = 'lang_pref';
const SECRET      = process.env.PREVIEW_SECRET ?? '';
const COMING      = '/coming-soon';

const MIDDLE_EAST = new Set([
  'SA', 'AE', 'KW', 'BH', 'OM', 'QA', 'JO', 'LB',
  'SY', 'IQ', 'YE', 'PS', 'LY', 'TN', 'MA', 'DZ', 'SD', 'MR',
]);

function detectLang(request: NextRequest): 'en' | 'ar-eg' | 'ar-sa' {
  const country = request.headers.get('x-vercel-ip-country') ?? '';
  if (country === 'EG') return 'ar-eg';
  if (MIDDLE_EAST.has(country)) return 'ar-sa';
  return 'en';
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Determine the response
  let response: NextResponse;

  if (pathname === COMING || pathname === '/brief') {
    response = NextResponse.next();
  } else if (SECRET && searchParams.get('preview') === SECRET) {
    response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set(COOKIE, SECRET, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
  } else if (request.cookies.get(COOKIE)?.value === SECRET) {
    response = NextResponse.next();
  } else {
    response = NextResponse.redirect(new URL(COMING, request.url));
  }

  // Set geo-detected lang only if the user hasn't saved their own preference
  if (!request.cookies.has(LANG_COOKIE)) {
    response.cookies.set(LANG_COOKIE, detectLang(request), {
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|otf|woff2?|ttf)).*)',
  ],
};
