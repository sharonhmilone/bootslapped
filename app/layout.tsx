import type { Metadata } from 'next'
import { Oswald, Barlow_Condensed, DM_Mono } from 'next/font/google'
import './globals.css'

// Oswald 700 — wordmark only (nav, footer)
const oswald = Oswald({
  weight: ['700'],
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
})

// Barlow Condensed 700 — all headings
const barlowCondensed = Barlow_Condensed({
  weight: ['700'],
  subsets: ['latin'],
  variable: '--font-barlow-condensed',
  display: 'swap',
})

// DM Mono 400 — body copy, all UI text
const dmMono = DM_Mono({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-dm-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Bootslapped',
    template: '%s — Bootslapped',
  },
  description:
    'Diagnostic content and decision infrastructure for bootstrapped founders. Figure out why your marketing isn\'t working and what to fix.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    siteName: 'Bootslapped',
    type: 'website',
  },
}

// Noise texture SVG — fractalNoise overlay, public site only
// Opacity controlled by --noise-opacity CSS var (0 on dashboard)
const NoiseTexture = () => (
  <svg
    className="noise-overlay"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <filter id="bs-noise">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.65"
        numOctaves="3"
        stitchTiles="stitch"
      />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#bs-noise)" />
  </svg>
)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${barlowCondensed.variable} ${dmMono.variable}`}
    >
      <body className="min-h-screen">
        <NoiseTexture />
        {children}
      </body>
    </html>
  )
}
