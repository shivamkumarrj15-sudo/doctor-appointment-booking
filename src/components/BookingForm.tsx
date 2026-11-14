import React, { useState, useRef } from 'react';
import { siteConfig } from '../config/siteConfig';
import { buildWhatsAppLink, buildAppointmentMessage, copyToClipboard, type AppointmentFormData } from '../utils/whatsapp';
import { recordEvent } from '../services/analytics';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Shield,
  Languages,
} from 'lucide-react';

interface BookingFormProps {
  selectedCategory: 'basic' | 'standard' | 'priority';
  onCategoryChange: (category: 'basic' | 'standard' | 'priority') => void;
  onFormActiveStateChange?: (isActive: boolean) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  selectedCategory,
  onCategoryChange,
  onFormActiveStateChange,
}) => {
  const [fullName, setFullName] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00 AM - 01:00 PM (Morning)');
  const [bookingNote, setBookingNote] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  // Validation errors
  const [errors, setErrors] = useState<{
    fullName?: string;
    preferredDate?: string;
    preferredTime?: string;
    consent?: string;
  }>({});

  // Fallback modal state when user wants to copy or if popup is blocked
  const [fallbackModalOpen, setFallbackModalOpen] = useState(false);
  const [preparedDraftMessage, setPreparedDraftMessage] = useState('');
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Track if form started has been recorded
  const hasTriggeredFormStart = useRef(false);

  // Calculate today's date in YYYY-MM-DD for min date
  const today = new Date().toISOString().split('T')[0];

  const handleInputFocus = () => {
    if (!hasTriggeredFormStart.current) {
      hasTriggeredFormStart.current = true;
      recordEvent('appointment_form_started', {
        category_selected: selectedCategory,
        source_page: 'booking_form',
      });
    }
    if (onFormActiveStateChange) {
      onFormActiveStateChange(true);
    }
  };

  const handleInputBlur = () => {
    // Notify after delay if needed
    if (onFormActiveStateChange) {
      setTimeout(() => {
        onFormActiveStateChange(false);
      }, 5000);
    }
  };

  // Pre-defined time slots
  const timeSlots = [
    '10:00 AM - 01:00 PM (Morning)',
    '02:00 PM - 05:00 PM (Afternoon)',
    '05:00 PM - 08:00 PM (Evening)',
    'Earliest Available Slot',
  ];

  const validate = (): boolean => {
    const newErrors: {
      fullName?: string;
      preferredDate?: string;
      preferredTime?: string;
      consent?: string;
    } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters long.';
    } else if (fullName.trim().length > 60) {
      newErrors.fullName = 'Name must not exceed 60 characters.';
    }

    if (!preferredDate) {
      newErrors.preferredDate = 'Please select a preferred appointment date.';
    } else if (preferredDate < today) {
      newErrors.preferredDate = 'Past dates are not permitted. Please select today or a future date.';
    }

    if (!preferredTime) {
      newErrors.preferredTime = 'Please select a preferred consultation time.';
    }

    if (!consentGiven) {
      newErrors.consent = 'Please acknowledge that this is an enquiry request confirmed via WhatsApp.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const currentOption = siteConfig.appointmentOptions[selectedCategory];

    // 1. Record form completed event (strictly without PII)
    recordEvent('appointment_form_completed', {
      category_selected: selectedCategory,
      fee_indicative: currentOption.indicativeFee,
      language,
    });

    // 2. Record whatsapp_click event
    recordEvent('whatsapp_click', {
      button_location: 'booking_form_submit',
      category_selected: selectedCategory,
      fee_indicative: currentOption.indicativeFee,
      language,
    });

    // 3. Prepare the WhatsApp draft message
    const formData: AppointmentFormData = {
      fullName: fullName.trim(),
      category: selectedCategory,
      preferredDate,
      preferredTime,
      bookingNote: bookingNote.trim(),
      language,
    };

    const draftMsg = buildAppointmentMessage(formData);
    setPreparedDraftMessage(draftMsg);

    const waLink = buildWhatsAppLink(draftMsg);

    // 4. Open WhatsApp in new tab / app
    const opened = window.open(waLink, '_blank', 'noopener,noreferrer');

    // If popup was blocked or if on mobile/desktop where user wants reassurance, show fallback modal
    if (!opened || opened.closed || typeof opened.closed === 'undefined') {
      setFallbackModalOpen(true);
    } else {
      // Also open the helper modal so user can copy if needed
      setFallbackModalOpen(true);
    }
  };

  const handleCopyDraft = async () => {
    if (!preparedDraftMessage) return;
    const ok = await copyToClipboard(preparedDraftMessage);
    if (ok) {
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 3000);
    }
  };

  const currentOption = siteConfig.appointmentOptions[selectedCategory];

  return (
    <section id="booking-form" className="py-16 md:py-24 bg-[#F3F6F7] border-t border-[#E3E9EA] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Form Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5F1] text-[#168C83] text-xs font-semibold uppercase tracking-wider">
            Fast WhatsApp Booking Request
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17324D] tracking-tight">
            Let's Book Your Appointment
          </h2>
          <p className="text-base sm:text-lg text-[#71808D] max-w-2xl mx-auto">
            Fill in your preferred details. When you continue, your request is drafted and opened in WhatsApp for instant slot confirmation.
          </p>
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-2xl border border-[#E3E9EA] shadow-xl p-6 sm:p-10 relative">
          
          {/* Language and Demo Badge Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E3E9EA]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#25D366]" />
              <span className="text-xs font-semibold text-[#17324D]">
                Enquiries handled at: <strong className="text-[#168C83]">{siteConfig.whatsapp.number}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-[#71808D]" />
              <span className="text-xs text-[#71808D] font-medium">WhatsApp Message Language:</span>
              <div className="inline-flex rounded-lg border border-[#E3E9EA] p-0.5 bg-[#F3F6F7]">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    language === 'en'
                      ? 'bg-white text-[#168C83] shadow-xs'
                      : 'text-[#71808D] hover:text-[#17324D]'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('hi')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    language === 'hi'
                      ? 'bg-white text-[#168C83] shadow-xs'
                      : 'text-[#71808D] hover:text-[#17324D]'
                  }`}
                >
                  हिंदी (Hindi)
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            
            {/* 1. Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-bold text-[#17324D] mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71808D]">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                  }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="e.g. Ramesh Chandra"
                  maxLength={60}
                  className={`block w-full pl-11 pr-4 py-3 text-base text-[#17324D] bg-[#FCFDFB] border rounded-xl shadow-xs transition-colors focus:outline-none focus:ring-2 ${
                    errors.fullName
                      ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                      : 'border-[#E3E9EA] focus:ring-[#168C83] focus:border-[#168C83]'
                  }`}
                  aria-required="true"
                  aria-invalid={errors.fullName ? 'true' : 'false'}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.fullName}</span>
                </p>
              )}
            </div>

            {/* 2. Appointment Category Selector */}
            <div>
              <label className="block text-sm font-bold text-[#17324D] mb-2">
                Appointment Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['basic', 'standard', 'priority'] as const).map((catId) => {
                  const opt = siteConfig.appointmentOptions[catId];
                  const isChecked = selectedCategory === catId;
                  return (
                    <button
                      key={catId}
                      type="button"
                      onClick={() => {
                        onCategoryChange(catId);
                        recordEvent('appointment_option_selected', {
                          button_location: 'booking_form_selector',
                          category_selected: catId,
                          fee_indicative: opt.indicativeFee,
                        });
                      }}
                      onFocus={handleInputFocus}
                      className={`py-3 px-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isChecked
                          ? 'border-[#168C83] bg-[#E8F5F1] ring-2 ring-[#168C83]/30'
                          : 'border-[#E3E9EA] bg-[#FCFDFB] hover:border-[#168C83]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-[#17324D]">{opt.name}</span>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            isChecked ? 'bg-[#168C83] text-white' : 'bg-[#F3F6F7] text-[#71808D]'
                          }`}
                        >
                          {opt.currency}{opt.indicativeFee}
                        </span>
                      </div>
                      <span className="text-xs text-[#71808D] leading-tight mt-1 line-clamp-1">
                        {opt.tagline}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-[#71808D] mt-2">
                Selected category: <strong className="text-[#17324D]">{currentOption.name}</strong> (Indicative Fee: {currentOption.currency}{currentOption.indicativeFee})
              </p>
            </div>

            {/* 3 & 4. Preferred Date and Time in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Preferred Date */}
              <div>
                <label htmlFor="preferredDate" className="block text-sm font-bold text-[#17324D] mb-2">
                  Preferred Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71808D]">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="date"
                    id="preferredDate"
                    name="preferredDate"
                    min={today}
                    value={preferredDate}
                    onChange={(e) => {
                      setPreferredDate(e.target.value);
                      if (errors.preferredDate) setErrors({ ...errors, preferredDate: undefined });
                    }}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className={`block w-full pl-11 pr-4 py-3 text-base text-[#17324D] bg-[#FCFDFB] border rounded-xl shadow-xs transition-colors focus:outline-none focus:ring-2 ${
                      errors.preferredDate
                        ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                        : 'border-[#E3E9EA] focus:ring-[#168C83] focus:border-[#168C83]'
                    }`}
                    aria-required="true"
                    aria-invalid={errors.preferredDate ? 'true' : 'false'}
                  />
                </div>
                {errors.preferredDate && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.preferredDate}</span>
                  </p>
                )}
              </div>

              {/* Preferred Time */}
              <div>
                <label htmlFor="preferredTime" className="block text-sm font-bold text-[#17324D] mb-2">
                  Preferred Time Slot <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71808D]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={preferredTime}
                    onChange={(e) => {
                      setPreferredTime(e.target.value);
                      if (errors.preferredTime) setErrors({ ...errors, preferredTime: undefined });
                    }}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className={`block w-full pl-11 pr-4 py-3 text-base text-[#17324D] bg-[#FCFDFB] border rounded-xl shadow-xs transition-colors focus:outline-none focus:ring-2 ${
                      errors.preferredTime
                        ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                        : 'border-[#E3E9EA] focus:ring-[#168C83] focus:border-[#168C83]'
                    }`}
                    aria-required="true"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.preferredTime && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.preferredTime}</span>
                  </p>
                )}
              </div>

            </div>

            {/* 5. Optional Booking Note */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="bookingNote" className="block text-sm font-bold text-[#17324D]">
                  Optional Booking Note
                </label>
                <span className="text-xs text-[#71808D]">
                  {bookingNote.length}/200 characters
                </span>
              </div>
              <div className="relative">
                <textarea
                  id="bookingNote"
                  name="bookingNote"
                  rows={2}
                  maxLength={200}
                  value={bookingNote}
                  onChange={(e) => setBookingNote(e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="Any specific consultation questions or scheduling preferences (do not share sensitive medical history)..."
                  className="block w-full p-3.5 text-sm text-[#17324D] bg-[#FCFDFB] border border-[#E3E9EA] rounded-xl shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-[#168C83] focus:border-[#168C83]"
                />
              </div>
            </div>

            {/* Mandatory Consent Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => {
                    setConsentGiven(e.target.checked);
                    if (errors.consent) setErrors({ ...errors, consent: undefined });
                  }}
                  className="mt-1 w-4 h-4 text-[#168C83] border-[#E3E9EA] rounded focus:ring-[#168C83]"
                />
                <span className="text-xs sm:text-sm text-[#263746] leading-relaxed">
                  I understand that this is an appointment request, and the booking is confirmed only after availability is verified.
                </span>
              </label>
              {errors.consent && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.consent}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-xl bg-[#25D366] hover:bg-[#1ea952] active:scale-[0.99] text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]"
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84-1.56 1.56-3.64 2.42-5.84 2.42-1.45 0-2.88-.38-4.14-1.11l-.3-.17-3.12.82.83-3.04-.2-.31c-.8-1.29-1.22-2.79-1.22-4.43 0-4.54 3.7-8.24 8.24-8.24m4.57 11.66c-.25-.13-1.48-.73-1.71-.81-.23-.09-.4-.13-.57.13-.17.25-.66.81-.81.98-.15.17-.3.19-.55.07-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.25-1.49-1.4-1.74-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.57-1.37-.78-1.87-.21-.5-.41-.43-.57-.44h-.49c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.31 3.8 2.53 1.08 2.53.72 2.99.68.46-.05 1.48-.61 1.69-1.19.21-.58.21-1.08.15-1.19-.06-.11-.23-.17-.48-.3" />
                  </svg>
                </span>
                <span>Continue on WhatsApp</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <p className="text-xs text-center text-[#71808D] mt-3 leading-relaxed">
                Opens a draft message in WhatsApp. You will review and send it manually. No personal contact details or notes are stored in our analytics database.
              </p>
            </div>

          </form>

        </div>

        {/* Reassurance Footer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#71808D]">
          <Shield className="w-4 h-4 text-[#168C83]" />
          <span>Your privacy is protected. We do not require account registration or store sensitive medical details.</span>
        </div>

      </div>

      {/* Fallback & Copy Modal */}
      {fallbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17324D]/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#E3E9EA] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3E9EA]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#25D366]/20 text-[#128C7E] flex items-center justify-center font-bold">
                  WA
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#17324D]">WhatsApp Request Prepared</h3>
                  <p className="text-xs text-[#71808D]">Target: {siteConfig.whatsapp.number}</p>
                </div>
              </div>
              <button
                onClick={() => setFallbackModalOpen(false)}
                className="text-[#71808D] hover:text-[#17324D] p-1 rounded-lg hover:bg-[#F3F6F7]"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-[#263746]">
              WhatsApp has been opened in another window. If it did not open automatically, you can copy your prepared message and send it directly:
            </p>

            <div className="bg-[#F3F6F7] rounded-xl p-4 border border-[#E3E9EA] text-xs font-mono text-[#263746] whitespace-pre-line max-h-48 overflow-y-auto">
              {preparedDraftMessage}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleCopyDraft}
                className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-xl border border-[#E3E9EA] bg-white hover:bg-[#F3F6F7] text-[#17324D] font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                {copiedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#168C83]" />
                    <span>Copy Message Text</span>
                  </>
                )}
              </button>

              <a
                href={buildWhatsAppLink(preparedDraftMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1ea952] text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Open WhatsApp App</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setFallbackModalOpen(false)}
                className="text-xs text-[#71808D] hover:text-[#17324D] underline cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
