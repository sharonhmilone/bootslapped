import Link from 'next/link'
import type { ToolSpotlight } from '@/types'

interface InDepthSpotlightProps {
  spotlight: ToolSpotlight
}

// Steel Teal label — implementation-layer signal, same as Ask AI
// Written and placed by editor, not generated through brief pipeline
export function InDepthSpotlight({ spotlight }: InDepthSpotlightProps) {
  const tool = spotlight.tool

  return (
    <section style={{ margin: '0' }}>
      {/* Section header */}
      <div
        style={{
          borderBottom: '1px solid var(--ash)',
          padding: '12px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          className="label-text"
          style={{
            color: 'var(--steel-teal)',
            letterSpacing: '0.14em',
          }}
        >
          In depth
        </span>
        {spotlight.affiliate && (
          <span
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '10px',
              color: 'var(--dust)',
              fontStyle: 'italic',
            }}
          >
            Affiliate link
          </span>
        )}
      </div>

      {/* Two-column layout on desktop */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 280px',
          gap: '40px',
          padding: '32px 0',
        }}
      >
        {/* Main content */}
        <div>
          {/* Tool name + category */}
          <h2
            className="font-heading"
            style={{
              fontSize: 'clamp(32px, 6vw, 48px)',
              color: 'var(--bone)',
              margin: '0 0 6px',
              lineHeight: 1.0,
            }}
          >
            {tool?.name ?? 'Tool'}
          </h2>
          <span
            className="label-text"
            style={{
              color: 'var(--brick)',
              display: 'block',
              marginBottom: '20px',
            }}
          >
            {tool?.category ?? ''}
          </span>

          {/* Hook */}
          <p
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '14px',
              color: 'rgba(240,237,230,0.82)',
              lineHeight: 1.75,
              margin: '0 0 16px',
            }}
          >
            {spotlight.hook}
          </p>

          {/* Detail */}
          <p
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '12px',
              color: 'var(--dust)',
              lineHeight: 1.7,
              margin: '0 0 20px',
            }}
          >
            {spotlight.detail}
          </p>

          {/* Tags */}
          {spotlight.tags && spotlight.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {spotlight.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: 'var(--font-dm-mono, monospace)',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    border: '1px solid var(--ash)',
                    padding: '2px 7px',
                    color: 'var(--dust)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer row */}
          <div
            style={{
              borderTop: '1px solid var(--ash)',
              paddingTop: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              flexWrap: 'wrap',
            }}
          >
            {spotlight.cta_url && (
              <Link
                href={spotlight.cta_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Visit {tool?.name ?? 'tool'} →
              </Link>
            )}
            {spotlight.pricing && (
              <span
                style={{
                  fontFamily: 'var(--font-dm-mono, monospace)',
                  fontSize: '12px',
                  color: 'var(--dust)',
                }}
              >
                {spotlight.pricing}
              </span>
            )}
          </div>
        </div>

        {/* Quick specs sidebar */}
        <aside
          style={{
            borderLeft: '1px solid var(--ash)',
            paddingLeft: '32px',
          }}
        >
          <span
            className="label-text"
            style={{
              color: 'var(--dust)',
              display: 'block',
              marginBottom: '16px',
            }}
          >
            Quick specs
          </span>

          {[
            { label: 'Best for', value: spotlight.best_for },
            { label: 'Not for', value: spotlight.not_for },
            { label: 'Migration', value: spotlight.migration_note },
            { label: 'Free tier', value: spotlight.free_tier_note },
          ]
            .filter((item) => item.value)
            .map((item) => (
              <div
                key={item.label}
                style={{
                  borderBottom: '1px solid var(--ash)',
                  padding: '10px 0',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-dm-mono, monospace)',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: 'var(--dust)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-dm-mono, monospace)',
                    fontSize: '12px',
                    color: 'var(--bone)',
                    lineHeight: 1.5,
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}

          {/* Compare links */}
          {spotlight.compare_links && spotlight.compare_links.length > 0 && (
            <div style={{ borderBottom: '1px solid var(--ash)', padding: '10px 0' }}>
              <span
                style={{
                  fontFamily: 'var(--font-dm-mono, monospace)',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: 'var(--dust)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                Compare
              </span>
              {spotlight.compare_links.map((link) => (
                <Link
                  key={link.url}
                  href={link.url}
                  style={{
                    fontFamily: 'var(--font-dm-mono, monospace)',
                    fontSize: '12px',
                    color: 'var(--brick)',
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  {link.label} →
                </Link>
              ))}
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}
