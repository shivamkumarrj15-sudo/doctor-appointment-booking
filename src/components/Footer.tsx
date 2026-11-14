import React from 'react';
import { siteConfig } from '../config/siteConfig';
import { Calendar, Shield } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenFeedback: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenFeedback }) => {
  const currentYear = new Date().getFullYear();

  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#17324D] text-[#FCFDFB] pt-16 pb-12 border-t border-[#17324D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand & Purpose Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#168C83] flex items-center justify-center text-white font-bold shadow-sm">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                {siteConfig.websiteLabel}
              </span>
            </div>

            <p className="text-sm text-white/70 leading-relaxed max-w-sm">
              A streamlined healthcare appointment booking assistance website designed to connect patients directly with clinic scheduling via WhatsApp.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#25D366] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              <span>WhatsApp Booking Channel: +91 {siteConfig.whatsapp.number}</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#168C83]">
              Navigation
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-sm text-white/80">
              <li>
                <button
                  onClick={() => handleScroll('#home')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('#about')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('#appointments')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Appointments
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('#fees')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Fees
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('#location')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Location
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('#feedback')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Feedback
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('#customercare')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Customer Care
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenFeedback}
                  className="hover:text-white transition-colors cursor-pointer text-left text-[#168C83]"
                >
                  Give Feedback
                </button>
              </li>
            </ul>
          </div>

          {/* Social Channels (Coming Soon) & Legal */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#168C83]">
              Social Media
            </h4>
            
            <div className="flex flex-col gap-2.5">
              {/* Instagram */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                <div className="flex items-center gap-2 text-white/90">
                  <svg className="w-4 h-4 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                  <span>Instagram</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                  Coming Soon
                </span>
              </div>

              {/* YouTube */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                <div className="flex items-center gap-2 text-white/90">
                  <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span>YouTube</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                  Coming Soon
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenPrivacy}
                className="text-xs text-white/80 hover:text-white underline underline-offset-4 cursor-pointer flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-[#168C83]" />
                <span>Privacy Notice & Analytics Policy</span>
              </button>
            </div>
          </div>

        </div>

        {/* Mandatory Appointment Disclaimer */}
        <div className="py-6 border-b border-white/10 text-xs text-white/60 leading-relaxed text-center sm:text-left">
          <p>
            <strong className="text-white/80">Appointment Disclaimer:</strong> {siteConfig.disclaimerText} No doctor identity, certifications, or medical claims are represented on this demo website. All enquiries are transmitted directly to WhatsApp for real-time verification and scheduling.
          </p>
        </div>

        {/* Copyright strip */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div>
            © {currentYear} {siteConfig.websiteLabel}. All rights reserved. Demo Booking Assistance.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-white/80 transition-colors cursor-pointer"
            >
              Privacy Notice
            </button>
            <span>•</span>
            <button
              onClick={onOpenFeedback}
              className="hover:text-white/80 transition-colors cursor-pointer"
            >
              Feedback
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
