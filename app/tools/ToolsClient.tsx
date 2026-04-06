'use client'

import { useState } from 'react'
import { ToolDirectoryRow } from '@/components/public/ToolDirectoryRow'
import type { Tool, ToolCategory } from '@/types'

const CATEGORY_LABELS: Record<ToolCategory | 'all', string> = {
  all: 'All',
  email: 'Email',
  analytics: 'Analytics',
  automation: 'Automation',
  'landing-pages': 'Landing pages',
  bookkeeping: 'Bookkeeping',
  crm: 'CRM',
  seo: 'SEO',
  social: 'Social',
}

interface ToolsClientProps {
  tools: Tool[]
}

export function ToolsClient({ tools }: ToolsClientProps) {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all')

  // Build the category list from what's actually in the tools data
  const presentCategories = Array.from(new Set(tools.map((t) => t.category))) as ToolCategory[]
  const categories: Array<ToolCategory | 'all'> = ['all', ...presentCategories]

  const filtered = activeCategory === 'all'
    ? tools
    : tools.filter((t) => t.category === activeCategory)

  return (
    <>
      {/* Category filter */}
      <div
        style={{
          borderBottom: '1px solid var(--ash)',
          padding: '16px 0',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '6px 14px',
              border: '1px solid var(--ash)',
              backgroundColor: activeCategory === cat ? 'var(--brick)' : 'transparent',
              color: activeCategory === cat ? 'var(--bone)' : 'var(--dust)',
              cursor: 'pointer',
              transition: 'background-color 0.15s, color 0.15s',
            }}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Tool rows */}
      <div style={{ paddingBottom: '64px' }}>
        {filtered.length === 0 ? (
          <p
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '13px',
              color: 'var(--dust)',
              padding: '32px 0',
              opacity: 0.6,
            }}
          >
            No tools in this category yet.
          </p>
        ) : (
          filtered.map((tool) => (
            <ToolDirectoryRow key={tool.id} tool={tool} />
          ))
        )}
      </div>
    </>
  )
}
