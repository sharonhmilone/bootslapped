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

        {/* Footer links + disclosure */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '24px',
              flexWrap: 'wrap',
            }}
          >
            {[
              { label: 'Diagnostic', href: '/diagnostic' },
              { label: 'Guide', href: '/guide' },
              { label: 'Comparison', href: '/comparison' },
              { label: 'Tools', href: '/tools' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="label-text"
                style={{
                  color: 'var(--dust)',
                  transition: 'color 0.15s',
                }}
              >
                {link.label} →
              </Link>
            ))}
          </div>

          <p
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '11px',
              color: 'var(--dust)',
              margin: 0,
            }}
          >
            Some links earn commission – doesn&apos;t change the recommendation
          </p>
        </div>
      </div>
    </footer>
  )
}
