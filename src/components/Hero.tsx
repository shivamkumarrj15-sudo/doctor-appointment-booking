import React from 'react';
import { Calendar, MessageSquareText, Clock, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { recordEvent } from '../services/analytics';
import { siteConfig } from '../config/siteConfig';

export const Hero: React.FC = () => {
  const handleBookNow = () => {
    recordEvent('appointment_option_selected', { button_location: 'hero_primary_cta' });
    const target = document.getElementById('booking-form');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreOptions = () => {
    recordEvent('appointment_option_selected', { button_location: 'hero_secondary_cta' });
    const target = document.getElementById('appointments');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-[#FCFDFB] via-[#E8F5F1]/30 to-[#FCFDFB]">
      {/* Background ambient decorative shapes */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-[#168C83]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 rounded-full bg-[#17324D]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline, Subtitle, CTAs, Trust indicators */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Demo / Welcome Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F5F1] text-[#168C83] text-xs sm:text-sm font-semibold border border-[#168C83]/20 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#168C83] animate-pulse" />
              <span>Simple, Direct WhatsApp Appointment Requests</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#17324D] tracking-tight leading-[1.15]">
              Your Health <br />
              <span className="text-[#168C83]">Deserves Care.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-[#71808D] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Booking an appointment should feel simple and comfortable. Explore your appointment options and send your booking request through WhatsApp.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={handleBookNow}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#168C83] hover:bg-[#0f6760] active:scale-98 text-white font-semibold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#168C83] cursor-pointer"
              >
                <Calendar className="w-5 h-5" />
                <span>Book an Appointment</span>
              </button>

              <button
                onClick={handleExploreOptions}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-[#F3F6F7] active:scale-98 text-[#17324D] font-semibold text-base border border-[#E3E9EA] shadow-xs hover:border-[#168C83]/40 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#168C83] cursor-pointer"
              >
                <span>Explore Appointment Options</span>
                <ArrowRight className="w-4 h-4 text-[#168C83]" />
              </button>
            </div>

            {/* Three Trust Indicators */}
            <div className="pt-6 border-t border-[#E3E9EA] grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 justify-center lg:justify-start p-2 rounded-lg bg-white/60 sm:bg-transparent">
                <div className="w-9 h-9 rounded-full bg-[#E8F5F1] text-[#168C83] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="block text-sm font-bold text-[#17324D]">Simple Booking</span>
                  <span className="block text-xs text-[#71808D]">No complex signups</span>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-center lg:justify-start p-2 rounded-lg bg-white/60 sm:bg-transparent">
                <div className="w-9 h-9 rounded-full bg-[#E8F5F1] text-[#168C83] flex items-center justify-center shrink-0">
                  <MessageSquareText className="w-5 h-5 text-[#25D366]" />
                </div>
                <div className="text-left">
                  <span className="block text-sm font-bold text-[#17324D]">WhatsApp Assistance</span>
                  <span className="block text-xs text-[#71808D]">Instant draft message</span>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-center lg:justify-start p-2 rounded-lg bg-white/60 sm:bg-transparent">
                <div className="w-9 h-9 rounded-full bg-[#E8F5F1] text-[#168C83] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="block text-sm font-bold text-[#17324D]">Convenient Requests</span>
                  <span className="block text-xs text-[#71808D]">Choose preferred slot</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Composition / Demo Preview Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Visual Card */}
              <div className="bg-white rounded-2xl border border-[#E3E9EA] shadow-xl p-6 sm:p-7 space-y-6 relative z-10 backdrop-blur-sm">
                
                {/* Header of Preview Card */}
                <div className="flex items-center justify-between pb-4 border-b border-[#E3E9EA]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E8F5F1] text-[#168C83] flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-[#17324D]">Appointment Assistant</h2>
                      <p className="text-xs text-[#71808D]">Fast-track WhatsApp enquiry</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-[#25D366]/10 text-[#128C7E]">
                    Direct WhatsApp
                  </span>
                </div>

                {/* Highlight Steps */}
                <div className="space-y-3.5">
                  <div className="p-3.5 rounded-xl bg-[#F3F6F7] flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#168C83] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-[#17324D]">Pick Consultation Category</h3>
                      <p className="text-xs text-[#71808D] mt-0.5">
                        Options starting from {siteConfig.appointmentOptions.basic.currency}{siteConfig.appointmentOptions.basic.indicativeFee} (Demo fees).
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F3F6F7] flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#168C83] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-[#17324D]">Fill Desired Slot</h3>
                      <p className="text-xs text-[#71808D] mt-0.5">
                        Choose your preferred consultation date and morning/evening timing.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#E8F5F1]/60 border border-[#168C83]/20 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-[#17324D]">Send Request via WhatsApp</h3>
                      <p className="text-xs text-[#71808D] mt-0.5">
                        Your pre-filled message draft opens directly on official WhatsApp: <strong className="text-[#17324D]">{siteConfig.whatsapp.number}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Notice */}
                <div className="p-3 rounded-lg bg-[#FCFDFB] border border-[#E3E9EA] text-xs text-[#71808D] leading-relaxed">
                  <span className="font-semibold text-[#17324D]">Notice:</span> Appointment bookings are confirmed manually after verifying slot availability with clinic staff.
                </div>

                {/* Instant Action CTA */}
                <button
                  onClick={handleBookNow}
                  className="w-full py-3 px-4 rounded-xl bg-[#17324D] hover:bg-[#0f2235] text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Calendar className="w-4 h-4 text-[#168C83]" />
                  <span>Start Appointment Request</span>
                </button>

              </div>

              {/* Floating decorative badge */}
              <div className="absolute -bottom-4 -left-4 sm:-left-6 bg-white border border-[#E3E9EA] rounded-xl shadow-lg p-3 flex items-center gap-3 z-20">
                <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  WA
                </div>
                <div>
                  <div className="text-xs font-bold text-[#17324D]">WhatsApp Ready</div>
                  <div className="text-[11px] text-[#71808D]">{siteConfig.whatsapp.number}</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
