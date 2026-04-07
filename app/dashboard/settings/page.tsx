'use client'

import { useState, useEffect } from 'react'

const BRIEF_COUNT_KEY = 'bootslapped:briefCount'

function StatusDot({ ok }: { ok: boolean | null }) {
  if (ok === null) return (
    <span style={{ fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '11px', color: 'var(--ink-muted)' }}>
      checking...
    </span>
  )
  return (
    <span style={{ fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '11px', color: ok ? 'var(--steel-teal)' : 'var(--brick)' }}>
      {ok ? '● configured' : '● not set'}
    </span>
  )
}

export default function SettingsPage() {
  const [contextDocFile, setContextDocFile] = useState<File | null>(null)
  const [briefCount, setBriefCount] = useState(1)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [savedCount, setSavedCount] = useState(false)

  // Server-side config status
  const [slackOk, setSlackOk] = useState<boolean | null>(null)
  const [anthropicOk, setAnthropicOk] = useState<boolean | null>(null)
  const [cronOk, setCronOk] = useState<boolean | null>(null)

  // Load saved brief count from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(BRIEF_COUNT_KEY)
    if (stored) setBriefCount(Number(stored))
  }, [])

  // Fetch server config status
  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        setSlackOk(data.slack_configured ?? false)
        setAnthropicOk(data.anthropic_configured ?? false)
        setCronOk(data.cron_secret_configured ?? false)
      })
      .catch(() => {
        setSlackOk(false)
        setAnthropicOk(false)
        setCronOk(false)
      })
  }, [])

  const handleSaveBriefCount = () => {
    localStorage.setItem(BRIEF_COUNT_KEY, String(briefCount))
    setSavedCount(true)
    setTimeout(() => setSavedCount(false), 2000)
  }

  const handleFileUpload = async () => {
    if (!contextDocFile) return
    setIsUploading(true)
    try {
      const text = await contextDocFile.text()
      const response = await fetch('/api/context-doc', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: text,
          change_note: `Uploaded from file: ${contextDocFile.name}`,
        }),
      })
      if (response.ok) {
        setUploadSuccess(true)
        setContextDocFile(null)
        setTimeout(() => setUploadSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const sectionStyle = {
    border: '1px solid var(--rule)',
    marginBottom: '24px',
  }

  const sectionHeaderStyle = {
    borderBottom: '1px solid var(--rule)',
    padding: '12px 16px',
    backgroundColor: 'var(--surface)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }

  const labelStyle = {
    fontFamily: 'var(--font-dm-mono, monospace)',
    fontSize: '10px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.14em',
    color: 'var(--ink-muted)',
  }

  const bodyStyle = { padding: '20px' }

  const descStyle = {
    fontFamily: 'var(--font-dm-mono, monospace)',
    fontSize: '13px',
    color: 'var(--ink-muted)',
    margin: '0 0 16px',
    lineHeight: 1.6,
  }

  return (
    <div style={{ maxWidth: '640px' }}>
      <h1 style={{
        fontFamily: 'var(--font-barlow-condensed, sans-serif)',
        fontSize: '24px',
        fontWeight: 700,
        color: 'var(--ink)',
        margin: '0 0 32px',
      }}>
        Settings
      </h1>

      {/* Context doc upload */}
      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <span style={labelStyle}>Context document</span>
        </div>
        <div style={bodyStyle}>
          <p style={descStyle}>
            Upload a .md file to replace the active context document. Creates a new version — old version preserved in history.
          </p>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="file"
              accept=".md,.txt"
              onChange={(e) => setContextDocFile(e.target.files?.[0] ?? null)}
              style={{ fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '13px', color: 'var(--ink)' }}
            />
            {contextDocFile && (
              <button
                onClick={handleFileUpload}
                disabled={isUploading}
                className="btn-approve"
                style={{ opacity: isUploading ? 0.6 : 1 }}
              >
                {isUploading ? 'Uploading...' : 'Upload →'}
              </button>
            )}
          </div>
          {uploadSuccess && (
            <p style={{ fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '12px', color: 'var(--steel-teal)', marginTop: '8px' }}>
              Context doc updated successfully.
            </p>
          )}
        </div>
      </section>

      {/* Brief generation */}
      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <span style={labelStyle}>Brief generation</span>
        </div>
        <div style={bodyStyle}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ ...labelStyle, display: 'block', marginBottom: '8px' }}>
              Briefs per run
            </label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="number"
                min={1}
                max={5}
                value={briefCount}
                onChange={(e) => setBriefCount(Number(e.target.value))}
                style={{
                  width: '80px',
                  backgroundColor: 'var(--surface-alt)',
                  border: '1px solid var(--rule)',
                  color: 'var(--ink)',
                  fontFamily: 'var(--font-dm-mono, monospace)',
                  fontSize: '14px',
                  padding: '8px 12px',
                }}
              />
              <button onClick={handleSaveBriefCount} className="btn-ghost" style={{ fontSize: '11px', padding: '6px 14px' }}>
                {savedCount ? 'Saved ✓' : 'Save →'}
              </button>
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '12px', color: 'var(--ink-muted)', margin: 0 }}>
            Saved to this browser. Cron job runs Monday 8am UTC automatically using this count.
          </p>
        </div>
      </section>

      {/* Environment config status */}
      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <span style={labelStyle}>Environment config</span>
        </div>
        <div style={bodyStyle}>
          <p style={descStyle}>
            These are set in Vercel → Project → Environment Variables. Restart a deployment after changing them.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'ANTHROPIC_API_KEY', ok: anthropicOk },
              { label: 'SLACK_WEBHOOK_URL', ok: slackOk },
              { label: 'CRON_SECRET', ok: cronOk },
            ].map(({ label, ok }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '12px', color: 'var(--ink)' }}>
                  {label}
                </span>
                <StatusDot ok={ok} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
