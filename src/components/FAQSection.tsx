import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First one open by default

  const faqs: FAQItem[] = [
    {
      question: '1. How do I request an appointment?',
      answer:
        'Select your preferred consultation category (Basic, Standard, or Priority), fill out your name, preferred date, and preferred time in the booking form, and click "Continue on WhatsApp". This creates a pre-formatted draft message in WhatsApp that you send directly to our team.',
    },
    {
      question: '2. Is my booking immediately confirmed?',
      answer:
        'No. Submitting your request on the website sends an enquiry draft to WhatsApp. The appointment is formally confirmed only after clinic staff reviews doctor availability and messages you back with slot confirmation.',
    },
    {
      question: '3. Can I change my preferred time?',
      answer:
        'Yes! Once the WhatsApp chat opens, you can directly message the clinic staff to adjust your consultation slot, ask for earlier openings, or reschedule according to mutual convenience.',
    },
    {
      question: '4. Are the displayed prices final?',
      answer:
        `${siteConfig.disclaimerText} These indicate entry-level consultation rates for demonstration and initial enquiry purposes. The clinic will confirm final consultation fees based on your specific medical requirement.`,
    },
    {
      question: '5. How do I contact booking assistance?',
      answer:
        `You can click the Customer Care "Chat on WhatsApp" button, use the floating WhatsApp icon on the bottom right, or directly message our official WhatsApp number: ${siteConfig.whatsapp.number}.`,
    },
    {
      question: '6. Why does this website ask for feedback?',
      answer:
        'We ask for feedback to continually refine the ease of navigation, clarity of indicative fees, and overall booking request experience. All ratings are real and unedited.',
    },
    {
      question: '7. Do I need Google login to give feedback?',
      answer:
        'No. We respect your time and privacy. You do not need a Google account, email address, password, phone number, or OTP to submit your experience feedback.',
    },
    {
      question: '8. Is my feedback public?',
      answer:
        'Your feedback is only displayed publicly if you explicitly check the consent box ("I agree that my first name and feedback may be displayed publicly"). Even then, only your first name and review are shown; surnames are never published.',
    },
    {
      question: '9. Does clicking WhatsApp mean my appointment is confirmed?',
      answer:
        'No. Clicking WhatsApp generates an enquiry event and opens your messaging app with a draft request. It does not constitute a completed or verified booking until confirmed by authorized personnel.',
    },
    {
      question: '10. Where is the clinic located?',
      answer:
        `${siteConfig.location.displayNotice}. This broad city reference is for demonstration purposes. When an authorized clinic partner is officially onboarded, the verified street address, clinic timings, and location map will be updated here.`,
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-white border-t border-[#E3E9EA]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5F1] text-[#168C83] text-xs font-semibold uppercase tracking-wider">
            Clear Answers
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17324D] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-[#71808D] max-w-2xl mx-auto">
            Everything you need to know about our appointment enquiry assistance, WhatsApp confirmation, and privacy.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#E3E9EA] bg-[#FCFDFB] transition-all overflow-hidden shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus:bg-[#F3F6F7]"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-[#17324D] text-base sm:text-lg">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-[#168C83] text-white' : 'bg-[#E8F5F1] text-[#168C83]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm sm:text-base text-[#71808D] leading-relaxed border-t border-[#E3E9EA]/50 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
