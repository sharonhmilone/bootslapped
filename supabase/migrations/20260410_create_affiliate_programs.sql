-- =============================================================
-- Bootslapped — Affiliate Programs
-- Run in Supabase SQL editor
-- =============================================================

create table if not exists affiliate_programs (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  -- Identity
  program_name      text not null unique,
  tool_id           uuid references tools(id) on delete set null,

  -- Categorisation
  topic_domain      text not null
                    check (topic_domain in (
                      'email', 'crm', 'bookkeeping', 'website',
                      'content', 'conversion', 'stack', 'ai-tools'
                    )),

  -- Commission
  commission_type   text not null
                    check (commission_type in ('percentage', 'flat', 'recurring')),
  commission_rate   text,        -- e.g. "30%" or "$25 per referral" — freeform label

  -- Enrolment
  signup_url        text,
  enrollment_status text not null default 'not_enrolled'
                    check (enrollment_status in (
                      'not_enrolled', 'applied', 'active', 'paused'
                    )),

  -- Notes
  notes             text
);

-- Auto-update updated_at
create or replace function update_affiliate_programs_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger affiliate_programs_updated_at
  before update on affiliate_programs
  for each row execute function update_affiliate_programs_updated_at();
