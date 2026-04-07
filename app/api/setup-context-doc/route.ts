import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { readFileSync } from 'fs'
import { join } from 'path'

/**
 * POST /api/setup-context-doc
 *
 * One-time seed: inserts the Editorial Playbook + Style Guide as the
 * active context doc. Safe to call multiple times — creates a new
 * version each time rather than overwriting.
 *
 * Requires user to be logged in.
 */
export async function POST() {
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()

  // Read docs from the project
  const docsDir = join(process.cwd(), 'docs')
  const playbook = readFileSync(join(docsDir, 'editorial-playbook.md'), 'utf-8')
  const styleGuide = readFileSync(join(docsDir, 'style-guide.md'), 'utf-8')

  // Combine: playbook is the primary governance document, style guide is appended
  const content = `${playbook}

---

# Appendix: Bootslapped Brand Style Guide

The following is the visual and voice style guide. It governs UI copy, component naming, typography, and design token usage. For article voice and editorial standards, the Editorial Playbook above takes precedence. For interface copy, component descriptions, and design-layer decisions, this style guide governs.

${styleGuide}`

  // Get current version (0 if no docs exist yet)
  const { data: existing } = await supabase
    .from('context_doc')
    .select('version')
    .order('version', { ascending: false })
    .limit(1)
    .single()

  const nextVersion = (existing?.version ?? 0) + 1

  // Deactivate any existing active doc
  await supabase
    .from('context_doc')
    .update({ is_active: false })
    .eq('is_active', true)

  // Insert new active version
  const { data: newDoc, error } = await supabase
    .from('context_doc')
    .insert({
      content,
      version: nextVersion,
      is_active: true,
      change_note: `Seeded from Editorial Playbook v1.1 + Style Guide v3.1`,
    })
    .select()
    .single()

  if (error) {
    console.error('[setup-context-doc] Insert error:', error)
    return NextResponse.json({ error: 'Failed to seed context doc' }, { status: 500 })
  }

  return NextResponse.json({
    message: `Context doc seeded as version ${nextVersion}`,
    doc: { id: newDoc.id, version: newDoc.version, length: content.length },
  })
}
