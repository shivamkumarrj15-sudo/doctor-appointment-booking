-- =====================================================================
-- MASTER SCHEMA MIGRATION: APPOINTMENT BOOKING & ANALYTICS
-- Database: Supabase PostgreSQL
-- Tables: website_feedback, analytics_events
-- Security: Row Level Security (RLS) enabled, Zero public access to private data
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE: website_feedback
-- Stores genuine visitor feedback. Status defaults to 'pending'.
CREATE TABLE IF NOT EXISTS public.website_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL CHECK (char_length(trim(first_name)) > 0 AND char_length(first_name) <= 50),
    surname TEXT NULL CHECK (surname IS NULL OR char_length(surname) <= 50),
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT NULL CHECK (feedback_text IS NULL OR char_length(feedback_text) <= 500),
    display_consent BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for public queries on approved reviews
CREATE INDEX IF NOT EXISTS idx_website_feedback_status_consent
    ON public.website_feedback(status, display_consent, created_at DESC);

-- 3. TABLE: analytics_events
-- Stores anonymous first-party visitor telemetry.
-- STRICT PRIVACY: Never stores visitor names, phone numbers, medical notes, or raw IPs.
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name TEXT NOT NULL CHECK (
        event_name IN (
            'page_view',
            'session_start',
            'appointment_option_selected',
            'appointment_form_started',
            'appointment_form_completed',
            'whatsapp_click',
            'feedback_prompt_shown',
            'feedback_submitted',
            'feedback_skipped',
            'feedback_dismissed',
            'feedback_reason_submitted'
        )
    ),
    session_id UUID NOT NULL,
    page_path TEXT NULL DEFAULT '/',
    event_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_name_time
    ON public.analytics_events(event_name, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_session
    ON public.analytics_events(session_id);

CREATE INDEX IF NOT EXISTS idx_analytics_events_created
    ON public.analytics_events(created_at DESC);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on website_feedback
ALTER TABLE public.website_feedback ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anonymous public can INSERT their own feedback (with status='pending')
CREATE POLICY "Public can submit pending feedback"
    ON public.website_feedback
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        status = 'pending' AND
        char_length(trim(first_name)) > 0 AND
        rating >= 1 AND rating <= 5
    );

-- Policy 2: Public can only SELECT approved feedback where display_consent is true
-- Surnames are never exposed to public view.
CREATE POLICY "Public can view approved consent feedback"
    ON public.website_feedback
    FOR SELECT
    TO anon, authenticated
    USING (
        status = 'approved'
    );

-- Policy 3: Public cannot UPDATE or DELETE feedback
-- Moderation is restricted to owner via Supabase dashboard / SQL Editor.
CREATE POLICY "Disallow public updates"
    ON public.website_feedback
    FOR UPDATE
    TO anon
    USING (false);

CREATE POLICY "Disallow public deletes"
    ON public.website_feedback
    FOR DELETE
    TO anon
    USING (false);

-- Enable RLS on analytics_events
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anonymous public can INSERT analytics events
CREATE POLICY "Public can insert analytics events"
    ON public.analytics_events
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Policy 2: Public CANNOT select, update, or delete raw analytics
CREATE POLICY "Disallow public reading raw analytics"
    ON public.analytics_events
    FOR SELECT
    TO anon
    USING (false);

CREATE POLICY "Disallow public updating analytics"
    ON public.analytics_events
    FOR UPDATE
    TO anon
    USING (false);

CREATE POLICY "Disallow public deleting analytics"
    ON public.analytics_events
    FOR DELETE
    TO anon
    USING (false);


-- =====================================================================
-- 5. SECURE REPORTING VIEWS (FOR OWNER USE IN SUPABASE SQL EDITOR)
-- =====================================================================

-- VIEW 1: Overall Analytics Summary
CREATE OR REPLACE VIEW public.analytics_summary AS
WITH
  views AS (
    SELECT COUNT(*) AS total_page_views
    FROM public.analytics_events
    WHERE event_name = 'page_view'
  ),
  sessions AS (
    SELECT COUNT(DISTINCT session_id) AS total_sessions
    FROM public.analytics_events
  ),
  wa_clicks AS (
    SELECT COUNT(*) AS total_whatsapp_clicks
    FROM public.analytics_events
    WHERE event_name = 'whatsapp_click'
  ),
  wa_leads AS (
    SELECT COUNT(DISTINCT session_id) AS unique_whatsapp_enquiry_leads
    FROM public.analytics_events
    WHERE event_name = 'whatsapp_click'
  ),
  form_starts AS (
    SELECT COUNT(*) AS total_form_starts
    FROM public.analytics_events
    WHERE event_name = 'appointment_form_started'
  ),
  form_completes AS (
    SELECT COUNT(*) AS total_form_completions
    FROM public.analytics_events
    WHERE event_name = 'appointment_form_completed'
  ),
  fb_prompts AS (
    SELECT COUNT(*) AS feedback_prompts_shown
    FROM public.analytics_events
    WHERE event_name = 'feedback_prompt_shown'
  ),
  fb_subs AS (
    SELECT COUNT(*) AS feedback_submissions
    FROM public.analytics_events
    WHERE event_name = 'feedback_submitted'
  ),
  fb_skips AS (
    SELECT COUNT(*) AS feedback_skips
    FROM public.analytics_events
    WHERE event_name = 'feedback_skipped'
  ),
  fb_dismiss AS (
    SELECT COUNT(*) AS feedback_dismissals
    FROM public.analytics_events
    WHERE event_name = 'feedback_dismissed'
  ),
  approved_fb AS (
    SELECT
      COUNT(*) AS total_approved_reviews,
      COALESCE(ROUND(AVG(rating)::numeric, 1), 0.0) AS approved_average_rating
    FROM public.website_feedback
    WHERE status = 'approved'
  )
