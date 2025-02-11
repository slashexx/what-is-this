import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const user = request.cookies.get('user')
  const { pathname } = request.nextUrl

  // Allow access to root and api routes
  if (pathname === '/' || pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Redirect to root if no user and trying to access protected routes
  if (!user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Allow access to other routes if user exists
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
