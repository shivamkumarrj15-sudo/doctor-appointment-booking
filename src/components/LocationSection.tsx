import React from 'react';
import { MapPin, Navigation, Clock, ShieldAlert, MessageCircle } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { recordEvent } from '../services/analytics';
import { buildWhatsAppLink, getDefaultEnquiryMessage } from '../utils/whatsapp';

export const LocationSection: React.FC = () => {
  const isDemo = siteConfig.location.isDemo;

  const handleWhatsAppEnquiry = () => {
    recordEvent('whatsapp_click', {
      button_location: 'location_enquiry',
    });
    const waLink = buildWhatsAppLink(getDefaultEnquiryMessage('en'));
    window.open(waLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="location" className="py-16 md:py-24 bg-white border-t border-[#E3E9EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5F1] text-[#168C83] text-xs font-semibold uppercase tracking-wider">
            Location & Visiting Information
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17324D] tracking-tight">
            Clinic Location
          </h2>
          <p className="text-base sm:text-lg text-[#71808D] leading-relaxed">
            {isDemo
              ? 'Broad geographic demonstration reference for the appointment booking service.'
              : 'Authorized clinic location and consultation details.'}
          </p>
        </div>

        {/* Demo Location Banner & Clear Notice */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#E8F5F1]/70 border border-[#168C83]/30 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-[#168C83] text-white flex items-center justify-center shrink-0 shadow-sm">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-base font-bold text-[#17324D]">
                  {siteConfig.location.displayNotice}
                </span>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#168C83] text-white">
                  Demo Reference
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#71808D] mt-1">
                {siteConfig.location.futureNotice}
              </p>
            </div>
            <button
              onClick={handleWhatsAppEnquiry}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#F3F6F7] text-[#17324D] border border-[#E3E9EA] text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-xs shrink-0"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Ask via WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Map and Details Grid */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* Map Viewer Container */}
          <div className="lg:col-span-7 bg-[#F3F6F7] rounded-2xl border border-[#E3E9EA] overflow-hidden min-h-[360px] sm:min-h-[420px] relative shadow-sm flex flex-col">
            {/* Broad City Level Map Embed */}
            <iframe
              title="Broad City Map of Jaipur"
              src="https://maps.google.com/maps?q=Jaipur%20Rajasthan%20India&t=&z=12&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              className="w-full h-full min-h-[360px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            
            {/* Overlay Notice for Demo Clarity */}
            <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-[#E3E9EA] shadow-md flex items-center gap-2 text-xs text-[#263746]">
              <ShieldAlert className="w-4 h-4 text-[#168C83] shrink-0" />
              <span>
                <strong>Broad City Overview:</strong> This map shows the broad metropolitan region of Jaipur. No fictitious clinic marker or physical street address is shown.
              </span>
            </div>
          </div>

          {/* Location Information Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            {/* Card 1: Clinic Timings Notice */}
            <div className="bg-[#FCFDFB] rounded-2xl border border-[#E3E9EA] p-6 shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-[#E8F5F1] text-[#168C83] flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#17324D]">Appointment Timings</h3>
              </div>
              <p className="text-sm text-[#71808D] leading-relaxed">
                {siteConfig.location.clinicTimingNotice}
              </p>
              <div className="mt-4 pt-3 border-t border-[#E3E9EA]/60 flex items-center gap-2 text-xs text-[#168C83] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                <span>Slot verification active via WhatsApp</span>
              </div>
            </div>

            {/* Card 2: Authorized Clinic Notice */}
            <div className="bg-[#FCFDFB] rounded-2xl border border-[#E3E9EA] p-6 shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-[#E8F5F1] text-[#168C83] flex items-center justify-center">
                  <Navigation className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#17324D]">Future Clinic Details</h3>
              </div>
              <p className="text-sm text-[#71808D] leading-relaxed">
                When an authorized clinic partner is onboarded, verified address coordinates, landmark directions, and parking accessibility will be listed here.
              </p>
              <p className="text-xs text-[#71808D] mt-3">
                Status: <strong className="text-[#17324D]">Open for verification & clinic onboarding</strong>
              </p>
            </div>

            {/* Card 3: Privacy & Geolocation Assurance */}
            <div className="bg-[#F3F6F7] rounded-2xl border border-[#E3E9EA] p-4 text-xs text-[#71808D] leading-relaxed flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#168C83] shrink-0" />
              <span>
                We respect your privacy. This website does not request, track, or record your GPS coordinates or device location.
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