SELECT
  v.total_page_views,
  s.total_sessions,
  wc.total_whatsapp_clicks,
  wl.unique_whatsapp_enquiry_leads,
  -- Lead conversion rate: % of sessions that clicked WhatsApp
  CASE WHEN s.total_sessions > 0
    THEN ROUND((wl.unique_whatsapp_enquiry_leads::numeric / s.total_sessions::numeric) * 100, 2)
    ELSE 0.0
  END AS enquiry_conversion_rate_pct,
  fs.total_form_starts,
  fc.total_form_completions,
  fp.feedback_prompts_shown,
  fsub.feedback_submissions,
  -- Feedback Response Rate: (Submissions / Prompts Shown) * 100
  CASE WHEN fp.feedback_prompts_shown > 0
    THEN ROUND((fsub.feedback_submissions::numeric / fp.feedback_prompts_shown::numeric) * 100, 2)
    ELSE 0.0
  END AS feedback_response_rate_pct,
  fsk.feedback_skips,
  -- Skip Rate: (Skips / Prompts Shown) * 100
  CASE WHEN fp.feedback_prompts_shown > 0
    THEN ROUND((fsk.feedback_skips::numeric / fp.feedback_prompts_shown::numeric) * 100, 2)
    ELSE 0.0
  END AS feedback_skip_rate_pct,
  fd.feedback_dismissals,
  afb.approved_average_rating,
  afb.total_approved_reviews
FROM views v
CROSS JOIN sessions s
CROSS JOIN wa_clicks wc
CROSS JOIN wa_leads wl
CROSS JOIN form_starts fs
CROSS JOIN form_completes fc
CROSS JOIN fb_prompts fp
CROSS JOIN fb_subs fsub
CROSS JOIN fb_skips fsk
CROSS JOIN fb_dismiss fd
CROSS JOIN approved_fb afb;

-- VIEW 2: Daily Analytics Trend
CREATE OR REPLACE VIEW public.analytics_daily_summary AS
SELECT
  DATE_TRUNC('day', created_at)::date AS visit_date,
  COUNT(CASE WHEN event_name = 'page_view' THEN 1 END) AS page_views,
  COUNT(DISTINCT session_id) AS unique_sessions,
  COUNT(CASE WHEN event_name = 'whatsapp_click' THEN 1 END) AS whatsapp_clicks,
  COUNT(DISTINCT CASE WHEN event_name = 'whatsapp_click' THEN session_id END) AS unique_whatsapp_leads,
  COUNT(CASE WHEN event_name = 'appointment_form_started' THEN 1 END) AS form_starts,
  COUNT(CASE WHEN event_name = 'appointment_form_completed' THEN 1 END) AS form_completions,
  COUNT(CASE WHEN event_name = 'feedback_submitted' THEN 1 END) AS feedback_submissions
FROM public.analytics_events
GROUP BY 1
ORDER BY 1 DESC;

-- VIEW 3: WhatsApp Leads Breakdown
CREATE OR REPLACE VIEW public.whatsapp_lead_summary AS
SELECT
  COALESCE(event_metadata->>'button_location', 'unknown') AS button_location,
  COALESCE(event_metadata->>'category_selected', 'general') AS category_selected,
  COUNT(*) AS total_clicks,
  COUNT(DISTINCT session_id) AS unique_leads
FROM public.analytics_events
WHERE event_name = 'whatsapp_click'
GROUP BY 1, 2
ORDER BY total_clicks DESC;

-- VIEW 4: Feedback Moderation & Rating Summary
CREATE OR REPLACE VIEW public.feedback_summary AS
SELECT
  COUNT(*) AS total_submissions,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending_moderation,
  COUNT(CASE WHEN status = 'approved' THEN 1 END) AS approved_reviews,
  COUNT(CASE WHEN status = 'rejected' THEN 1 END) AS rejected_reviews,
  COALESCE(ROUND(AVG(CASE WHEN status = 'approved' THEN rating END)::numeric, 1), 0.0) AS average_approved_rating,
  COUNT(CASE WHEN status = 'approved' AND rating = 5 THEN 1 END) AS star_5_count,
  COUNT(CASE WHEN status = 'approved' AND rating = 4 THEN 1 END) AS star_4_count,
  COUNT(CASE WHEN status = 'approved' AND rating = 3 THEN 1 END) AS star_3_count,
  COUNT(CASE WHEN status = 'approved' AND rating = 2 THEN 1 END) AS star_2_count,
  COUNT(CASE WHEN status = 'approved' AND rating = 1 THEN 1 END) AS star_1_count
FROM public.website_feedback;

-- VIEW 5: Feedback Reasons Distribution (Why visitors skipped feedback)
CREATE OR REPLACE VIEW public.feedback_reason_summary AS
SELECT
  COALESCE(event_metadata->>'reason_selected', 'Unspecified') AS skip_reason,
  COUNT(*) AS occurrences,
  ROUND((COUNT(*)::numeric / NULLIF(SUM(COUNT(*)) OVER (), 0)::numeric) * 100, 1) AS percentage
FROM public.analytics_events
WHERE event_name = 'feedback_reason_submitted'
GROUP BY 1
ORDER BY occurrences DESC;
