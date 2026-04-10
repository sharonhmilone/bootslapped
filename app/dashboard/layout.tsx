import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'
import { LogoutButton } from './LogoutButton'

export const metadata: Metadata = {
  title: {
    default: 'Dashboard',
    template: '%s — Bootslapped Dashboard',
  },
}

const dashboardLinks = [
  { label: 'Pipeline', href: '/dashboard' },
  { label: 'Publish queue', href: '/dashboard/publish-queue' },
  { label: 'Affiliates', href: '/dashboard/affiliate-programs' },
  { label: 'Context doc', href: '/dashboard/context-doc' },
  { label: 'Settings', href: '/dashboard/settings' },
]

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Auth gate
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    // .dashboard class activates the light surface token set and suppresses noise
    <div className="dashboard" style={{ minHeight: '100vh', backgroundColor: 'var(--canvas)' }}>
      {/* Dashboard nav */}
      <header
        style={{
          borderBottom: '1px solid var(--rule)',
          backgroundColor: 'var(--surface)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <nav
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '48px',
          }}
        >
          {/* Wordmark */}
          <Link
            href="/dashboard"
            className="font-wordmark"
            style={{
              fontSize: '18px',
              color: 'var(--brick)',
              letterSpacing: '0.01em',
            }}
          >
            bootslapped
          </Link>

          {/* Nav links */}
          <div style={{ display: 'flex', gap: '0', alignItems: 'center' }}>
            {dashboardLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: 'var(--font-dm-mono, monospace)',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--ink-muted)',
                  padding: '14px 16px',
                  display: 'block',
                  transition: 'color 0.15s',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User + logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                fontFamily: 'var(--font-dm-mono, monospace)',
                fontSize: '11px',
                color: 'var(--ink-muted)',
              }}
            >
              {user.email}
            </span>
            <LogoutButton />
          </div>
        </nav>
      </header>

      {/* Page content */}
      <main
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '32px 24px',
        }}
      >
        {children}
      </main>
    </div>
  )
}
