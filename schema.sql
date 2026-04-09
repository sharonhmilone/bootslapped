-- =============================================================
-- Bootslapped — Supabase Schema (fixed table order)
-- =============================================================

create extension if not exists "pgcrypto";

-- =============================================================
-- TABLES
-- =============================================================

-- tools must come BEFORE content_items (content_items references tools)
create table if not exists tools (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  name            text not null,
  category        text not null
                  check (category in (
                    'email', 'analytics', 'automation',
                    'landing-pages', 'bookkeeping', 'crm', 'seo', 'social'
                  )),
  description     text not null default '',
  tags            text[],
  affiliate       boolean not null default false,
  pricing         text,
  pricing_note    text,
  cta_url         text,
  cta_label       text not null default '',
  featured        boolean not null default false,
  featured_note   text,
  directory_order integer
);

create table if not exists content_items (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  status          text not null default 'brief_pending'
                  check (status in (
                    'brief_pending',
                    'brief_approved',
                    'brief_rejected',
                    'draft_pending',
                    'draft_review',
                    'draft_rejected',
                    'revision_requested',
                    'ready_to_publish'
                  )),
  format          text not null default 'diagnostic'
                  check (format in ('diagnostic', 'guide', 'comparison')),
  topic           text not null default '',
  angle           text not null default '',
  target_audience text not null default '',
  brief_text      text not null default '',

  -- URL slug — generated at brief-approval time, URL-safe, unique
  slug            text unique,

  draft_text            text,
  edited_draft_text     text,
  inferred_patterns     text[],

  decision_note         text,
  decision_tags         text[],
  decided_at            timestamptz,
  primary_tool_id       uuid references tools(id) on delete set null,

  meta_title            text,
  meta_description      text,
  published_at          timestamptz,
  stale_notified_at     timestamptz
);

create table if not exists tool_spotlights (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  tool_id         uuid not null references tools(id) on delete cascade,
  hook            text not null default '',
  detail          text not null default '',
  tags            text[],
  best_for        text not null default '',
  not_for         text not null default '',
  migration_note  text,
  free_tier_note  text,
  compare_links   jsonb,
  pricing         text,
  cta_url         text,
  affiliate       boolean not null default false,
  is_active       boolean not null default true
);

create table if not exists editorial_examples (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  content_item_id uuid references content_items(id) on delete set null,
  stage           text not null check (stage in ('brief', 'draft')),
  outcome         text not null check (outcome in ('approved', 'rejected', 'revision')),
  content_text    text not null,
  decision_note   text,
  decision_tags   text[],
  inferred_patterns text[],
  used_in_prompt  boolean not null default false
);

create table if not exists context_doc (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  content         text not null,
  change_note     text not null default '',
  version         integer not null default 1,
  is_active       boolean not null default false
);

create table if not exists context_doc_proposals (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  proposed_addition text not null,
  rationale       text not null default '',
  source_patterns text[],
  status          text not null default 'pending'
                  check (status in ('pending', 'approved', 'rejected'))
);

create table if not exists decision_tags (
  id              uuid primary key default gen_random_uuid(),
  label           text not null unique,
  category        text not null check (category in ('brief', 'draft', 'both')),
  sort_order      integer not null default 0
);

-- =============================================================
-- INDEXES
-- =============================================================

create index if not exists idx_content_items_status
  on content_items(status);

create index if not exists idx_content_items_created_at
  on content_items(created_at desc);

create index if not exists idx_content_items_updated_at
  on content_items(updated_at desc);

create index if not exists idx_content_items_stale
  on content_items(status, updated_at)
  where status in ('brief_pending', 'draft_review', 'revision_requested');

create index if not exists idx_editorial_examples_stage_outcome
  on editorial_examples(stage, outcome);

create index if not exists idx_editorial_examples_used
  on editorial_examples(used_in_prompt, created_at desc);

create index if not exists idx_context_doc_active
  on context_doc(is_active, created_at desc);

create index if not exists idx_context_doc_proposals_status
  on context_doc_proposals(status, created_at desc);

create index if not exists idx_tools_featured
  on tools(featured, directory_order);

create index if not exists idx_tools_category
  on tools(category);

create index if not exists idx_tool_spotlights_active
  on tool_spotlights(is_active, tool_id);

-- =============================================================
-- UPDATED_AT TRIGGER
-- =============================================================

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger content_items_updated_at
  before update on content_items
  for each row execute function update_updated_at_column();

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================

alter table content_items        enable row level security;
alter table tools                enable row level security;
alter table tool_spotlights      enable row level security;
alter table editorial_examples   enable row level security;
alter table context_doc          enable row level security;
alter table context_doc_proposals enable row level security;
alter table decision_tags        enable row level security;

drop policy if exists "Public read tools" on tools;
create policy "Public read tools"
  on tools for select using (true);

drop policy if exists "Public read tool spotlights" on tool_spotlights;
create policy "Public read tool spotlights"
  on tool_spotlights for select using (is_active = true);

-- Public: only fully published content
drop policy if exists "Public read published content" on content_items;
create policy "Public read published content"
  on content_items for select
  using (status = 'ready_to_publish' and published_at is not null);

-- Dashboard: authenticated editors can read all pipeline content
drop policy if exists "Authenticated users read content_items" on content_items;
create policy "Authenticated users read content_items"
  on content_items for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users read editorial_examples" on editorial_examples;
create policy "Authenticated users read editorial_examples"
  on editorial_examples for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users read context_doc" on context_doc;
