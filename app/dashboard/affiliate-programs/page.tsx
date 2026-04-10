'use client'

import { useEffect, useState } from 'react'
import type { AffiliateProgram, TopicDomain, CommissionType, EnrollmentStatus } from '@/types'

const DOMAIN_OPTIONS: { value: TopicDomain; label: string }[] = [
  { value: 'email', label: 'Email' },
  { value: 'crm', label: 'CRM' },
  { value: 'bookkeeping', label: 'Bookkeeping' },
  { value: 'website', label: 'Website' },
  { value: 'content', label: 'Content' },
  { value: 'conversion', label: 'Conversion' },
  { value: 'stack', label: 'Stack' },
  { value: 'ai-tools', label: 'AI Tools' },
]

const COMMISSION_OPTIONS: { value: CommissionType; label: string }[] = [
  { value: 'percentage', label: 'Percentage (%)' },
  { value: 'flat', label: 'Flat fee ($)' },
  { value: 'recurring', label: 'Recurring (monthly)' },
]

const STATUS_CONFIG: Record<EnrollmentStatus, { label: string; color: string }> = {
  not_enrolled: { label: 'Not enrolled', color: 'var(--ink-muted)' },
  applied: { label: 'Applied', color: '#C9A227' },
  active: { label: 'Active', color: 'var(--steel-teal)' },
  paused: { label: 'Paused', color: 'var(--brick)' },
}

const DOMAIN_LABELS: Record<TopicDomain, string> = {
  email: 'Email', crm: 'CRM', bookkeeping: 'Bookkeeping', website: 'Website',
  content: 'Content', conversion: 'Conversion', stack: 'Stack', 'ai-tools': 'AI Tools',
}

const DOMAIN_ORDER: TopicDomain[] = [
  'email', 'crm', 'bookkeeping', 'website', 'content', 'conversion', 'stack', 'ai-tools',
]

const EMPTY_FORM = {
  program_name: '',
  topic_domain: '' as TopicDomain | '',
  commission_type: '' as CommissionType | '',
  commission_rate: '',
  signup_url: '',
  enrollment_status: 'not_enrolled' as EnrollmentStatus,
  notes: '',
}

