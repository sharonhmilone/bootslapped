import Link from 'next/link'
import type { Tool } from '@/types'

interface ToolRecommendationBlockProps {
  tool: Tool
  contextNote?: string
}

export function ToolRecommendationBlock({ tool, contextNote }: ToolRecommendationBlockProps) {
  return (
    <div
      style={{
        border: '1px solid var(--ash)',
        margin: '32px 0',
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: 'var(--cinder)',
          padding: '12px 16px',
          borderBottom: '1px solid var(--ash)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          className="label-text"
          style={{ color: 'var(--dust)' }}
        >
          Recommended tool
        </span>
        {tool.affiliate && (
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

      {/* Body */}
      <div style={{ padding: '20px 16px' }}>
        <h3
          className="font-heading"
          style={{
            fontSize: '22px',
            letterSpacing: '-0.005em',
            color: 'var(--bone)',
            margin: '0 0 10px',
          }}
        >
          {tool.name}
        </h3>

        <p
          style={{
            fontFamily: 'var(--font-dm-mono, monospace)',
            fontSize: '13px',
            color: 'var(--dust)',
            lineHeight: 1.6,
            margin: '0 0 14px',
          }}
        >
          {tool.description}
        </p>

        {contextNote && (
          <p
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '12px',
              color: 'var(--dust)',
              fontStyle: 'italic',
              margin: '0 0 14px',
              opacity: 0.7,
            }}
          >
            {contextNote}
          </p>
        )}

        {/* Tags */}
        {tool.tags && tool.tags.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              marginBottom: '16px',
            }}
          >
            {tool.tags!.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: 'var(--font-dm-mono, monospace)',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  border: '1px solid var(--ash)',
                  padding: '3px 8px',
                  color: 'var(--dust)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {tool.cta_url && (
            <Link
              href={tool.cta_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              {tool.cta_label || `Visit ${tool.name} →`}
            </Link>
          )}
          {tool.pricing && (
            <span
              style={{
                fontFamily: 'var(--font-dm-mono, monospace)',
                fontSize: '12px',
                color: 'var(--dust)',
              }}
            >
              {tool.pricing}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
