import Link from 'next/link'
import type { Tool } from '@/types'

interface FeaturedToolCardProps {
  tool: Tool
}

export function FeaturedToolCard({ tool }: FeaturedToolCardProps) {
  return (
    <div
      style={{
        backgroundColor: 'var(--cinder)',
        border: '1px solid var(--ash)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top row */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid var(--ash)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <h3
            className="font-heading"
            style={{
              fontSize: '28px',
              color: 'var(--bone)',
              margin: '0 0 4px',
              lineHeight: 1.0,
            }}
          >
            {tool.name}
          </h3>
          <span
            className="label-text"
            style={{ color: 'var(--brick)' }}
          >
            {tool.category}
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          {tool.affiliate && (
            <span
              style={{
                backgroundColor: 'var(--brick)',
                color: 'var(--bone)',
                fontFamily: 'var(--font-dm-mono, monospace)',
                fontSize: '11px',
                padding: '3px 8px',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              Deal
            </span>
          )}
          {tool.pricing_note && (
            <span
              style={{
                fontFamily: 'var(--font-dm-mono, monospace)',
                fontSize: '11px',
                color: 'var(--dust)',
                display: 'block',
              }}
            >
              {tool.pricing_note}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '16px', flex: 1 }}>
        <p
          style={{
            fontFamily: 'var(--font-dm-mono, monospace)',
            fontSize: '13px',
            color: 'rgba(240,237,230,0.75)',
            lineHeight: 1.7,
            margin: '0 0 14px',
          }}
        >
          {tool.description}
        </p>

        {/* Tags */}
        {tool.tags && tool.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {tool.tags.map((tag) => (
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
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: '1px solid var(--ash)',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {tool.cta_url ? (
          <Link
            href={tool.cta_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '11px',
              color: 'var(--brick)',
              transition: 'color 0.15s',
            }}
          >
            {tool.cta_label || `Visit ${tool.name} →`}
          </Link>
        ) : (
          <span />
        )}
        {tool.featured_note && (
          <span
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '10px',
              color: 'var(--dust)',
              fontStyle: 'italic',
              maxWidth: '160px',
              textAlign: 'right',
            }}
          >
            {tool.featured_note}
          </span>
        )}
      </div>
    </div>
  )
}
