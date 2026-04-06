'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { BriefDetail } from '@/components/dashboard/BriefDetail'
import { DecisionPanel } from '@/components/dashboard/DecisionPanel'
import { createClient } from '@/lib/supabase/client'
import type { ContentItem } from '@/types'

type Decision = 'approved' | 'rejected' | 'revision_requested'
import Link from 'next/link'

const BRIEF_TAGS = [
  'wrong angle',
  'unclear audience',
  'off-brief',
  'strong angle',
]

interface PageProps {
  params: Promise<{ id: string }>
}

export default function BriefReviewPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [item, setItem] = useState<ContentItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('content_items')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data) setItem(data as ContentItem)
        setIsLoading(false)
      })
  }, [id])

  const handleDecision = async (decision: Decision, note: string, tags: string[]) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: id, decision, note, tags }),
      })

      if (response.ok) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Decision failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--ink-muted)', fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '13px' }}>
        Loading brief...
      </div>
    )
  }

  if (!item) {
    return (
      <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--ink-muted)', fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '13px' }}>
        Brief not found.{' '}
        <Link href="/dashboard" style={{ color: 'var(--brick)' }}>
          Back to pipeline →
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Back link */}
      <Link
        href="/dashboard"
        style={{
          fontFamily: 'var(--font-dm-mono, monospace)',
          fontSize: '11px',
          color: 'var(--ink-muted)',
          display: 'inline-block',
          marginBottom: '24px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}
      >
        ← Pipeline
      </Link>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gap: '32px',
          alignItems: 'start',
        }}
      >
        {/* Brief */}
        <BriefDetail item={item} />

        {/* Decision panel */}
        <div style={{ position: 'sticky', top: '80px' }}>
          <DecisionPanel
            itemId={id}
            decisionType="brief"
            decisionTags={BRIEF_TAGS.map((label) => ({ label }))}
            onDecision={handleDecision}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  )
}
