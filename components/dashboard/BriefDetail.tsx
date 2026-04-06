import type { ContentItem } from '@/types'
import { StatusBadge } from './StatusBadge'

interface BriefDetailProps {
  item: ContentItem
}

export function BriefDetail({ item }: BriefDetailProps) {
  return (
    <div>
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '1px solid var(--rule)',
          paddingBottom: '16px',
          marginBottom: '20px',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-barlow-condensed, sans-serif)',
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--ink)',
              margin: '0 0 8px',
              lineHeight: 1.1,
            }}
          >
            {item.topic ?? 'Untitled brief'}
          </h1>
          <StatusBadge status={item.status} />
        </div>
        <div style={{ textAlign: 'right' }}>
          {item.format && (
            <span
              style={{
                fontFamily: 'var(--font-dm-mono, monospace)',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--brick)',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              {item.format}
            </span>
          )}
          <span
              style={{
                fontFamily: 'var(--font-dm-mono, monospace)',
                fontSize: '11px',
                color: 'var(--ink-muted)',
              }}
            >
              ~1200 words
            </span>
        </div>
      </div>

      {/* Brief metadata */}
      {(item.angle || item.target_audience) && (
        <div style={{ marginBottom: '24px' }}>
          {item.angle && (
            <div style={{ marginBottom: '12px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-dm-mono, monospace)',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--ink-muted)',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Angle
              </span>
              <p
                style={{
                  fontFamily: 'var(--font-dm-mono, monospace)',
                  fontSize: '13px',
                  color: 'var(--ink)',
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {item.angle}
              </p>
            </div>
          )}
          {item.target_audience && (
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-dm-mono, monospace)',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--ink-muted)',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Audience
              </span>
              <p
                style={{
                  fontFamily: 'var(--font-dm-mono, monospace)',
                  fontSize: '13px',
                  color: 'var(--ink)',
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {item.target_audience}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Brief text */}
      {item.brief_text && (
        <div>
          <span
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--ink-muted)',
              display: 'block',
              marginBottom: '12px',
              borderBottom: '1px solid var(--rule)',
              paddingBottom: '8px',
            }}
          >
            Brief
          </span>
          <div
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '13px',
              color: 'var(--ink)',
              lineHeight: 1.75,
              whiteSpace: 'pre-wrap',
            }}
          >
            {item.brief_text}
          </div>
        </div>
      )}
    </div>
  )
}
