import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { COOKIES_NAME } from './utils/const';

export function middleware(request: NextRequest) {
  const token = request.cookies.get(`${COOKIES_NAME}`);
  if (!token) {
    return NextResponse.redirect(new URL('/buyer/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/success',
    '/failed',
    '/buyer/cart', 
    '/buyer/history', 
    '/buyer/profile',
    '/checkout/:path*',
    '/transaction/:path*',

    '/store/:path*', 
  ],
};