export default function AffiliateProgramsPage() {
  const [programs, setPrograms] = useState<AffiliateProgram[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/affiliate-programs')
      .then((r) => r.json())
      .then((d) => setPrograms(d.programs ?? []))
      .finally(() => setIsLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    if (!form.program_name || !form.topic_domain || !form.commission_type) {
      setFormError('Program name, domain, and commission type are required.')
      return
    }
    setIsSaving(true)
    try {
      const res = await fetch('/api/affiliate-programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setFormError(data.error ?? 'Save failed')
        return
      }
      setPrograms((prev) => [...prev, data.program])
      setForm(EMPTY_FORM)
      setShowForm(false)
    } catch {
      setFormError('Network error — try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleStatusChange = async (id: string, enrollment_status: EnrollmentStatus) => {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/affiliate-programs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollment_status }),
      })
      if (res.ok) {
        const data = await res.json()
        setPrograms((prev) => prev.map((p) => (p.id === id ? data.program : p)))
      }
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove "${name}" from the affiliate programs list?`)) return
    await fetch(`/api/affiliate-programs/${id}`, { method: 'DELETE' })
    setPrograms((prev) => prev.filter((p) => p.id !== id))
  }

  // Group by domain
  const grouped = DOMAIN_ORDER.reduce<Record<string, AffiliateProgram[]>>((acc, domain) => {
    const group = programs.filter((p) => p.topic_domain === domain)
    if (group.length > 0) acc[domain] = group
    return acc
  }, {})

  const unenrolledCount = programs.filter((p) => p.enrollment_status === 'not_enrolled').length
  const activeCount = programs.filter((p) => p.enrollment_status === 'active').length

  return (
    <div>
      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-barlow-condensed, sans-serif)',
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--ink)',
              margin: '0 0 4px',
            }}
          >
            Affiliate programs
          </h1>
          <p style={{ fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '12px', color: 'var(--ink-muted)', margin: 0 }}>
            {programs.length === 0
              ? 'No programs tracked yet'
              : `${programs.length} program${programs.length === 1 ? '' : 's'} — ${activeCount} active, ${unenrolledCount} not enrolled`}
          </p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setFormError(null) }}
          className="btn-approve"
        >
          {showForm ? 'Cancel' : '+ Add program'}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--rule)',
            padding: '20px',
            marginBottom: '32px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--ink-muted)',
              display: 'block',
              marginBottom: '16px',
            }}
          >
            New program
          </span>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            {/* Program name */}
            <div>
              <label style={{ fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '11px', color: 'var(--ink-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Program name <span style={{ color: 'var(--brick)' }}>*</span>
              </label>
              <input
                type="text"
                value={form.program_name}
                onChange={(e) => setForm((f) => ({ ...f, program_name: e.target.value }))}
                placeholder="e.g. ConvertKit"
                style={{
                  width: '100%',
                  fontFamily: 'var(--font-dm-mono, monospace)',
                  fontSize: '13px',
                  backgroundColor: 'var(--canvas)',
                  border: '1px solid var(--rule)',
                  color: 'var(--ink)',
                  padding: '8px 10px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Domain */}
            <div>
              <label style={{ fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '11px', color: 'var(--ink-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Domain <span style={{ color: 'var(--brick)' }}>*</span>
              </label>
              <select
                value={form.topic_domain}
                onChange={(e) => setForm((f) => ({ ...f, topic_domain: e.target.value as TopicDomain }))}
                style={{
                  width: '100%',
                  fontFamily: 'var(--font-dm-mono, monospace)',
                  fontSize: '13px',
                  backgroundColor: 'var(--canvas)',
                  border: '1px solid var(--rule)',
                  color: form.topic_domain ? 'var(--ink)' : 'var(--ink-muted)',
                  padding: '8px 10px',
                }}
              >
                <option value="">Select domain…</option>
                {DOMAIN_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>

            {/* Commission type */}
            <div>
              <label style={{ fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '11px', color: 'var(--ink-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Commission type <span style={{ color: 'var(--brick)' }}>*</span>
              </label>
              <select
                value={form.commission_type}
                onChange={(e) => setForm((f) => ({ ...f, commission_type: e.target.value as CommissionType }))}
                style={{
                  width: '100%',
                  fontFamily: 'var(--font-dm-mono, monospace)',
                  fontSize: '13px',
                  backgroundColor: 'var(--canvas)',
                  border: '1px solid var(--rule)',
                  color: form.commission_type ? 'var(--ink)' : 'var(--ink-muted)',
                  padding: '8px 10px',
                }}
              >
                <option value="">Select type…</option>
                {COMMISSION_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            {/* Rate */}
            <div>
              <label style={{ fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '11px', color: 'var(--ink-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Rate
              </label>
              <input
                type="text"
                value={form.commission_rate}
                onChange={(e) => setForm((f) => ({ ...f, commission_rate: e.target.value }))}
                placeholder="e.g. 30% or $25/referral"
                style={{
                  width: '100%',
                  fontFamily: 'var(--font-dm-mono, monospace)',
                  fontSize: '13px',
                  backgroundColor: 'var(--canvas)',
                  border: '1px solid var(--rule)',
                  color: 'var(--ink)',
                  padding: '8px 10px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Signup URL */}
            <div>
              <label style={{ fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '11px', color: 'var(--ink-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Signup URL
              </label>
              <input
                type="url"
                value={form.signup_url}
                onChange={(e) => setForm((f) => ({ ...f, signup_url: e.target.value }))}
                placeholder="https://…"
                style={{
                  width: '100%',
                  fontFamily: 'var(--font-dm-mono, monospace)',
                  fontSize: '13px',
                  backgroundColor: 'var(--canvas)',
                  border: '1px solid var(--rule)',
                  color: 'var(--ink)',
                  padding: '8px 10px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '11px', color: 'var(--ink-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={2}
              placeholder="Payment terms, approval notes, contact, etc."
              style={{
                width: '100%',
                fontFamily: 'var(--font-dm-mono, monospace)',
                fontSize: '13px',
                backgroundColor: 'var(--canvas)',
                border: '1px solid var(--rule)',
                color: 'var(--ink)',
                padding: '8px 10px',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {formError && (
            <p style={{ fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '12px', color: 'var(--brick)', marginBottom: '12px' }}>
              {formError}
            </p>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-approve" disabled={isSaving} style={{ opacity: isSaving ? 0.6 : 1 }}>
              {isSaving ? 'Saving…' : 'Save program'}
            </button>
          </div>
        </form>
      )}

      {/* Loading */}
      {isLoading && (
        <p style={{ fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '13px', color: 'var(--ink-muted)' }}>
          Loading…
        </p>
      )}

      {/* Empty state */}
      {!isLoading && programs.length === 0 && (
        <div
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            border: '1px dashed var(--rule)',
            backgroundColor: 'var(--surface)',
          }}
        >
          <p style={{ fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '13px', color: 'var(--ink-muted)', margin: '0 0 8px' }}>
            No affiliate programs tracked yet.
          </p>
          <p style={{ fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '12px', color: 'var(--ink-muted)', margin: 0, opacity: 0.6 }}>
            Add programs as you sign up — track domain, rate, and enrollment status.
          </p>
        </div>
      )}

      {/* Program table grouped by domain */}
      {!isLoading && programs.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {Object.entries(grouped).map(([domain, domainPrograms]) => (
            <div key={domain}>
              {/* Domain header */}
              <div
                style={{
                  borderBottom: '1px solid var(--rule)',
                  paddingBottom: '8px',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '10px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-dm-mono, monospace)',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    color: 'var(--brick)',
                  }}
                >
                  {DOMAIN_LABELS[domain as TopicDomain]}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-dm-mono, monospace)',
                    fontSize: '10px',
                    color: 'var(--ink-muted)',
                  }}
                >
                  {domainPrograms.length} program{domainPrograms.length === 1 ? '' : 's'}
                </span>
              </div>

              {/* Rows */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '5fr 3fr 2fr 2fr 3fr auto',
                  gap: '0',
                }}
              >
                {/* Column headers */}
                {['Program', 'Rate', 'Type', 'Status', 'Signup URL', ''].map((col) => (
                  <div
                    key={col}
                    style={{
                      fontFamily: 'var(--font-dm-mono, monospace)',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--ink-muted)',
                      padding: '0 12px 8px 0',
                      borderBottom: '1px solid var(--rule)',
                    }}
                  >
                    {col}
                  </div>
                ))}

                {/* Data rows */}
                {domainPrograms.map((prog) => {
                  const status = STATUS_CONFIG[prog.enrollment_status]
                  return (
                    <>
                      {/* Program name */}
                      <div
                        key={`${prog.id}-name`}
                        style={{
                          fontFamily: 'var(--font-dm-mono, monospace)',
                          fontSize: '13px',
                          color: 'var(--ink)',
                          padding: '12px 12px 12px 0',
                          borderBottom: '1px solid var(--rule)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                        }}
                      >
                        <span>{prog.program_name}</span>
                        {prog.tool?.name && (
                          <span style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>
                            linked to {prog.tool.name}
                          </span>
                        )}
                        {prog.notes && (
                          <span style={{ fontSize: '11px', color: 'var(--ink-muted)', fontStyle: 'italic' }}>
                            {prog.notes}
                          </span>
                        )}
                      </div>

                      {/* Rate */}
                      <div
                        key={`${prog.id}-rate`}
                        style={{
                          fontFamily: 'var(--font-dm-mono, monospace)',
                          fontSize: '13px',
                          color: prog.commission_rate ? 'var(--ink)' : 'var(--ink-muted)',
                          padding: '12px 12px 12px 0',
                          borderBottom: '1px solid var(--rule)',
                          alignSelf: 'center',
                        }}
                      >
                        {prog.commission_rate ?? '—'}
                      </div>

                      {/* Commission type */}
                      <div
                        key={`${prog.id}-type`}
                        style={{
                          fontFamily: 'var(--font-dm-mono, monospace)',
                          fontSize: '11px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: 'var(--ink-muted)',
                          padding: '12px 12px 12px 0',
                          borderBottom: '1px solid var(--rule)',
                          alignSelf: 'center',
                        }}
                      >
                        {prog.commission_type}
                      </div>

                      {/* Status picker */}
                      <div
                        key={`${prog.id}-status`}
                        style={{
                          padding: '12px 12px 12px 0',
                          borderBottom: '1px solid var(--rule)',
                          alignSelf: 'center',
                        }}
                      >
                        <select
                          value={prog.enrollment_status}
                          disabled={updatingId === prog.id}
                          onChange={(e) =>
                            handleStatusChange(prog.id, e.target.value as EnrollmentStatus)
                          }
                          style={{
                            fontFamily: 'var(--font-dm-mono, monospace)',
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: status.color,
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                            <option key={val} value={val} style={{ color: 'var(--ink)', backgroundColor: 'var(--canvas)', textTransform: 'uppercase' }}>
                              {cfg.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Signup URL */}
                      <div
                        key={`${prog.id}-url`}
                        style={{
                          padding: '12px 12px 12px 0',
                          borderBottom: '1px solid var(--rule)',
                          alignSelf: 'center',
                        }}
                      >
                        {prog.signup_url ? (
                          <a
                            href={prog.signup_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontFamily: 'var(--font-dm-mono, monospace)',
                              fontSize: '11px',
                              color: 'var(--steel-teal)',
                              textDecoration: 'none',
                              borderBottom: '1px solid rgba(74,155,142,0.3)',
                            }}
                          >
                            Apply →
                          </a>
                        ) : (
                          <span style={{ fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '11px', color: 'var(--ink-muted)' }}>—</span>
                        )}
                      </div>

                      {/* Delete */}
                      <div
                        key={`${prog.id}-del`}
                        style={{
                          padding: '12px 0',
                          borderBottom: '1px solid var(--rule)',
                          alignSelf: 'center',
                        }}
                      >
                        <button
                          onClick={() => handleDelete(prog.id, prog.program_name)}
                          style={{
                            background: 'none',
                            border: 'none',
                            fontFamily: 'var(--font-dm-mono, monospace)',
                            fontSize: '11px',
                            color: 'var(--ink-muted)',
                            cursor: 'pointer',
                            padding: 0,
                            opacity: 0.5,
                          }}
                        >
                          ×
                        </button>
                      </div>
                    </>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
