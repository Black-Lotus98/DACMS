import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_PATHS, PROTECTED_PATHS } from '@/config/auth-routes';
import { locales, defaultLocale } from '@/config/i18n';
import { detectLocale, matchesPath, stripLocale } from '@/lib/middleware-utils';

const LOCALE_COOKIE = 'locale';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const parsed = stripLocale(pathname, locales);

  // Enforce locale prefix — redirect any URL missing a valid locale segment
  if (!parsed) {
    const locale = detectLocale(
      request.cookies.get(LOCALE_COOKIE)?.value,
      request.headers.get('accept-language') ?? '',
      locales,
      defaultLocale,
    );
    const redirectPath =
      segments.length > 0
        ? `/${locale}/${segments.join('/')}`
        : `/${locale}`;
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  const { locale, pathWithoutLocale } = parsed;
  const token = request.cookies.get('access_token')?.value;

  // Redirect unauthenticated users away from protected routes
  if (matchesPath(pathWithoutLocale, PROTECTED_PATHS) && !token) {
    const returnTo = encodeURIComponent(pathWithoutLocale);
    return NextResponse.redirect(new URL(`/${locale}/login?returnTo=${returnTo}`, request.url));
  }

  // Redirect authenticated users away from auth pages
  if (matchesPath(pathWithoutLocale, AUTH_PATHS) && token) {
    return NextResponse.redirect(new URL(`/${locale}/home`, request.url));
  }

  const response = NextResponse.next();
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icons|assets|mockServiceWorker\\.js).*)'],
};
