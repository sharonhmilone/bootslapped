'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { label: 'Diagnostic', href: '/diagnostic' },
  { label: 'Guide', href: '/guide' },
  { label: 'Comparison', href: '/comparison' },
  { label: 'Tools', href: '/tools' },
]

export function Nav() {
  const pathname = usePathname()

  return (
    <header
      style={{
        borderBottom: '1px solid var(--ash)',
        backgroundColor: 'var(--soot)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <nav
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '52px',
        }}
      >
        {/* Wordmark — Oswald 700 only */}
        <Link
          href="/"
          className="font-wordmark"
          style={{
            fontSize: '20px',
            color: 'var(--brick)',
            letterSpacing: '0.01em',
            textDecoration: 'none',
          }}
        >
          bootslapped
        </Link>

        {/* Navigation links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0',
          }}
        >
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className="label-text"
                style={{
                  padding: '16px 16px',
                  color: isActive ? 'var(--brick)' : 'var(--dust)',
                  borderBottom: isActive ? '2px solid var(--brick)' : '2px solid transparent',
                  transition: 'color 0.15s, border-color 0.15s',
                  display: 'block',
                  lineHeight: 1,
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
