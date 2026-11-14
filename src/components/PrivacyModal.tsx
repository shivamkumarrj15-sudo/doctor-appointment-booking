import React, { useState, useEffect } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { isAnalyticsOptedOut, setAnalyticsOptOut } from '../services/analytics';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  const [optedOut, setOptedOut] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setOptedOut(isAnalyticsOptedOut());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleOptOut = () => {
    const newVal = !optedOut;
    setOptedOut(newVal);
    setAnalyticsOptOut(newVal);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#17324D]/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E3E9EA] relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#71808D] hover:text-[#17324D] p-1.5 rounded-lg hover:bg-[#F3F6F7] cursor-pointer"
          aria-label="Close privacy notice"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#E8F5F1] text-[#168C83] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 id="privacy-modal-title" className="text-2xl font-bold text-[#17324D]">
              Privacy & Data Transparency Notice
            </h3>
            <p className="text-xs text-[#71808D]">
              How we protect your privacy, measure anonymous website visits, and handle feedback
            </p>
          </div>
        </div>

        <div className="space-y-5 text-sm text-[#263746] leading-relaxed pt-3 border-t border-[#E3E9EA]">
          
          <div>
            <h4 className="font-bold text-[#17324D] text-base mb-1">
              1. Anonymous Session Measurement
            </h4>
            <p className="text-[#71808D]">
              This website uses a lightweight, privacy-focused anonymous session token to measure genuine page visits, button clicks, and appointment request progress. We do <strong>not</strong> collect your IP address, browser fingerprint, location coordinates, or cross-site tracking data. Sessions automatically expire after 30 minutes of inactivity.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#17324D] text-base mb-1">
              2. Zero Storage of Medical or Contact Information
            </h4>
            <p className="text-[#71808D]">
              When you fill out the appointment booking form, your name, preferred consultation date, and optional notes are formatted into a WhatsApp message link on your client device. <strong>We do not store your appointment name, phone number, note, or medical concerns in our analytics database.</strong>
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#17324D] text-base mb-1">
              3. WhatsApp Click & Lead Tracking
            </h4>
            <p className="text-[#71808D]">
              When you click a WhatsApp button, the website records an anonymous event (e.g., button location and selected fee category). Opening WhatsApp represents an appointment enquiry and does not independently confirm a medical consultation.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#17324D] text-base mb-1">
              4. Genuine Feedback Collection & Public Consent
            </h4>
            <p className="text-[#71808D]">
              Visitors can voluntarily submit experience feedback without any account, email, or login. Feedback is kept private by default unless you explicitly check the public display consent box. If consent is given and your feedback is approved by the website owner, only your first name and review are displayed. Surnames are never published.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#17324D] text-base mb-1">
              5. Geolocation Privacy
            </h4>
            <p className="text-[#71808D]">
              We do not track or request your GPS coordinates. The clinic location displayed is currently a broad demonstration reference for Jaipur, Rajasthan, and will be updated when an authorized medical clinic is onboarded.
            </p>
          </div>

          {/* Opt-out Toggle */}
          <div className="p-4 rounded-xl bg-[#F3F6F7] border border-[#E3E9EA] flex items-center justify-between gap-4">
            <div>
              <span className="font-bold text-xs uppercase tracking-wider text-[#17324D] block">
                Opt out of Anonymous Analytics
              </span>
              <span className="text-xs text-[#71808D]">
                If enabled, your visits and clicks will be completely excluded from website metrics.
              </span>
            </div>
            <button
              type="button"
              onClick={handleToggleOptOut}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                optedOut
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-[#168C83] text-white shadow-xs hover:bg-[#0f6760]'
              }`}
            >
              {optedOut ? 'Opted Out (Active)' : 'Allow Anonymous Analytics'}
            </button>
          </div>

        </div>

        <div className="mt-6 pt-4 border-t border-[#E3E9EA] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#17324D] hover:bg-[#0f2235] text-white font-semibold text-sm cursor-pointer"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
};
