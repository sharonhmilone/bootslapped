'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { BriefDetail } from '@/components/dashboard/BriefDetail'
import { DraftEditor } from '@/components/dashboard/DraftEditor'
import { DecisionPanel } from '@/components/dashboard/DecisionPanel'
import { createClient } from '@/lib/supabase/client'
import type { ContentItem } from '@/types'

type Decision = 'approved' | 'rejected' | 'revision_requested'
import Link from 'next/link'

const DRAFT_TAGS = [
  'too surface-level',
  'wrong tone',
  'hedging language',
  'good depth',
  'well-structured',
  'needs specificity',
]

interface PageProps {
  params: Promise<{ id: string }>
}

export default function DraftReviewPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [item, setItem] = useState<ContentItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isUnpublishing, setIsUnpublishing] = useState(false)
  const [diffPatterns, setDiffPatterns] = useState<string[]>([])

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

  const handleSave = async (editedText: string) => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/diff-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: id, edited_text: editedText }),
      })

      if (response.ok) {
        const data = await response.json()
        setDiffPatterns(data.inferred_patterns ?? [])
        if (data.item) setItem(data.item)
      }
    } catch (error) {
      console.error('Save failed:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleRegenerate = async () => {
    setIsRegenerating(true)
    try {
      const response = await fetch('/api/regenerate-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: id }),
      })
      if (response.ok) {
        const data = await response.json()
        if (data.item) {
          setItem(data.item)
        }
      }
    } catch (error) {
      console.error('Regenerate failed:', error)
    } finally {
      setIsRegenerating(false)
    }
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: id }),
      })
      if (response.ok) {
        const data = await response.json()
        if (data.item) setItem(data.item)
      }
    } catch (error) {
      console.error('Publish failed:', error)
    } finally {
      setIsPublishing(false)
    }
  }

  const handleUnpublish = async () => {
    setIsUnpublishing(true)
    try {
      const response = await fetch('/api/unpublish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: id }),
      })
      if (response.ok) {
        const data = await response.json()
        if (data.item) setItem(data.item)
      }
    } catch (error) {
      console.error('Unpublish failed:', error)
    } finally {
      setIsUnpublishing(false)
    }
  }

  const handleDecision = async (decision: Decision, note: string, tags: string[]) => {
    setIsSubmitting(true)
    try {
      await fetch('/api/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: id, decision, note, tags }),
      })
    } catch (error) {
      console.error('Decision failed:', error)
    } finally {
      setIsSubmitting(false)
      router.push('/dashboard')
    }
  }

  if (isLoading) {
    return (
      <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--ink-muted)', fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '13px' }}>
        Loading draft...
      </div>
    )
  }

  if (!item) {
    return (
      <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--ink-muted)', fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '13px' }}>
        Draft not found.{' '}
        <Link href="/dashboard" style={{ color: 'var(--brick)' }}>
          Back to pipeline →
        </Link>
      </div>
    )
  }

  // Draft is generating or a revision is in progress — don't show stale editor
  if (item.status === 'brief_approved' || item.status === 'draft_pending' || item.status === 'revision_requested') {
    return (
      <div>
        <Link href="/dashboard" style={{ fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '11px', color: 'var(--ink-muted)', display: 'inline-block', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          ← Pipeline
        </Link>
        <div style={{ padding: '48px 0', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '8px' }}>
            {item.status === 'revision_requested'
              ? 'Revision is generating — this usually takes 30–45 seconds with Sonnet.'
              : 'Draft is generating — this usually takes 30–45 seconds with Sonnet.'}
          </p>
          <p style={{ fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '12px', color: 'var(--ink-muted)', marginBottom: '24px' }}>
            You&apos;ll get a Slack notification when it&apos;s ready.{' '}
            <Link href="/dashboard" style={{ color: 'var(--brick)' }}>
              Back to pipeline →
            </Link>
          </p>
          <div style={{ borderTop: '1px solid var(--rule)', paddingTop: '24px' }}>
            <p style={{ fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Stuck? Trigger manually:
            </p>
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="btn-approve"
              style={{ opacity: isRegenerating ? 0.6 : 1 }}
            >
              {isRegenerating ? 'Generating draft... (up to 30s)' : 'Generate draft now →'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Ready to publish — show publish controls, not the editorial decision panel
  if (item.status === 'ready_to_publish') {
    const isLive = !!item.published_at
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.bootslapped.com'
    const liveUrl = item.slug ? `${appUrl}/${item.format}/${item.slug}` : null

    return (
      <div>
        <Link href="/dashboard" style={{ fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '11px', color: 'var(--ink-muted)', display: 'inline-block', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          ← Pipeline
        </Link>

        {/* Status bar */}
        <div style={{ borderBottom: '1px solid var(--rule)', paddingBottom: '20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-barlow-condensed, sans-serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', margin: '0 0 4px', lineHeight: 1.2 }}>
              {item.topic}
            </p>
            <span style={{ fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: isLive ? '#4A9B8E' : 'var(--ink-muted)' }}>
              {isLive ? '● Live' : '○ Ready to publish'}
            </span>
          </div>

          {/* Publish / Unpublish actions */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {isLive && liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '11px', color: 'var(--ink-muted)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid var(--rule)', paddingBottom: '1px' }}
              >
                View live →
              </a>
            )}
            {isLive ? (
              <button
                onClick={handleUnpublish}
                disabled={isUnpublishing}
                className="btn-reject"
                style={{ opacity: isUnpublishing ? 0.6 : 1 }}
              >
                {isUnpublishing ? 'Unpublishing...' : 'Unpublish'}
              </button>
            ) : (
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="btn-approve"
                style={{ opacity: isPublishing ? 0.6 : 1 }}
              >
                {isPublishing ? 'Publishing...' : 'Push to CMS →'}
              </button>
            )}
          </div>
        </div>

        {/* Published metadata */}
        {isLive && item.published_at && (
          <div style={{ backgroundColor: 'rgba(74,155,142,0.05)', border: '1px solid rgba(74,155,142,0.2)', padding: '12px 16px', marginBottom: '24px' }}>
            <p style={{ fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '12px', color: 'var(--ink-muted)', margin: 0 }}>
              Published {new Date(item.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              {liveUrl && (
                <> · <a href={liveUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--steel-teal)', textDecoration: 'none' }}>{liveUrl}</a></>
              )}
            </p>
          </div>
        )}

        {/* Draft content — read only preview */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', alignItems: 'start' }}>
          <div style={{ position: 'sticky', top: '80px', backgroundColor: 'var(--surface)', border: '1px solid var(--rule)', padding: '16px', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
            <span style={{ fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--ink-muted)', display: 'block', marginBottom: '12px', borderBottom: '1px solid var(--rule)', paddingBottom: '8px' }}>
              Brief
            </span>
            <BriefDetail item={item} />
          </div>
          <DraftEditor
            initialText={item.edited_draft_text ?? item.draft_text ?? ''}
            onSave={handleSave}
            isSaving={isSaving}
          />
        </div>
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

      {/* Inferred patterns from diff analysis */}
      {diffPatterns.length > 0 && (
        <div
          style={{
            backgroundColor: 'rgba(74,155,142,0.06)',
            border: '1px solid rgba(74,155,142,0.2)',
            padding: '12px 16px',
            marginBottom: '24px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--steel-teal)',
              display: 'block',
              marginBottom: '8px',
            }}
          >
            Patterns detected from your edits
          </span>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {diffPatterns.map((p, i) => (
              <li
                key={i}
                style={{
                  fontFamily: 'var(--font-dm-mono, monospace)',
                  fontSize: '12px',
                  color: 'var(--ink)',
                  marginBottom: '4px',
                }}
              >
                – {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Three-column layout: brief | draft | decisions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr 280px',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Brief (left) */}
        <div
          style={{
            position: 'sticky',
            top: '80px',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--rule)',
            padding: '16px',
            maxHeight: 'calc(100vh - 120px)',
            overflowY: 'auto',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--ink-muted)',
              display: 'block',
              marginBottom: '12px',
              borderBottom: '1px solid var(--rule)',
              paddingBottom: '8px',
            }}
          >
            Brief
          </span>
          <BriefDetail item={item} />
        </div>

        {/* Draft editor (center) */}
        <DraftEditor
          initialText={item.edited_draft_text ?? item.draft_text ?? ''}
          onSave={handleSave}
          isSaving={isSaving}
        />

        {/* Decision panel (right) */}
        <div style={{ position: 'sticky', top: '80px' }}>
          <DecisionPanel
            itemId={id}
            decisionType="draft"
            decisionTags={DRAFT_TAGS.map((label) => ({ label }))}
            onDecision={handleDecision}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  )
}
