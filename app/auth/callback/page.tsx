'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { EmailOtpType } from '@supabase/supabase-js'

const LoadingScreen = () => (
  <div
    className="dashboard"
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--canvas)',
    }}
  >
    <p
      style={{
        fontFamily: 'var(--font-dm-mono, monospace)',
        fontSize: '13px',
        color: 'var(--ink-muted)',
      }}
    >
      Confirming login…
    </p>
  </div>
)

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const supabase = createClient()

    async function handleCallback() {
      // ── PKCE / token_hash flow (query params) ─────────────────────
      // Used when Supabase project is in PKCE mode
      const token_hash = searchParams.get('token_hash')
      const type = searchParams.get('type') as EmailOtpType | null

      if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({ token_hash, type })
        if (error) {
          console.error('[auth/callback] verifyOtp error:', error.message)
          router.replace('/login?error=expired')
        } else {
          router.replace('/dashboard')
        }
        return
      }

      // ── Implicit flow (hash fragment) ──────────────────────────────
      // Hash fragments never reach the server, so we handle them here.
      // Supabase appends #access_token=...&refresh_token=...&type=...
      const hash = window.location.hash
      if (hash) {
        const params = new URLSearchParams(hash.substring(1))
        const access_token = params.get('access_token')
        const refresh_token = params.get('refresh_token')

        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          })
          if (error) {
            console.error('[auth/callback] setSession error:', error.message)
            router.replace('/login?error=auth_callback_error')
          } else {
            router.replace('/dashboard')
          }
          return
        }
      }

      // ── Nothing matched ────────────────────────────────────────────
      router.replace('/login?error=missing_token')
    }

    handleCallback()
  }, [router, searchParams])

  return <LoadingScreen />
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <CallbackHandler />
    </Suspense>
  )
}
