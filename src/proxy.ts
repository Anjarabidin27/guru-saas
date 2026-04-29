// proxy.ts — Next.js 16 route proxy (Auth Guard)

import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const { pathname } = request.nextUrl

  // Skip untuk halaman admin (diprotect terpisah)
  if (pathname.startsWith('/admin')) return supabaseResponse

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Halaman auth → redirect ke dashboard jika sudah login
    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register')
    if (isAuthPage && user) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Halaman dashboard → redirect ke login jika belum login
    const isDashboardPage = pathname.startsWith('/dashboard')
    if (isDashboardPage && !user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  } catch (err) {
    // Jika Supabase error, biarkan request jalan agar tidak crash
    console.error('[proxy] auth error:', err)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
