import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;

  const isPublic = [
    '/', 
    '/auth/callback',
  ].some(path => request.nextUrl.pathname.startsWith(path));

  if (!token && !isPublic) {
    const loginUrl = new URL('/', request.url); 
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};