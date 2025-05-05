import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const defaultLocale = routing.defaultLocale;

  // If the pathname is '/', redirect to '/en/home'
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}/home`, request.url));
  }

  // If the pathname is just the locale (like '/en' or '/de'), redirect to '/locale/home'
  const localePattern = new RegExp(`^\\/(${routing.locales.join("|")})\\/?$`);
  if (localePattern.test(pathname)) {
    const locale = pathname.split("/")[1];
    return NextResponse.redirect(new URL(`/${locale}/home`, request.url));
  }

  // For all other requests, use the intl middleware
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
