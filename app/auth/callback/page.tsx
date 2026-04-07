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
    // The @supabase/ssr browser client is configured with:
    //   flowType: 'pkce'
    //   detectSessionInUrl: true
    //
    // detectSessionInUrl automatically handles:
    //   - ?code=xxx  → calls exchangeCodeForSession internally
    //   - #access_token=xxx → sets session from hash
    //
    // For ?token_hash=xxx&type=xxx (OTP), we still call verifyOtp manually.
    // For everything else, we listen to onAuthStateChange for the result.

    const supabase = createClient()
    let settled = false

    function go(path: string) {
      if (!settled) {
        settled = true
        router.replace(path)
      }
    }

    // Log what Supabase actually sent back so we can debug
    console.log('[auth/callback] search:', window.location.search)
    console.log('[auth/callback] hash:', window.location.hash ? '(has hash)' : '(no hash)')

    // ── Error params forwarded by Supabase ─────────────────────────
    const supabaseError = searchParams.get('error')
    if (supabaseError) {
      console.error('[auth/callback] Supabase error param:', supabaseError, searchParams.get('error_description'))
      go('/login?error=auth_callback_error')
      return
    }

    // ── token_hash flow (PKCE OTP — manual verifyOtp) ─────────────
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    if (token_hash && type) {
      supabase.auth.verifyOtp({ token_hash, type }).then(({ error }) => {
        if (error) {
          console.error('[auth/callback] verifyOtp error:', error.message)
          go('/login?error=expired')
        } else {
          go('/dashboard')
        }
      })
      return
    }

    // ── code flow + implicit hash flow (auto-handled by detectSessionInUrl) ─
    // Subscribe first so we don't miss the event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[auth/callback] onAuthStateChange:', event)
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
        subscription.unsubscribe()
        go('/dashboard')
      }
    })

    // Also check immediately — detectSessionInUrl may have already fired
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        subscription.unsubscribe()
        go('/dashboard')
      }
    })

    // ── Fallback: hash fragment (older implicit flow) ───────────────
    const hash = window.location.hash
    if (hash) {
      const params = new URLSearchParams(hash.substring(1))
      const access_token = params.get('access_token')
      const refresh_token = params.get('refresh_token')
      if (access_token && refresh_token) {
        supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
          if (error) {
            console.error('[auth/callback] setSession error:', error.message)
            go('/login?error=auth_callback_error')
          } else {
            go('/dashboard')
          }
        })
        return
      }
    }

    // ── Timeout: if nothing resolves in 10s, bail ──────────────────
    const timeout = setTimeout(() => {
      subscription.unsubscribe()
      supabase.auth.getSession().then(({ data: { session } }) => {
        go(session ? '/dashboard' : '/login?error=missing_token')
      })
    }, 10000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
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
