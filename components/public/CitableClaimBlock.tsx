interface CitableClaimBlockProps {
  claim: string
}

export function CitableClaimBlock({ claim }: CitableClaimBlockProps) {
  return (
    <blockquote
      style={{
        borderLeft: '4px solid var(--brick)',
        backgroundColor: 'var(--cinder)',
        padding: '18px 20px',
        margin: '32px 0',
      }}
    >
      <p
        className="font-heading"
        style={{
          fontSize: '20px',
          fontWeight: 700,
          color: 'var(--bone)',
          lineHeight: 1.25,
          letterSpacing: '0.01em',
          margin: 0,
        }}
      >
        {claim}
      </p>
    </blockquote>
  )
}
