import React from 'react';
import { siteConfig } from '../config/siteConfig';
import { buildWhatsAppLink, getDefaultEnquiryMessage } from '../utils/whatsapp';
import { recordEvent } from '../services/analytics';

export const FloatingWhatsApp: React.FC = () => {
  const handleClick = () => {
    // Non-blocking analytics recording
    try {
      recordEvent('whatsapp_click', {
        button_location: 'floating_button',
      });
    } catch (e) {
      console.warn('Analytics event failed, continuing to WhatsApp:', e);
    }

    const message = getDefaultEnquiryMessage('en');
    const waLink = buildWhatsAppLink(message);
    window.open(waLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <aside aria-label="WhatsApp Assistance" className="fixed bottom-6 right-6 z-40 group">
      {/* Tooltip hint on desktop */}
      <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-[#17324D] text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap flex items-center gap-1.5">
          <span>Enquire on WhatsApp</span>
          <span className="text-[#25D366]">({siteConfig.whatsapp.number})</span>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={handleClick}
        aria-label="Enquire via WhatsApp for Appointment Assistance"
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#1ea952] active:scale-95 text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 cursor-pointer relative"
      >
        {/* Subtle breathing ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />

        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-7 h-7 sm:w-8 sm:h-8 relative z-10"
        >
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84-1.56 1.56-3.64 2.42-5.84 2.42-1.45 0-2.88-.38-4.14-1.11l-.3-.17-3.12.82.83-3.04-.2-.31c-.8-1.29-1.22-2.79-1.22-4.43 0-4.54 3.7-8.24 8.24-8.24m4.57 11.66c-.25-.13-1.48-.73-1.71-.81-.23-.09-.4-.13-.57.13-.17.25-.66.81-.81.98-.15.17-.3.19-.55.07-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.25-1.49-1.4-1.74-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.57-1.37-.78-1.87-.21-.5-.41-.43-.57-.44h-.49c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.31 3.8 2.53 1.08 2.53.72 2.99.68.46-.05 1.48-.61 1.69-1.19.21-.58.21-1.08.15-1.19-.06-.11-.23-.17-.48-.3" />
        </svg>
      </button>
    </aside>
  );
};
