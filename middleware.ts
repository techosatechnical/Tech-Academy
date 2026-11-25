import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals like static files, chunks, images)
     * 3. Static assets with extensions (e.g. .ico, .png, .jpg, .svg)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // Normalize host (remove port number if local dev)
  const cleanHost = hostname.split(':')[0].toLowerCase();

  // Admin routes always pass through directly
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Determine organisation from subdomain or domain
  // e.g. bright-academy-tution.vercel.app -> 'bright'
  //      excellence-academy-tution.vercel.app -> 'excellence'
  let matchedOrgSlug = '';

  if (
    cleanHost.includes('bright-academy') ||
    cleanHost.startsWith('bright.') ||
    cleanHost.startsWith('bright-') ||
    cleanHost.includes('brightacademy')
  ) {
    matchedOrgSlug = 'bright';
  } else if (
    cleanHost.includes('excellence-academy') ||
    cleanHost.startsWith('excellence.') ||
    cleanHost.startsWith('excellence-') ||
    cleanHost.includes('excellencetutorials')
  ) {
    matchedOrgSlug = 'excellence';
  }

  // If already accessing explicit path (e.g. /bright/about or /excellence/courses)
  if (url.pathname.startsWith('/bright') || url.pathname.startsWith('/excellence')) {
    return NextResponse.next();
  }

  // If visited via a specific subdomain/domain, internally rewrite to that organisation's page
  // The user's address bar stays clean (e.g. https://bright-academy-tution.vercel.app/courses) without exposing /bright!
  if (matchedOrgSlug) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-custom-domain', 'true');
    requestHeaders.set('x-org-slug', matchedOrgSlug);

    const rewritePath = `/${matchedOrgSlug}${url.pathname === '/' ? '' : url.pathname}`;
    const rewriteUrl = new URL(rewritePath, req.url);
    return NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}
