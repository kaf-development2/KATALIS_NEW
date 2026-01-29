import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get pathname
  const { pathname } = request.nextUrl;

  // Allow access to login page
  if (pathname === '/login') {
    return NextResponse.next();
  }

  // For all other pages, we'll handle authentication on the client side
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