create policy "Authenticated users read context_doc"
  on context_doc for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users read context_doc_proposals" on context_doc_proposals;
create policy "Authenticated users read context_doc_proposals"
  on context_doc_proposals for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users read decision_tags" on decision_tags;
create policy "Authenticated users read decision_tags"
  on decision_tags for select
  to authenticated
  using (true);

-- =============================================================
-- SEED DATA: DECISION TAGS
-- =============================================================

insert into decision_tags (label, category, sort_order) values
  ('too broad', 'brief', 1),
  ('too niche', 'brief', 2),
  ('already covered', 'brief', 3),
  ('wrong angle', 'brief', 4),
  ('strong hook', 'brief', 5),
  ('clear audience', 'brief', 6),
  ('actionable', 'brief', 7),
  ('diagnostic frame', 'brief', 8),
  ('needs tighter lede', 'draft', 10),
  ('too long', 'draft', 11),
  ('too short', 'draft', 12),
  ('missing evidence', 'draft', 13),
  ('copy error', 'draft', 14),
  ('strong voice', 'draft', 15),
  ('good citable claims', 'draft', 16),
  ('revision needed', 'draft', 17),
  ('off-brand tone', 'both', 20),
  ('on-brand', 'both', 21),
  ('good structure', 'both', 22),
  ('weak structure', 'both', 23)
on conflict (label) do nothing;

-- =============================================================
-- SEED DATA: INITIAL CONTEXT DOC
-- =============================================================

insert into context_doc (content, change_note, version, is_active) values (
$$# Bootslapped Editorial Context

## Publication identity

Bootslapped is a diagnostic content resource for bootstrapped founders. The core reader is a solo or early-stage founder who has been executing marketing tactics and is confused about why they aren't working. They are competent, not naive. The editorial mission is to help them identify the actual failure mode rather than pile on more tactics.

## Voice and tone

Write like a smart, experienced operator talking to an equal. No condescension. No cheerleading. No "here are five tips" energy. The voice is direct, specific, and occasionally dry. We name failure modes and call things what they are.

## Format principles

Every piece should have a diagnostic frame. The reader should finish with a clearer picture of their specific situation, not a general sense of "I should try that." Prefer frameworks over tactics. Where tactics appear, they should be conditional on a diagnosed state.

**Citable claims**: Every piece needs at least one citable claim — a specific, evidence-adjacent assertion that stands on its own. These become the quotable moments readers share.

**Ask AI blocks**: Use for prompts the reader can actually take into a conversation. Should be specific enough to be immediately useful, not generic.

## Content categories

- **Diagnostic**: Reader-facing diagnostic. Helps them identify their failure mode. Always ends with a next step specific to each failure mode.
- **Guide**: Framework or process. More instructional than diagnostic but still conditional on context.
- **Comparison**: Tool or approach comparison. Must include platform tier table. Never picks a winner without conditions.

## What we don't do

No vanity metrics framing. No "if you just believed in yourself" energy. No tactics presented as universal — everything is conditional on where the reader is. No padding. No recap sections. No "in conclusion."

## Affiliate disclosure standard

Every piece that mentions a tool we have an affiliate relationship with includes: "This article contains affiliate links. If you use them, we may earn a commission — at no cost to you."
$$,
  'Initial context document — seeded from editorial playbook',
  1,
  true
);

-- =============================================================
-- SEED DATA: SAMPLE TOOLS
-- =============================================================

insert into tools (name, category, description, tags, affiliate, pricing, pricing_note, cta_url, cta_label, featured, directory_order) values
  (
    'ConvertKit',
    'email',
    'Email marketing built for creators who sell. Sequences, automations, and commerce that work together without requiring a developer.',
    array['email', 'automation', 'sequences', 'commerce'],
    true,
    'Free to 1,000 subscribers',
    'Paid plans from $25/month',
    'https://convertkit.com',
    'Try ConvertKit free →',
    true,
    1
  ),
  (
    'Fathom Analytics',
    'analytics',
    'Privacy-first web analytics with a single clean dashboard. GDPR-compliant without cookie banners.',
    array['analytics', 'privacy', 'GDPR', 'simple'],
    true,
    'From $14/month',
    null,
    'https://usefathom.com',
    'Try Fathom →',
    false,
    2
  ),
  (
    'Lemon Squeezy',
    'bookkeeping',
    'Payments, subscriptions, and global tax compliance in one. Built for digital products and SaaS.',
    array['payments', 'subscriptions', 'tax', 'SaaS'],
    false,
    '5% + $0.50 per transaction',
    'No monthly fee',
    'https://lemonsqueezy.com',
    'Explore Lemon Squeezy →',
    false,
    3
  ),
  (
    'Ahrefs',
    'seo',
    'SEO toolset for founders who need to move. Keyword research, site audits, and backlink tracking without the agency overhead.',
    array['SEO', 'keywords', 'backlinks', 'content'],
    false,
    'From $99/month',
    '7-day trial for $7',
    'https://ahrefs.com',
    'See Ahrefs plans →',
    false,
    4
  ),
  (
    'Typefully',
    'social',
    'Write and schedule Twitter/X threads that don''t feel scheduled. Built for long-form social thinkers.',
    array['twitter', 'X', 'threads', 'scheduling'],
    false,
    'Free + from $12.50/month',
    null,
    'https://typefully.com',
    'Try Typefully →',
    false,
    5
  )
on conflict do nothing;
