import Link from 'next/link'

export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--ash)',
        backgroundColor: 'var(--soot)',
        padding: '48px 24px 32px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Wordmark row */}
        <div style={{ marginBottom: '8px' }}>
          <span
            className="font-wordmark"
            style={{
              fontSize: '28px',
              color: 'var(--brick)',
              letterSpacing: '0.01em',
              display: 'block',
            }}
          >
            bootslapped
          </span>
          {/* Footer tagline — Barlow Condensed 700, brand statement */}
          <p
            className="font-heading"
            style={{
              fontSize: '18px',
              color: 'rgba(240,237,230,0.5)',
              margin: '4px 0 0',
              lineHeight: 1.2,
            }}
          >
            For founders who figure it out
          </p>
        </div>

        {/* Ruled divider */}
        <div style={{ borderTop: '1px solid var(--ash)', margin: '24px 0' }} />

        {/* 3-column footer nav */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px',
          }}
        >
          {/* Col 1: Content */}
          <div>
            <p
              className="label-text"
              style={{
                color: 'var(--dust)',
                marginBottom: '16px',
                letterSpacing: '0.12em',
              }}
            >
              Content
            </p>
            {[
              { label: 'Diagnostics', href: '/diagnostic' },
              { label: 'Guides', href: '/guide' },
              { label: 'Comparisons', href: '/comparison' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="label-text"
                style={{
                  color: 'var(--dust)',
                  display: 'block',
                  marginBottom: '10px',
                  transition: 'color 0.15s',
                }}
              >
                {link.label} →
              </Link>
            ))}
          </div>

          {/* Col 2: Tools */}
          <div>
            <p
              className="label-text"
              style={{
                color: 'var(--dust)',
                marginBottom: '16px',
                letterSpacing: '0.12em',
              }}
            >
              Tools
            </p>
            <Link
              href="/tools"
              className="label-text"
              style={{
                color: 'var(--dust)',
                display: 'block',
                marginBottom: '10px',
                transition: 'color 0.15s',
              }}
            >
              All tools →
            </Link>
          </div>

          {/* Col 3: More */}
          <div>
            <p
              className="label-text"
              style={{
                color: 'var(--dust)',
                marginBottom: '16px',
                letterSpacing: '0.12em',
              }}
            >
              More
            </p>
            <p
              style={{
                fontFamily: 'var(--font-dm-mono, monospace)',
                fontSize: '11px',
                color: 'rgba(240,237,230,0.4)',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Some links earn commission — doesn&apos;t change the recommendation
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
