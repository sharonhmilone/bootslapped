'use client'

import { useState } from 'react'

interface AskAiBlockProps {
  prompt: string
}

// Parses [bracketed placeholders] and applies ghost-highlight treatment
function renderPromptWithHighlights(prompt: string) {
  const parts = prompt.split(/(\[[^\]]+\])/g)
  return parts.map((part, i) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      return (
        <span
          key={i}
          style={{
            background: 'rgba(255,255,255,0.07)',
            padding: '1px 5px',
          }}
        >
          {part}
        </span>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export function AskAiBlock({ prompt }: AskAiBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for non-secure contexts
    }
  }

  return (
    <div
      style={{
        borderLeft: '3px solid var(--steel-teal)',
        backgroundColor: 'var(--cinder)',
        padding: '20px',
        margin: '32px 0',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px',
        }}
      >
        <div>
          <span
            className="label-text"
            style={{
              color: 'var(--steel-teal)',
              letterSpacing: '0.16em',
              display: 'block',
              marginBottom: '4px',
            }}
          >
            Ask AI
          </span>
          <span
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '12px',
              color: 'var(--dust)',
            }}
          >
            Copy this prompt. Paste it into your AI assistant.
          </span>
        </div>
      </div>

      {/* Prompt text */}
      <p
        style={{
          fontFamily: 'var(--font-dm-mono, monospace)',
          fontSize: '14px',
          color: 'var(--bone)',
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        {renderPromptWithHighlights(prompt)}
      </p>

      {/* Footer */}
      <div
        style={{
          borderTop: '1px solid var(--ash)',
          marginTop: '16px',
          paddingTop: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-dm-mono, monospace)',
            fontSize: '10px',
            color: 'var(--dust)',
          }}
        >
          Fill in the brackets. The more specific, the more useful the answer.
        </span>
        <button
          onClick={handleCopy}
          className="btn-ghost"
          style={{
            fontSize: '11px',
            padding: '5px 12px',
            borderColor: copied ? 'var(--steel-teal)' : undefined,
            color: copied ? 'var(--steel-teal)' : undefined,
          }}
        >
          {copied ? 'Copied ✓' : 'Copy prompt →'}
        </button>
      </div>
    </div>
  )
}
