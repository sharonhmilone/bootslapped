'use client'

import { useState } from 'react'

export default function SettingsPage() {
  const [contextDocFile, setContextDocFile] = useState<File | null>(null)
  const [slackWebhook, setSlackWebhook] = useState('')
  const [briefCount, setBriefCount] = useState(3)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

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

  return (
    <div style={{ maxWidth: '640px' }}>
      {/* Header */}
      <h1
        style={{
          fontFamily: 'var(--font-barlow-condensed, sans-serif)',
          fontSize: '24px',
          fontWeight: 700,
          color: 'var(--ink)',
          margin: '0 0 32px',
        }}
      >
        Settings
      </h1>

      {/* Context doc upload */}
      <section
        style={{
          border: '1px solid var(--rule)',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            borderBottom: '1px solid var(--rule)',
            padding: '12px 16px',
            backgroundColor: 'var(--surface)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--ink-muted)',
            }}
          >
            Context document
          </span>
        </div>

        <div style={{ padding: '20px' }}>
          <p
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '13px',
              color: 'var(--ink-muted)',
              margin: '0 0 16px',
              lineHeight: 1.6,
            }}
          >
            Upload a .md file to replace the active context document. This creates a new version
            — the old version is preserved in history.
          </p>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="file"
              accept=".md,.txt"
              onChange={(e) => setContextDocFile(e.target.files?.[0] ?? null)}
              style={{
                fontFamily: 'var(--font-dm-mono, monospace)',
                fontSize: '13px',
                color: 'var(--ink)',
              }}
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
            <p
              style={{
                fontFamily: 'var(--font-dm-mono, monospace)',
                fontSize: '12px',
                color: 'var(--steel-teal)',
                marginTop: '8px',
              }}
            >
              Context doc updated successfully.
            </p>
          )}
        </div>
      </section>

      {/* Brief generation defaults */}
      <section
        style={{
          border: '1px solid var(--rule)',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            borderBottom: '1px solid var(--rule)',
            padding: '12px 16px',
            backgroundColor: 'var(--surface)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--ink-muted)',
            }}
          >
            Brief generation
          </span>
        </div>

        <div style={{ padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                fontFamily: 'var(--font-dm-mono, monospace)',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--ink-muted)',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Briefs per run (default: 3)
            </label>
            <input
              type="number"
              min={1}
              max={10}
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
          </div>

          <p
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '12px',
              color: 'var(--ink-muted)',
              margin: 0,
            }}
          >
            Cron job runs Monday 8am UTC automatically. On-demand generation uses this count.
          </p>
        </div>
      </section>

      {/* Slack */}
      <section style={{ border: '1px solid var(--rule)' }}>
        <div
          style={{
            borderBottom: '1px solid var(--rule)',
            padding: '12px 16px',
            backgroundColor: 'var(--surface)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--ink-muted)',
            }}
          >
            Slack notifications
          </span>
        </div>

        <div style={{ padding: '20px' }}>
          <p
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '13px',
              color: 'var(--ink-muted)',
              margin: '0 0 16px',
              lineHeight: 1.6,
            }}
          >
            Set SLACK_WEBHOOK_URL in your Vercel environment variables. Create a Slack App with an
            incoming webhook at api.slack.com/apps and paste the webhook URL there.
          </p>

          <div
            style={{
              backgroundColor: 'var(--surface-alt)',
              border: '1px solid var(--rule)',
              padding: '12px',
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '12px',
              color: 'var(--ink-muted)',
            }}
          >
            SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
          </div>
        </div>
      </section>
    </div>
  )
}
