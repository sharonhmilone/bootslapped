// ============================================================
// BOOTSLAPPED — TypeScript Types (aligned with schema.sql)
// ============================================================

// Content status flow:
// brief_pending → brief_approved / brief_rejected
// brief_approved → draft_pending → draft_review
// draft_review → revision_requested / ready_to_publish

export type ContentStatus =
  | 'brief_pending'
  | 'brief_approved'
  | 'brief_rejected'
  | 'draft_pending'
  | 'draft_review'
  | 'revision_requested'
  | 'ready_to_publish'

export type ArticleFormat = 'diagnostic' | 'guide' | 'comparison'

export type ProposalStatus = 'pending' | 'approved' | 'rejected'

// ---- Database row types (mirrors schema.sql exactly) ----

export interface ContentItem {
  id: string
  created_at: string
  updated_at: string

  // Pipeline
  status: ContentStatus
  format: ArticleFormat

  // Brief fields
  topic: string
  angle: string
  target_audience: string
  brief_text: string

  // Draft fields (null until generated)
  draft_text: string | null
  edited_draft_text: string | null
  inferred_patterns: string[] | null

  // Decision fields (single decision per status transition)
  decision_note: string | null
  decision_tags: string[] | null
  decided_at: string | null
  primary_tool_id: string | null

  // Publication
  slug: string | null
  meta_title: string | null
  meta_description: string | null
  published_at: string | null
  stale_notified_at: string | null
}

export interface EditorialExample {
  id: string
  created_at: string
  content_item_id: string | null
  stage: 'brief' | 'draft'
  outcome: 'approved' | 'rejected' | 'revision'
  content_text: string
  decision_note: string | null
  decision_tags: string[] | null
  inferred_patterns: string[] | null
  used_in_prompt: boolean
}

export interface ContextDoc {
  id: string
  created_at: string
  content: string
  change_note: string
  version: number
  is_active: boolean
}

export interface ContextDocProposal {
  id: string
  created_at: string
  proposed_addition: string
  rationale: string
  source_patterns: string[] | null
  status: ProposalStatus
}

export interface DecisionTag {
  id: string
  label: string
  category: 'brief' | 'draft' | 'both'
  sort_order: number
}

export interface Tool {
  id: string
  created_at: string
  name: string
  category: ToolCategory
  description: string
  tags: string[] | null
  affiliate: boolean
  pricing: string | null
  pricing_note: string | null
  cta_url: string | null
  cta_label: string
  featured: boolean
  featured_note: string | null
  directory_order: number | null
}

export interface ToolSpotlight {
  id: string
  created_at: string
  tool_id: string
  tool?: Tool
  hook: string
  detail: string
  tags: string[] | null
  best_for: string
  not_for: string
  migration_note: string | null
  free_tier_note: string | null
  compare_links: Array<{ label: string; url: string }> | null
  pricing: string | null
  cta_url: string | null
  affiliate: boolean
  is_active: boolean
}

export type ToolCategory =
  | 'email'
  | 'analytics'
  | 'automation'
  | 'landing-pages'
  | 'bookkeeping'
  | 'crm'
  | 'seo'
  | 'social'

// ---- Article component types (public site) ----

export interface PlatformTier {
  label: 'Built for this' | 'Can do it with effort' | 'Will fight you'
  tools: string[]
}

// ---- API request/response types ----

export interface GenerateBriefsRequest {
  count?: number
}

export interface GenerateBriefsResponse {
  items: ContentItem[]
}

export interface GenerateDraftRequest {
  item_id: string
}

export interface GenerateDraftResponse {
  item: ContentItem
}

export interface DecisionRequest {
  item_id: string
  decision: 'approved' | 'rejected' | 'revision_requested'
  note?: string
  tags?: string[]
}

export interface DecisionResponse {
  item: ContentItem
  next_action?: 'draft_generation_triggered' | null
}

export interface DiffAnalysisRequest {
  item_id: string
  edited_text: string
}

export interface DiffAnalysisResponse {
  inferred_patterns: string[]
  proposed_context_doc_addition: string | null
  item: ContentItem
}

// ---- Prompt assembly types ----

export interface PromptContext {
  contextDoc: string
  approvedExamples: EditorialExample[]
  rejectedExamples: EditorialExample[]
}

// ---- Dashboard UI state types ----

export interface PipelineCounts {
  brief_pending: number
  draft_review: number
  revision_requested: number
  ready_to_publish: number
  total: number
}

export interface StaleItem {
  item: ContentItem
  daysStalled: number
}

// ---- Slack notification types ----

export type SlackEventType =
  | 'briefs_generated'
  | 'brief_approved'
  | 'draft_ready'
  | 'item_stalled'
  | 'context_doc_proposal'

export interface SlackNotificationPayload {
  event: SlackEventType
  topic?: string
  count?: number
  daysStalled?: number
}

// ---- Generated brief shape (from AI) ----

export interface GeneratedBrief {
  topic: string
  angle: string
  format: ArticleFormat
  target_audience: string
  brief_text: string
}
