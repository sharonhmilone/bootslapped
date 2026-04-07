'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ERROR_MESSAGES: Record<string, string> = {
  expired: 'That link has expired or already been used. Request a new one.',
  missing_token: 'Invalid magic link. Please request a new one.',
  auth_callback_error: 'Something went wrong confirming your login. Try again.',
}

// Isolated to its own component so useSearchParams can be wrapped in Suspense
function LoginForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()

  // Surface errors passed back from the auth callback route
  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam && ERROR_MESSAGES[errorParam]) {
      setError(ERROR_MESSAGES[errorParam])
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    // redirectTo points to the callback route, which exchanges the token
    // for a session and then redirects to /dashboard
    const redirectTo = `${window.location.origin}/auth/callback`

    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      })

      if (authError) {
        setError(authError.message)
      } else {
        setSent(true)
      }
    } catch (err) {
      setError('Could not reach authentication server. Check your connection and try again.')
      console.error('[login] signInWithOtp threw:', err)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--rule)',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-dm-mono, monospace)',
            fontSize: '14px',
            color: 'var(--ink)',
            margin: '0 0 8px',
          }}
        >
          Check your email
        </p>
        <p
          style={{
            fontFamily: 'var(--font-dm-mono, monospace)',
            fontSize: '12px',
            color: 'var(--ink-muted)',
            margin: '0 0 20px',
          }}
        >
          Magic link sent to {email}
        </p>
        <button
          onClick={() => { setSent(false); setEmail('') }}
          style={{
            fontFamily: 'var(--font-dm-mono, monospace)',
            fontSize: '11px',
            color: 'var(--ink-muted)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Use a different email
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--rule)',
        padding: '24px',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-barlow-condensed, sans-serif)',
          fontSize: '22px',
          fontWeight: 700,
          color: 'var(--ink)',
          margin: '0 0 20px',
        }}
      >
        Sign in
      </h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--ink-muted)',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            style={{
              width: '100%',
              backgroundColor: 'var(--surface-alt)',
              border: '1px solid var(--rule)',
              color: 'var(--ink)',
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '14px',
              padding: '10px 12px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {error && (
          <p
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '12px',
              color: 'var(--brick)',
              marginBottom: '12px',
              lineHeight: 1.5,
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !email}
          className="btn-approve"
          style={{
            width: '100%',
            justifyContent: 'center',
            opacity: loading || !email ? 0.6 : 1,
            cursor: loading || !email ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Sending...' : 'Send magic link →'}
        </button>
      </form>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--canvas)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
      className="dashboard"
    >
      <div style={{ width: '100%', maxWidth: '380px' }}>
        {/* Wordmark */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <span
            className="font-wordmark"
            style={{ fontSize: '24px', color: 'var(--brick)' }}
          >
            bootslapped
          </span>
          <p
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '12px',
              color: 'var(--ink-muted)',
              marginTop: '8px',
            }}
          >
            Editorial dashboard
          </p>
        </div>

        {/* useSearchParams must be inside Suspense */}
        <Suspense fallback={<div style={{ height: '160px' }} />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
