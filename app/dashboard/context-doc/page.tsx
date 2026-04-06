'use client'

import { useEffect, useState } from 'react'
import { ContextDocViewer } from '@/components/dashboard/ContextDocViewer'
import { ProposalCard } from '@/components/dashboard/ProposalCard'
import type { ContextDoc, ContextDocProposal } from '@/types'

export default function ContextDocPage() {
  const [doc, setDoc] = useState<ContextDoc | null>(null)
  const [history, setHistory] = useState<ContextDoc[]>([])
  const [proposals, setProposals] = useState<ContextDocProposal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchAll = async () => {
    const [docRes, proposalsRes] = await Promise.all([
      fetch('/api/context-doc').then((r) => r.json()),
      fetch('/api/context-doc/proposals').then((r) => r.json()),
    ])

    setDoc(docRes.active)
    setHistory(docRes.history ?? [])
    setProposals(proposalsRes.proposals ?? [])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const handleSave = async (content: string, changeNote: string) => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/context-doc', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, change_note: changeNote }),
      })
      if (response.ok) {
        await fetchAll()
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleProposal = async (id: string, action: 'approve' | 'reject') => {
    setIsSubmitting(true)
    try {
      await fetch('/api/context-doc/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposal_id: id, action }),
      })
      await fetchAll()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || !doc) {
    return (
      <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--ink-muted)', fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '13px' }}>
        Loading context doc...
      </div>
    )
  }

  return (
    <div>
      {/* Pending proposals */}
      {proposals.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <div
            style={{
              borderBottom: '1px solid var(--rule)',
              paddingBottom: '10px',
              marginBottom: '16px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-dm-mono, monospace)',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: 'var(--steel-teal)',
              }}
            >
              Pending proposals ({proposals.length})
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {proposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                onApprove={(id) => handleProposal(id, 'approve')}
                onReject={(id) => handleProposal(id, 'reject')}
                isSubmitting={isSubmitting}
              />
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--rule)', margin: '32px 0' }} />
        </div>
      )}

      {/* Context doc viewer/editor */}
      <ContextDocViewer
        doc={doc}
        history={history}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  )
}
