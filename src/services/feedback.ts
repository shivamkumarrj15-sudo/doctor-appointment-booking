import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { recordEvent } from './analytics';

export interface FeedbackSubmission {
  firstName: string;
  surname?: string;
  rating: number; // 1 to 5
  feedbackText?: string;
  displayConsent: boolean;
}

export interface PublicReview {
  id: string;
  firstName: string;
  rating: number;
  feedbackText: string;
  createdAt: string;
}

export interface FeedbackSummary {
  averageRating: number;
  totalApprovedReviews: number;
  hasReviews: boolean;
}

// Local mock storage when Supabase credentials are not yet linked
// Starts strictly at 0 reviews and 0.0 rating, as required by the master prompt!
const localSubmissions: Array<FeedbackSubmission & { id: string; status: 'pending' | 'approved' | 'rejected'; createdAt: string }> = [];

/**
 * Validates and sanitizes feedback input.
 */
function validateFeedbackInput(data: FeedbackSubmission): { valid: boolean; error?: string } {
  if (!data.firstName || !data.firstName.trim()) {
    return { valid: false, error: 'First name is required.' };
  }
  if (data.firstName.trim().length > 50) {
    return { valid: false, error: 'First name must be 50 characters or fewer.' };
  }
  if (data.surname && data.surname.trim().length > 50) {
    return { valid: false, error: 'Surname must be 50 characters or fewer.' };
  }
  if (!data.rating || data.rating < 1 || data.rating > 5 || !Number.isInteger(data.rating)) {
    return { valid: false, error: 'Please select a rating between 1 and 5 stars.' };
  }
  if (data.feedbackText && data.feedbackText.trim().length > 500) {
    return { valid: false, error: 'Feedback text must be 500 characters or fewer.' };
  }
  return { valid: true };
}

/**
 * Submits genuine visitor feedback to the Supabase database.
 * Default status is always 'pending' to require owner moderation.
 */
export async function submitFeedback(data: FeedbackSubmission): Promise<{ success: boolean; message: string }> {
  const validation = validateFeedbackInput(data);
  if (!validation.valid) {
    return { success: false, message: validation.error || 'Invalid feedback submission.' };
  }

  const cleanFirstName = data.firstName.trim();
  const cleanSurname = data.surname ? data.surname.trim() : null;
  const cleanFeedbackText = data.feedbackText ? data.feedbackText.trim() : null;

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('website_feedback').insert({
        first_name: cleanFirstName,
        surname: cleanSurname,
        rating: data.rating,
        feedback_text: cleanFeedbackText,
        display_consent: data.displayConsent,
        status: 'pending', // Pending moderation by owner
      });

      if (error) {
        console.error('[Feedback] Supabase error:', error);
        return {
          success: false,
          message: 'Unable to submit feedback at this moment. Please check your connection or try again later.',
        };
      }

      // Record event
      recordEvent('feedback_submitted', {
        rating_value: data.rating,
        has_public_consent: data.displayConsent,
      });

      return {
        success: true,
        message: 'Thank you for sharing your feedback! Your opinion helps us improve.',
      };
    } catch (err) {
      console.error('[Feedback] Network error:', err);
      return {
        success: false,
        message: 'Network error while submitting feedback. Please try again.',
      };
    }
  }

  // Graceful local handling when Supabase is not yet configured
  localSubmissions.push({
    id: 'local-' + Date.now(),
    firstName: cleanFirstName,
    surname: cleanSurname || undefined,
    rating: data.rating,
    feedbackText: cleanFeedbackText || undefined,
    displayConsent: data.displayConsent,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });

  recordEvent('feedback_submitted', {
    rating_value: data.rating,
    has_public_consent: data.displayConsent,
  });

  return {
    success: true,
    message: 'Thank you for sharing your feedback! Your opinion helps us improve.',
  };
}

/**
 * Fetches approved reviews summary (average rating and total approved count).
 * Excludes pending, rejected, and test submissions.
 * Returns 0 and "No reviews yet." if no approved reviews exist.
 */
export async function getApprovedFeedbackSummary(): Promise<FeedbackSummary> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('website_feedback')
        .select('rating')
        .eq('status', 'approved');

      if (error || !data || data.length === 0) {
        return { averageRating: 0.0, totalApprovedReviews: 0, hasReviews: false };
      }

      const sum = data.reduce((acc, row) => acc + (row.rating || 0), 0);
      const avg = Number((sum / data.length).toFixed(1));
      return {
        averageRating: avg,
        totalApprovedReviews: data.length,
        hasReviews: true,
      };
    } catch (err) {
      console.warn('[Feedback] Error fetching rating summary:', err);
      return { averageRating: 0.0, totalApprovedReviews: 0, hasReviews: false };
    }
  }

  // Local calculation: check approved submissions in local memory
  const approved = localSubmissions.filter((s) => s.status === 'approved');
  if (approved.length === 0) {
    return { averageRating: 0.0, totalApprovedReviews: 0, hasReviews: false };
  }

  const sum = approved.reduce((acc, s) => acc + s.rating, 0);
  const avg = Number((sum / approved.length).toFixed(1));
  return {
    averageRating: avg,
    totalApprovedReviews: approved.length,
    hasReviews: true,
  };
}

/**
 * Fetches public approved reviews where the visitor granted display_consent.
 * Only returns first_name, rating, feedback_text, created_at. Never exposes surname.
 */
export async function getPublicApprovedReviews(): Promise<PublicReview[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('website_feedback')
        .select('id, first_name, rating, feedback_text, created_at')
        .eq('status', 'approved')
        .eq('display_consent', true)
        .not('feedback_text', 'is', null)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error || !data) {
        return [];
      }

      return data.map((item) => ({
        id: item.id,
        firstName: item.first_name,
        rating: item.rating,
        feedbackText: item.feedback_text,
        createdAt: item.created_at,
      }));
    } catch (err) {
      console.warn('[Feedback] Error fetching public reviews:', err);
      return [];
    }
  }

  // Local fallback: returns approved local submissions with displayConsent
  const approvedPublic = localSubmissions
    .filter((s) => s.status === 'approved' && s.displayConsent && s.feedbackText)
    .map((s) => ({
      id: s.id,
      firstName: s.firstName,
      rating: s.rating,
      feedbackText: s.feedbackText || '',
      createdAt: s.createdAt,
    }));

  return approvedPublic;
}
