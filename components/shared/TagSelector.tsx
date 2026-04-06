'use client'

interface TagSelectorProps {
  tags: string[]
  selected: string[]
  onChange: (selected: string[]) => void
}

export function TagSelector({ tags, selected, onChange }: TagSelectorProps) {
  const toggle = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag))
    } else {
      onChange([...selected, tag])
    }
  }

  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
      {tags.map((tag) => {
        const isSelected = selected.includes(tag)
        return (
          <button
            key={tag}
            onClick={() => toggle(tag)}
            type="button"
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '4px 10px',
              border: isSelected ? '1px solid var(--brick)' : '1px solid var(--rule, var(--ash))',
              backgroundColor: isSelected ? 'var(--brick-tint)' : 'transparent',
              color: isSelected ? 'var(--brick)' : 'var(--ink-muted, var(--dust))',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {tag}
          </button>
        )
      })}
    </div>
  )
}
