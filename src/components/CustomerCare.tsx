import React from 'react';
import { siteConfig } from '../config/siteConfig';
import { MessageSquareText, Shield, Headphones, ExternalLink } from 'lucide-react';
import { recordEvent } from '../services/analytics';
import { buildWhatsAppLink, getDefaultEnquiryMessage } from '../utils/whatsapp';

export const CustomerCare: React.FC = () => {
  const handleChatOnWhatsApp = () => {
    recordEvent('whatsapp_click', {
      button_location: 'customer_care_section',
    });
    const link = buildWhatsAppLink(getDefaultEnquiryMessage('en'));
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="customercare" className="py-16 md:py-20 bg-[#FCFDFB] border-t border-[#E3E9EA]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-br from-[#17324D] to-[#23486d] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden text-center sm:text-left">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#168C83]/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-8 items-center">
            
            <div className="sm:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs">
                <Headphones className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Customer Care & Booking Help</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                {siteConfig.customerCare.heading}
              </h2>

              <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                Have questions regarding appointment categories, indicative consultation fees, or slot availability? Reach out directly through WhatsApp.
              </p>

              <div className="pt-2 flex items-center justify-center sm:justify-start gap-3">
                <span className="text-xs uppercase tracking-wider text-white/70 font-semibold">
                  Direct WhatsApp:
                </span>
                <span className="text-lg sm:text-xl font-bold tracking-tight text-[#25D366]">
                  {siteConfig.customerCare.whatsappDisplay}
                </span>
              </div>
            </div>

            <div className="sm:col-span-4 flex flex-col items-center sm:items-end justify-center">
              <button
                onClick={handleChatOnWhatsApp}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#25D366] hover:bg-[#1ea952] active:scale-98 text-white font-bold text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]"
              >
                <MessageSquareText className="w-5 h-5" />
                <span>Chat on WhatsApp</span>
                <ExternalLink className="w-4 h-4 ml-0.5" />
              </button>
              
              <div className="mt-3 flex items-center gap-1.5 text-xs text-white/60">
                <Shield className="w-3.5 h-3.5 text-[#168C83]" />
                <span>Verified Assistance Channel</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
