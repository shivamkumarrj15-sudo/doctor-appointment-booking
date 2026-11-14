import React, { useState, useEffect } from 'react';
import { Star, MessageSquarePlus, ShieldCheck } from 'lucide-react';
import { getApprovedFeedbackSummary, getPublicApprovedReviews, type FeedbackSummary, type PublicReview } from '../services/feedback';

interface FeedbackSectionProps {
  onOpenFeedbackModal: () => void;
  refreshTrigger?: number;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  onOpenFeedbackModal,
  refreshTrigger = 0,
}) => {
  const [summary, setSummary] = useState<FeedbackSummary>({
    averageRating: 0.0,
    totalApprovedReviews: 0,
    hasReviews: false,
  });
  const [reviews, setReviews] = useState<PublicReview[]>([]);

  const loadData = async () => {
    try {
      const sum = await getApprovedFeedbackSummary();
      setSummary(sum);

      if (sum.hasReviews) {
        const pubReviews = await getPublicApprovedReviews();
        setReviews(pubReviews);
      } else {
        setReviews([]);
      }
    } catch {
      // Default to 0 / no reviews
      setSummary({ averageRating: 0.0, totalApprovedReviews: 0, hasReviews: false });
      setReviews([]);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  return (
    <section id="feedback" className="py-16 md:py-24 bg-[#FCFDFB] border-t border-[#E3E9EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5F1] text-[#168C83] text-xs font-semibold uppercase tracking-wider">
            Genuine Visitor Feedback
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17324D] tracking-tight">
            Website Experience & Reviews
          </h2>
          <p className="text-base sm:text-lg text-[#71808D] leading-relaxed">
            We value genuine impressions. All displayed ratings represent actual moderated submissions with explicit visitor consent.
          </p>
        </div>

        {/* Real Rating Summary Card */}
        <div className="mt-12 max-w-2xl mx-auto bg-white rounded-3xl border border-[#E3E9EA] shadow-md p-8 text-center relative overflow-hidden">
          <div className="flex flex-col items-center justify-center space-y-3">
            
            {summary.hasReviews ? (
              <>
                <div className="flex items-baseline gap-1 text-5xl font-extrabold text-[#17324D]">
                  <span>{summary.averageRating.toFixed(1)}</span>
                  <span className="text-xl font-medium text-[#71808D]">/ 5</span>
                </div>

                <div className="flex items-center gap-1" aria-label={`Rating: ${summary.averageRating} out of 5`}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i <= Math.round(summary.averageRating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-[#E3E9EA] fill-transparent stroke-[#71808D]'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs font-semibold text-[#168C83]">
                  Based on {summary.totalApprovedReviews} approved visitor review{summary.totalApprovedReviews === 1 ? '' : 's'}
                </p>
              </>
            ) : (
              <>
                <div className="text-4xl font-extrabold text-[#17324D]">
                  0.0 <span className="text-lg font-normal text-[#71808D]">/ 5</span>
                </div>

                {/* 5 empty neutral stars */}
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-6 h-6 text-[#E3E9EA] stroke-[#71808D]" />
                  ))}
                </div>

                <p className="text-base font-semibold text-[#17324D] mt-1">
                  No reviews yet.
                </p>
                <p className="text-xs text-[#71808D] max-w-sm">
                  This is a new appointment booking experience. Be among the first to share how convenient your request was.
                </p>
              </>
            )}

            <div className="pt-4">
              <button
                type="button"
                onClick={onOpenFeedbackModal}
                className="px-6 py-3 rounded-xl bg-[#168C83] hover:bg-[#0f6760] active:scale-98 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Share Your Experience</span>
              </button>
            </div>

            <div className="pt-2 flex items-center justify-center gap-1 text-[11px] text-[#71808D]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#168C83]" />
              <span>Real submissions only • Zero fake reviews • No login required</span>
            </div>

          </div>
        </div>

        {/* Public Reviews List if any exist */}
        {reviews.length > 0 && (
          <div className="mt-14 max-w-5xl mx-auto">
            <h3 className="text-lg font-bold text-[#17324D] mb-6 text-center">
              Recent Visitor Reviews
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-2xl border border-[#E3E9EA] p-6 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 ${
                              s <= rev.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-[#E3E9EA]'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-[#71808D]">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-sm text-[#263746] italic leading-relaxed">
                      "{rev.feedbackText}"
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E3E9EA] flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#E8F5F1] text-[#168C83] flex items-center justify-center text-xs font-bold">
                      {rev.firstName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-[#17324D]">
                      {rev.firstName}
                    </span>
                    <span className="text-[10px] text-[#71808D] ml-auto">
                      Verified submission
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
