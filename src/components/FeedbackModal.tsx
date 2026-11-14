import React, { useState, useEffect } from 'react';
import { Star, X, CheckCircle, AlertCircle, ArrowRight, MessageSquare } from 'lucide-react';
import { submitFeedback } from '../services/feedback';
import { recordEvent } from '../services/analytics';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessSubmitted?: () => void;
  isAutomaticTrigger?: boolean;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSuccessSubmitted,
  isAutomaticTrigger = false,
}) => {
  // Modal step: 'form' | 'skip_reason' | 'success'
  const [step, setStep] = useState<'form' | 'skip_reason' | 'success'>('form');

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [displayConsent, setDisplayConsent] = useState(false);

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setFirstName('');
      setSurname('');
      setRating(0);
      setHoverRating(0);
      setFeedbackText('');
      setDisplayConsent(false);
      setFormError(null);
      setIsSubmitting(false);

      if (isAutomaticTrigger) {
        recordEvent('feedback_prompt_shown', { button_location: 'automatic_timer' });
      } else {
        recordEvent('feedback_prompt_shown', { button_location: 'manual_button' });
      }
    }
  }, [isOpen, isAutomaticTrigger]);

  if (!isOpen) return null;

  const handleClose = () => {
    recordEvent('feedback_dismissed');
    onClose();
  };

  const handleSkipClick = () => {
    recordEvent('feedback_skipped');
    // Transition to the optional skip reason question in the same popup
    setStep('skip_reason');
  };

  const handleSelectSkipReason = (reason: string) => {
    recordEvent('feedback_reason_submitted', { reason_selected: reason });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!firstName.trim()) {
      setFormError('Please provide your first name.');
      return;
    }
    if (rating === 0) {
      setFormError('Please select a star rating from 1 to 5.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitFeedback({
        firstName: firstName.trim(),
        surname: surname.trim() || undefined,
        rating,
        feedbackText: feedbackText.trim() || undefined,
        displayConsent,
      });

      if (result.success) {
        setSuccessMessage(result.message);
        setStep('success');
        if (onSuccessSubmitted) {
          onSuccessSubmitted();
        }
      } else {
        setFormError(result.message);
      }
    } catch {
      setFormError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const skipReasons = [
    'I was just browsing.',
    "I haven't used the appointment booking yet.",
    'I was short on time.',
    "I couldn't find the information I needed.",
    'I faced a technical issue.',
    'I prefer not to share feedback.',
    'Something else.',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#17324D]/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E3E9EA] relative transition-all">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-[#71808D] hover:text-[#17324D] p-1.5 rounded-lg hover:bg-[#F3F6F7] transition-colors cursor-pointer"
          aria-label="Close feedback modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: Main Feedback Form */}
        {step === 'form' && (
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#E8F5F1] text-[#168C83] flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#168C83] uppercase tracking-wider">
                Website Experience
              </span>
            </div>

            <h3 id="feedback-modal-title" className="text-2xl font-bold text-[#17324D] tracking-tight">
              How was your experience?
            </h3>
            <p className="text-sm text-[#71808D] mt-1">
              Your feedback helps us improve the appointment booking experience. No login or registration required.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              
              {/* Star Rating Control */}
              <div>
                <label className="block text-xs font-bold text-[#17324D] uppercase tracking-wider mb-2">
                  Rate your booking experience <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2" role="radiogroup" aria-label="Rating from 1 to 5 stars">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const isFilled = (hoverRating || rating) >= starVal;
                    return (
                      <button
                        key={starVal}
                        type="button"
                        role="radio"
                        aria-checked={rating === starVal}
                        aria-label={`${starVal} Star${starVal > 1 ? 's' : ''}`}
                        onClick={() => {
                          setRating(starVal);
                          if (formError) setFormError(null);
                        }}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 focus:outline-none focus:ring-2 focus:ring-[#168C83] rounded-md transition-transform hover:scale-110 cursor-pointer"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            isFilled
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-[#E3E9EA] fill-transparent stroke-[#71808D]'
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="ml-2 text-xs font-medium text-[#71808D]">
                    {rating > 0 ? `${rating} of 5 Stars` : 'Tap to rate'}
                  </span>
                </div>
              </div>

              {/* Names: First Name (Required), Surname (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="feedbackFirstName" className="block text-xs font-bold text-[#17324D] mb-1.5">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="feedbackFirstName"
                    maxLength={50}
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    placeholder="e.g. Priya"
                    className="w-full px-3.5 py-2.5 text-sm text-[#17324D] bg-[#FCFDFB] border border-[#E3E9EA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#168C83]"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="feedbackSurname" className="block text-xs font-bold text-[#17324D] mb-1.5">
                    Surname <span className="text-xs font-normal text-[#71808D]">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="feedbackSurname"
                    maxLength={50}
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    placeholder="e.g. Sharma"
                    className="w-full px-3.5 py-2.5 text-sm text-[#17324D] bg-[#FCFDFB] border border-[#E3E9EA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#168C83]"
                  />
                </div>
              </div>

              {/* Written Feedback (Optional, max 500) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="feedbackComment" className="block text-xs font-bold text-[#17324D]">
                    Written Feedback <span className="text-xs font-normal text-[#71808D]">(Optional)</span>
                  </label>
                  <span className="text-[11px] text-[#71808D]">
                    {feedbackText.length}/500
                  </span>
                </div>
                <textarea
                  id="feedbackComment"
                  rows={3}
                  maxLength={500}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share what worked well or what we can improve..."
                  className="w-full p-3 text-sm text-[#17324D] bg-[#FCFDFB] border border-[#E3E9EA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#168C83]"
                />
              </div>

              {/* Public Display Consent Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={displayConsent}
                    onChange={(e) => setDisplayConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-[#168C83] border-[#E3E9EA] rounded focus:ring-[#168C83]"
                  />
                  <span className="text-xs text-[#71808D] leading-relaxed">
                    I agree that my first name and feedback may be displayed publicly on this website. (Surnames are never published).
                  </span>
                </label>
              </div>

              {/* Error Message */}
              {formError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleSkipClick}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-[#71808D] hover:text-[#17324D] hover:bg-[#F3F6F7] rounded-xl transition-colors cursor-pointer"
                >
                  Skip for now
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#168C83] hover:bg-[#0f6760] active:scale-98 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <span>Submit Feedback</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* STEP 2: Follow-up on Skip */}
        {step === 'skip_reason' && (
          <div className="animate-in fade-in duration-200">
            <h3 className="text-xl font-bold text-[#17324D]">
              What stopped you from sharing feedback today?
            </h3>
            <p className="text-xs sm:text-sm text-[#71808D] mt-1">
              Your quick anonymous answer helps us understand your visit. (All options are optional).
            </p>

            <div className="mt-5 space-y-2">
              {skipReasons.map((reason, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSkipReason(reason)}
                  className="w-full p-3 rounded-xl border border-[#E3E9EA] bg-[#FCFDFB] hover:bg-[#E8F5F1] hover:border-[#168C83]/40 text-left text-xs sm:text-sm text-[#263746] font-medium transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>{reason}</span>
                  <span className="text-xs text-[#168C83]">Select</span>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#E3E9EA] flex justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs font-semibold text-[#71808D] hover:text-[#17324D] hover:bg-[#F3F6F7] rounded-lg transition-colors cursor-pointer"
              >
                No thanks
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Success Confirmation */}
        {step === 'success' && (
          <div className="py-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-[#E8F5F1] text-[#168C83] flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-[#17324D]">
              Thank You!
            </h3>

            <p className="text-sm text-[#71808D] max-w-sm mx-auto leading-relaxed">
              {successMessage || 'Thank you for sharing your feedback! Your opinion helps us improve.'}
            </p>

            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#168C83] hover:bg-[#0f6760] text-white font-semibold text-sm shadow-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
