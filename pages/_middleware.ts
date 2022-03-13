import { NextApiRequest } from 'next'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextApiRequest & NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.JWT_SECRET as string,
  })

  const { pathname } = req.nextUrl

  if (token && pathname === '/login') {
    const url = req.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  if (token || pathname.includes('/api/auth')) {
    return NextResponse.next()
  }

  if (!token && pathname !== '/login') {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
}
