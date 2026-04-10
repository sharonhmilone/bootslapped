import type { Metadata } from 'next'
import { Nav } from '@/components/public/Nav'
import { Footer } from '@/components/public/Footer'
import { DiagnosticCtaBand } from '@/components/public/DiagnosticCtaBand'

export const metadata: Metadata = {
  title: 'About — Bootslapped',
  description: 'Bootslapped is editorial content for small business operators who are done guessing. Real diagnostics, real fixes, no fluff.',
}

export default function AboutPage() {
  return (
    <>
      <Nav />

      <main>
        <header style={{ borderBottom: '1px solid var(--ash)', padding: '48px 0 40px' }}>
          <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px' }}>
            <span
              style={{
                fontFamily: 'var(--font-dm-mono, monospace)',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: 'var(--brick)',
                display: 'block',
                marginBottom: '12px',
              }}
            >
              About
            </span>
            <h1
              style={{
                fontFamily: 'var(--font-barlow-condensed, sans-serif)',
                fontSize: 'clamp(32px, 5vw, 52px)',
                fontWeight: 700,
                color: 'var(--bone)',
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              For founders who figure it out
            </h1>
          </div>
        </header>

        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px 64px' }}>
          {[
            {
              heading: 'What this is',
              body: `Bootslapped is editorial content for small business operators who are done guessing. Every article is built around a specific problem — not a keyword, not a content calendar slot, not a chance to mention a tool we like. If you're here, something isn't working. We try to help you figure out what.`,
            },
            {
              heading: "Who it's for",
              body: `Solo operators, small teams, founders running businesses under $5M who are doing their own marketing, ops, and tool decisions. You're not a developer. You probably don't have a CMO. You're reading this because something in your stack or strategy isn't pulling its weight and you need a straight answer, not a 6,000-word overview that ends with "it depends."`,
            },
            {
              heading: 'How we work',
              body: `Three content formats: diagnostics (find the failure mode), guides (fix the specific thing), and comparisons (pick the right tool). Every piece goes through an editorial review before it publishes — we use AI for drafting and we use human judgment for everything else. The editorial standard is simple: would this actually help someone fix something, or is it just words?`,
            },
            {
              heading: 'On tools and recommendations',
              body: `Some articles link to tools. Some of those links earn commission when you buy. That doesn't change the editorial call — if a tool doesn't belong in a recommendation, it doesn't get one, affiliate deal or not. We also publish comparisons that include tools we don't earn from. See the affiliate disclosure for the full picture.`,
            },
          ].map(({ heading, body }) => (
            <div key={heading} style={{ marginBottom: '40px' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-barlow-condensed, sans-serif)',
                  fontSize: '26px',
                  fontWeight: 700,
                  color: 'var(--bone)',
                  margin: '0 0 12px',
                  lineHeight: 1.1,
                }}
              >
                {heading}
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-dm-mono, monospace)',
                  fontSize: '14px',
                  lineHeight: 1.75,
                  color: 'rgba(240, 237, 230, 0.85)',
                  margin: 0,
                }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>

        <DiagnosticCtaBand />
      </main>

      <Footer />
    </>
  )
}
