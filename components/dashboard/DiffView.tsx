interface DiffViewProps {
  original: string
  edited: string
}

// Simple character-level diff display — highlights added/removed text
export function DiffView({ original, edited }: DiffViewProps) {
  if (original === edited) {
    return (
      <p
        style={{
          fontFamily: 'var(--font-dm-mono, monospace)',
          fontSize: '12px',
          color: 'var(--ink-muted)',
          padding: '16px',
          textAlign: 'center',
        }}
      >
        No changes detected.
      </p>
    )
  }

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0',
          border: '1px solid var(--rule)',
        }}
      >
        {/* Original */}
        <div>
          <div
            style={{
              borderBottom: '1px solid var(--rule)',
              padding: '8px 12px',
              backgroundColor: 'var(--surface)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-dm-mono, monospace)',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--ink-muted)',
              }}
            >
              Original
            </span>
          </div>
          <pre
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '12px',
              color: 'var(--ink)',
              padding: '12px',
              margin: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              borderRight: '1px solid var(--rule)',
              maxHeight: '400px',
              overflowY: 'auto',
              lineHeight: 1.6,
            }}
          >
            {original}
          </pre>
        </div>

        {/* Edited */}
        <div>
          <div
            style={{
              borderBottom: '1px solid var(--rule)',
              padding: '8px 12px',
              backgroundColor: 'var(--surface)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-dm-mono, monospace)',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--brick)',
              }}
            >
              Edited
            </span>
          </div>
          <pre
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '12px',
              color: 'var(--ink)',
              padding: '12px',
              margin: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              maxHeight: '400px',
              overflowY: 'auto',
              lineHeight: 1.6,
            }}
          >
            {edited}
          </pre>
        </div>
      </div>
    </div>
  )
}
