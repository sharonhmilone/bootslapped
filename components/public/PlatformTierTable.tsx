import type { PlatformTier } from '@/types'

interface PlatformTierTableProps {
  tiers: PlatformTier[]
}

const TIER_STYLES: Record<string, { labelColor: string; toolColor: string }> = {
  'Built for this': { labelColor: 'var(--dust)', toolColor: 'var(--bone)' },
  'Can do it with effort': { labelColor: 'var(--dust)', toolColor: 'var(--bone)' },
  'Will fight you': { labelColor: 'var(--brick)', toolColor: 'var(--dust)' },
}

export function PlatformTierTable({ tiers }: PlatformTierTableProps) {
  return (
    <div
      style={{
        border: '1px solid var(--ash)',
        margin: '32px 0',
      }}
    >
      {tiers.map((tier, i) => {
        const styles = TIER_STYLES[tier.label] ?? TIER_STYLES['Built for this']
        return (
          <div
            key={tier.label}
            style={{
              display: 'grid',
              gridTemplateColumns: '160px 1fr',
              borderTop: i > 0 ? '1px solid var(--ash)' : 'none',
            }}
          >
            {/* Tier label */}
            <div
              style={{
                padding: '14px 16px',
                borderRight: '1px solid var(--ash)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-dm-mono, monospace)',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: styles.labelColor,
                }}
              >
                {tier.label}
              </span>
            </div>

            {/* Tools */}
            <div style={{ padding: '14px 16px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-dm-mono, monospace)',
                  fontSize: '13px',
                  color: styles.toolColor,
                  lineHeight: 1.6,
                }}
              >
                {tier.tools.join(', ')}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
