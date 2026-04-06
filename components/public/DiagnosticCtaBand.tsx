import Link from 'next/link'

// Structural component — rendered on all article pages and homepage
// Not written by AI — fixed copy, Brick full-bleed background with grain
export function DiagnosticCtaBand() {
  return (
    <section
      style={{
        backgroundColor: 'var(--brick)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Brick-surface grain overlay */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.07,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <filter id="brick-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#brick-noise)" />
      </svg>

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '56px 24px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          position: 'relative',
        }}
      >
        {/* Left: overline + headline */}
        <div>
          <span
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
              color: 'rgba(240,237,230,0.6)',
              display: 'block',
              marginBottom: '12px',
            }}
          >
            Not sure where to start
          </span>
          <h2
            className="font-heading"
            style={{
              fontSize: 'clamp(32px, 7vw, 48px)',
              color: 'var(--bone)',
              lineHeight: 1.0,
              margin: '0 0 24px',
            }}
          >
            Take the free diagnostic
          </h2>

          {/* Mobile CTA */}
          <Link
            href="/diagnostic"
            className="btn-inverse"
            style={{ display: 'inline-block' }}
          >
            Take the diagnostic →
          </Link>
        </div>

        {/* Right: three steps + desktop CTA */}
        <div>
          <div style={{ marginBottom: '32px' }}>
            {[
              { n: '01', text: 'Answer five questions about your marketing' },
              { n: '02', text: 'Get a specific diagnosis, not generic advice' },
              { n: '03', text: 'See the fix — tools, copy, next steps' },
            ].map((step) => (
              <div
                key={step.n}
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  marginBottom: '20px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-dm-mono, monospace)',
                    fontSize: '10px',
                    color: 'var(--dust)',
                    paddingTop: '2px',
                    minWidth: '20px',
                  }}
                >
                  {step.n}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-dm-mono, monospace)',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--bone)',
                    lineHeight: 1.4,
                  }}
                >
                  {step.text}
                </span>
              </div>
            ))}
          </div>

          {/* Desktop CTA */}
          <Link
            href="/diagnostic"
            className="btn-inverse"
            style={{ display: 'inline-block' }}
          >
            Take the diagnostic →
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .diagnostic-cta-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
