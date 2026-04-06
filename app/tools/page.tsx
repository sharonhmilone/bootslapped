import { Nav } from '@/components/public/Nav'
import { Footer } from '@/components/public/Footer'
import { ToolsClient } from './ToolsClient'
import { createServiceClient } from '@/lib/supabase/server'
import type { Tool } from '@/types'

async function getTools(): Promise<Tool[]> {
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .order('directory_order', { ascending: true, nullsFirst: false })

    if (error) throw error
    return data ?? []
  } catch (err) {
    console.error('[tools] Failed to fetch tools:', err)
    return []
  }
}

export default async function ToolsPage() {
  const tools = await getTools()

  return (
    <>
      <Nav />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--ash)', padding: '48px 0 32px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-barlow-condensed, sans-serif)',
              fontSize: '48px',
              fontWeight: 700,
              color: 'var(--bone)',
              margin: '0 0 12px',
            }}
          >
            Tools directory
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '14px',
              color: 'var(--dust)',
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Tested, opinionated picks for bootstrapped founders. No fluff, no
            paid placements — affiliate links disclosed where they exist.
          </p>
        </div>

        {/* Interactive filter + list (client component) */}
        <ToolsClient tools={tools} />
      </main>

      <Footer />
    </>
  )
}
