import Link from 'next/link'
import type { Tool } from '@/types'

interface ToolDirectoryRowProps {
  tool: Tool
}

export function ToolDirectoryRow({ tool }: ToolDirectoryRowProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '20px',
        padding: '16px 0',
        borderBottom: '1px solid var(--ash)',
        alignItems: 'start',
      }}
    >
      {/* Left: name + description */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '12px',
            marginBottom: '6px',
            flexWrap: 'wrap',
          }}
        >
          <span
            className="font-heading"
            style={{
              fontSize: '16px',
              color: 'var(--bone)',
              fontWeight: 700,
            }}
          >
            {tool.name}
          </span>
          {tool.affiliate && (
            <span
              style={{
                fontFamily: 'var(--font-dm-mono, monospace)',
                fontSize: '10px',
                color: 'var(--brick)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Affiliate
            </span>
          )}
        </div>
        <p
          style={{
            fontFamily: 'var(--font-dm-mono, monospace)',
            fontSize: '13px',
            color: 'var(--dust)',
            margin: '0 0 10px',
            lineHeight: 1.55,
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
                  letterSpacing: '0.08em',
                  border: '1px solid var(--ash)',
                  padding: '2px 6px',
                  color: 'var(--dust)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Right: pricing + CTA */}
      <div style={{ textAlign: 'right', minWidth: '120px' }}>
        {tool.pricing && (
          <span
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '11px',
              color: 'var(--dust)',
              display: 'block',
              marginBottom: '8px',
            }}
          >
            {tool.pricing}
          </span>
        )}
        {tool.cta_url && (
          <Link
            href={tool.cta_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '11px',
              color: 'var(--brick)',
              whiteSpace: 'nowrap',
            }}
          >
            {tool.cta_label || `Visit ${tool.name} →`}
          </Link>
        )}
      </div>
    </div>
  )
}
