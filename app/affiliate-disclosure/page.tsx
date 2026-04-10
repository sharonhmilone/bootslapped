import type { Metadata } from 'next'
import { Nav } from '@/components/public/Nav'
import { Footer } from '@/components/public/Footer'

export const metadata: Metadata = {
  title: 'Affiliate Disclosure — Bootslapped',
  description: 'How Bootslapped handles affiliate relationships and editorial independence.',
}

export default function AffiliateDisclosurePage() {
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
              Disclosure
            </span>
            <h1
              style={{
                fontFamily: 'var(--font-barlow-condensed, sans-serif)',
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 700,
                color: 'var(--bone)',
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              Affiliate disclosure
            </h1>
          </div>
        </header>

        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px 64px' }}>
          {[
            {
              heading: 'The short version',
              body: `Some links on this site are affiliate links. If you click one and buy something, we may earn a commission at no extra cost to you. This is how we keep the lights on without charging you for access.`,
            },
            {
              heading: 'What that means in practice',
              body: `Affiliate relationships never determine what we recommend. Tools earn mentions based on fit for the problem being solved — not on commission rate, not on whether the company has a deal with us. If a tool doesn't belong in a recommendation, it doesn't get one. Full stop.`,
            },
            {
              heading: "What it doesn't mean",
              body: `We don't accept sponsored content. We don't let affiliate partners review or approve copy before it publishes. We don't inflate rankings to favor higher-commission options. Comparisons include tools we don't earn from when they're genuinely relevant — and we say so.`,
            },
            {
              heading: 'Identifying affiliate links',
              body: `Articles that include affiliate links carry a brief disclosure at the top: "Some links earn commission — doesn't change the recommendation." That's the only signal we add. We don't use asterisks, footnotes, or disclosure language that requires you to go looking for it.`,
            },
            {
              heading: 'Programs we participate in',
              body: `We work with affiliate programs for SaaS tools in the categories covered on this site — email platforms, CRMs, bookkeeping software, website builders, and related marketing and ops tools. The full list isn't fixed; it grows as we publish more content. The editorial standard stays the same regardless of what's in the program list.`,
            },
            {
              heading: 'Questions',
              body: `If you have a question about a specific recommendation or want to know whether a link is affiliate, you can reach out directly. Contact information is in the footer.`,
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
