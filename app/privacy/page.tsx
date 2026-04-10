import type { Metadata } from 'next'
import { Nav } from '@/components/public/Nav'
import { Footer } from '@/components/public/Footer'

export const metadata: Metadata = {
  title: 'Privacy — Bootslapped',
  description: 'How Bootslapped collects, uses, and protects your data.',
}

export default function PrivacyPage() {
  const lastUpdated = 'April 2026'

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
              Legal
            </span>
            <h1
              style={{
                fontFamily: 'var(--font-barlow-condensed, sans-serif)',
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 700,
                color: 'var(--bone)',
                lineHeight: 1.05,
                margin: '0 0 12px',
              }}
            >
              Privacy policy
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-dm-mono, monospace)',
                fontSize: '11px',
                color: 'var(--dust)',
                margin: 0,
                opacity: 0.6,
              }}
            >
              Last updated: {lastUpdated}
            </p>
          </div>
        </header>

        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px 64px' }}>
          {[
            {
              heading: 'What we collect',
              body: `When you visit this site, our hosting infrastructure logs basic request data — IP address, browser type, pages viewed, referrer. This is standard server logging, not persistent tracking. If you sign up for email updates, we collect your email address and the date you subscribed. Nothing else.`,
            },
            {
              heading: "What we don't collect",
              body: `We don't run advertising trackers. We don't sell data. We don't build behavioral profiles. We don't use third-party pixels for retargeting. If we add analytics in the future, it will be privacy-first (aggregated, no fingerprinting) and this policy will be updated to say so.`,
            },
            {
              heading: 'Cookies',
              body: `This site sets minimal cookies required for the site to function — session management if you're a logged-in user, and standard security tokens. We don't use cookies for advertising. If you use a browser with cookie controls, you can inspect exactly what's set.`,
            },
            {
              heading: 'Affiliate links',
              body: `When you click an affiliate link on this site, you may be tracked by the destination platform for purposes of commission attribution. That tracking is controlled by the third party, not by us. See the affiliate disclosure for more on how we handle those relationships editorially.`,
            },
            {
              heading: 'Email',
              body: `If you subscribe to email updates, your address is stored with our email service provider. You can unsubscribe at any time from any email we send. We don't share subscriber lists with third parties.`,
            },
            {
              heading: 'Data retention',
              body: `Server logs are retained for standard infrastructure diagnostics and deleted on a rolling basis. Email subscriber data is held until you unsubscribe. We don't archive data we don't need.`,
            },
            {
              heading: 'Your rights',
              body: `If you want to know what data we hold about you, have it corrected, or have it deleted, contact us. We'll respond within 30 days. If you're in the EU or UK, the standard GDPR rights apply.`,
            },
            {
              heading: 'Changes',
              body: `If this policy changes materially, we'll update the date above. We won't quietly expand data practices — any significant change will be documented here.`,
            },
          ].map(({ heading, body }) => (
            <div key={heading} style={{ marginBottom: '36px' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-barlow-condensed, sans-serif)',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: 'var(--bone)',
                  margin: '0 0 10px',
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
      </main>

      <Footer />
    </>
  )
}
