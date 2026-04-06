import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { EmailOtpType } from '@supabase/supabase-js'

/**
 * Auth callback route — handles the redirect from Supabase magic link emails.
 *
 * Supabase appends ?token_hash=...&type=email to the emailRedirectTo URL.
 * This route exchanges that token for a session, sets the auth cookie,
 * then redirects to /dashboard (or the ?next= param if provided).
 *
 * If the token is invalid/expired, redirects to /login?error=expired.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)

  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/dashboard'

  // Malformed link — no token
  if (!token_hash || !type) {
    return NextResponse.redirect(`${origin}/login?error=missing_token`)
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  const { error } = await supabase.auth.verifyOtp({ token_hash, type })

  if (error) {
    // Token expired or already used
    console.error('[auth/callback] verifyOtp error:', error.message)
    return NextResponse.redirect(`${origin}/login?error=expired`)
  }

  // Session set — send to dashboard (or wherever the login form specified)
  return NextResponse.redirect(`${origin}${next}`)
}
