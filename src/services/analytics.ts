import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { siteConfig } from '../config/siteConfig';
import { safeGetStorage, safeSetStorage } from '../utils/storage';

const SESSION_STORAGE_KEY = 'demo_anon_session_id';
const LAST_ACTIVITY_KEY = 'demo_session_last_activity';
const ANALYTICS_OPT_OUT_KEY = 'demo_analytics_opt_out';

// Allowed event names - explicit whitelist
export type AnalyticsEventName =
  | 'page_view'
  | 'session_start'
  | 'appointment_option_selected'
  | 'appointment_form_started'
  | 'appointment_form_completed'
  | 'whatsapp_click'
  | 'feedback_prompt_shown'
  | 'feedback_submitted'
  | 'feedback_skipped'
  | 'feedback_dismissed'
  | 'feedback_reason_submitted';

export interface EventMetadata {
  button_location?: string;
  category_selected?: string;
  fee_indicative?: number;
  reason_selected?: string;
  rating_value?: number;
  has_public_consent?: boolean;
  language?: string;
  source_page?: string;
  [key: string]: unknown;
}

/**
 * Generates an anonymous RFC4122 v4 UUID.
 */
function generateUUID(): string {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
  } catch {
    // Fallback below
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// In-memory session cache to avoid repeated disk reads or infinite loops
let cachedSessionId: string | null = null;

/**
 * Retrieves or establishes an anonymous first-party session identifier.
 * Automatically renews if inactive for > 30 minutes.
 * NEVER calls recordEvent to prevent any possibility of recursive stack overflows.
 */
export function getOrCreateSessionId(): string {
  if (cachedSessionId) {
    return cachedSessionId;
  }

  const now = Date.now();
  const maxInactivityMs = siteConfig.analytics.inactivityTimeoutMinutes * 60 * 1000;
  
  const lastActivityStr = safeGetStorage(LAST_ACTIVITY_KEY, 'local');
  let sessionId = safeGetStorage(SESSION_STORAGE_KEY, 'session');

  if (lastActivityStr) {
    const lastActivity = parseInt(lastActivityStr, 10);
    if (!isNaN(lastActivity) && now - lastActivity > maxInactivityMs) {
      // Inactivity threshold reached (30 minutes) -> create new session
      sessionId = generateUUID();
      safeSetStorage(SESSION_STORAGE_KEY, sessionId, 'session');
    }
  }

  if (!sessionId) {
    sessionId = generateUUID();
    safeSetStorage(SESSION_STORAGE_KEY, sessionId, 'session');
  }

  // Update activity timestamp
  safeSetStorage(LAST_ACTIVITY_KEY, now.toString(), 'local');
  cachedSessionId = sessionId;
  return sessionId;
}

/**
 * Checks if the visitor has opted out of anonymous analytics.
 */
export function isAnalyticsOptedOut(): boolean {
  return safeGetStorage(ANALYTICS_OPT_OUT_KEY, 'local') === 'true';
}

/**
 * Updates analytics opt-out preference.
 */
export function setAnalyticsOptOut(optOut: boolean): void {
  safeSetStorage(ANALYTICS_OPT_OUT_KEY, optOut ? 'true' : 'false', 'local');
}

/**
 * Sanitizes metadata to strictly forbid any PII (names, phones, medical notes).
 */
function sanitizeMetadata(metadata?: EventMetadata): Record<string, unknown> {
  if (!metadata) return {};
  
  // Whitelist of allowed metadata keys
  const allowedKeys = [
    'button_location',
    'category_selected',
    'fee_indicative',
    'reason_selected',
    'rating_value',
    'has_public_consent',
    'language',
    'source_page',
    'reason',
  ];

  const sanitized: Record<string, unknown> = {};
  for (const key of allowedKeys) {
    if (key in metadata && metadata[key] !== undefined) {
      sanitized[key] = metadata[key];
    }
  }
  return sanitized;
}

/**
 * Checks for common crawler/bot user-agents.
 */
function isBot(): boolean {
  try {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent.toLowerCase();
    return /bot|crawler|spider|crawling|lighthouse|headlesschrome|googlebot|bingbot|yahoo|duckduckbot/i.test(ua);
  } catch {
    return false;
  }
}

// Local in-memory session buffer for preview / local testing before Supabase credentials are configured
interface LocalStats {
  pageViews: number;
  sessions: Set<string>;
  whatsappClicks: number;
  whatsappEnquirySessions: Set<string>;
  formStarts: number;
  formCompletions: number;
  feedbackPrompts: number;
  feedbackSubmissions: number;
  feedbackSkips: number;
  feedbackDismissals: number;
  feedbackReasons: Record<string, number>;
}

const localStats: LocalStats = {
  pageViews: 0,
  sessions: new Set(),
  whatsappClicks: 0,
  whatsappEnquirySessions: new Set(),
  formStarts: 0,
  formCompletions: 0,
  feedbackPrompts: 0,
  feedbackSubmissions: 0,
  feedbackSkips: 0,
  feedbackDismissals: 0,
  feedbackReasons: {},
};

/**
 * Dispatches an analytics event in a non-blocking manner.
 * Wrapped in try-catch so it can NEVER crash the main UI thread.
 */
export function recordEvent(eventName: AnalyticsEventName, metadata?: EventMetadata): void {
  try {
    if (isAnalyticsOptedOut() || isBot()) {
      return;
    }

    const sessionId = getOrCreateSessionId();
    const pagePath = typeof window !== 'undefined' ? window.location.pathname : '/';
    const cleanMetadata = sanitizeMetadata(metadata);

    // Update in-memory counters for local inspection / validation
    localStats.sessions.add(sessionId);
    if (eventName === 'page_view') localStats.pageViews++;
    if (eventName === 'whatsapp_click') {
      localStats.whatsappClicks++;
      localStats.whatsappEnquirySessions.add(sessionId);
    }
    if (eventName === 'appointment_form_started') localStats.formStarts++;
    if (eventName === 'appointment_form_completed') localStats.formCompletions++;
    if (eventName === 'feedback_prompt_shown') localStats.feedbackPrompts++;
    if (eventName === 'feedback_submitted') localStats.feedbackSubmissions++;
    if (eventName === 'feedback_skipped') localStats.feedbackSkips++;
    if (eventName === 'feedback_dismissed') localStats.feedbackDismissals++;
    if (eventName === 'feedback_reason_submitted' && cleanMetadata.reason_selected) {
      const r = String(cleanMetadata.reason_selected);
      localStats.feedbackReasons[r] = (localStats.feedbackReasons[r] || 0) + 1;
    }

    // Non-blocking transmission to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      Promise.resolve(
        supabase
          .from('analytics_events')
          .insert({
            event_name: eventName,
            session_id: sessionId,
            page_path: pagePath,
            event_metadata: cleanMetadata,
          })
      )
        .then((res) => {
          if (res && res.error) {
            console.warn('[Analytics] Failed to persist event to Supabase:', res.error.message);
          }
        })
        .catch((err: unknown) => {
          console.warn('[Analytics] Network exception sending event:', err);
        });
    }
  } catch (err) {
    // Fail-safe: telemetry error must never affect the user experience
    console.warn('[Analytics] Suppressed non-critical telemetry error:', err);
  }
}

/**
 * Returns summary of current local session events for transparent inspection.
 */
export function getLocalAnalyticsSummary() {
  return {
    totalPageViews: localStats.pageViews,
    totalSessions: localStats.sessions.size,
    totalWhatsAppClicks: localStats.whatsappClicks,
    uniqueWhatsAppEnquiryLeads: localStats.whatsappEnquirySessions.size,
    appointmentFormStarts: localStats.formStarts,
    appointmentFormCompletions: localStats.formCompletions,
    feedbackPromptsShown: localStats.feedbackPrompts,
    feedbackSubmissions: localStats.feedbackSubmissions,
    feedbackSkips: localStats.feedbackSkips,
    feedbackDismissals: localStats.feedbackDismissals,
    feedbackReasons: localStats.feedbackReasons,
  };
}
