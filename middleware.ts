import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE   = 'site_preview';
const SECRET   = process.env.PREVIEW_SECRET ?? '';
const COMING   = '/coming-soon';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Let the coming-soon page and all static/internal assets through
  if (pathname === COMING) return NextResponse.next();

  // Owner visits /?preview=SECRET → set cookie and redirect to home
  if (SECRET && searchParams.get('preview') === SECRET) {
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set(COOKIE, SECRET, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
    return response;
  }

  // Cookie present and valid → let through
  if (request.cookies.get(COOKIE)?.value === SECRET) {
    return NextResponse.next();
  }

  // Everyone else → coming-soon
  return NextResponse.redirect(new URL(COMING, request.url));
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static  (Next.js build assets)
     * - _next/image   (Next.js image optimisation)
     * - favicon.ico
     * - public files  (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|otf|woff2?|ttf)).*)',
  ],
};
