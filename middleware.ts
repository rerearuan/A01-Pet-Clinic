import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  // Get the token directly using getToken instead of getServerSession
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Lindungi rute /dashboard
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const userRole = token.role as string;
    if (!['dokter-hewan', 'perawat-hewan'].includes(userRole)) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};