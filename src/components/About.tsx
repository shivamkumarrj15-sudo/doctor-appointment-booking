import React from 'react';
import { Sparkles, FileText, Headphones } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export const About: React.FC = () => {
  const cards = [
    {
      title: 'Simple Experience',
      description:
        'A distraction-free, user-friendly booking interface designed to help you quickly choose your preferred appointment time without needing an account or login.',
      icon: Sparkles,
      tag: 'Convenience',
    },
    {
      title: 'Clear Information',
      description:
        'Upfront indicative consultation fees and clear service categories so you always know what to expect before sending your appointment request.',
      icon: FileText,
      tag: 'Transparency',
    },
    {
      title: 'Personal Booking Assistance',
      description:
        'Enquiries are routed directly to WhatsApp where real clinic staff verify doctor availability, answer questions, and finalize your appointment slot.',
      icon: Headphones,
      tag: 'Human Touch',
    },
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-white border-t border-[#E3E9EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5F1] text-[#168C83] text-xs font-semibold uppercase tracking-wider">
            About Our Booking Service
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17324D] tracking-tight">
            Care Begins With Convenience
          </h2>
          <p className="text-base sm:text-lg text-[#71808D] leading-relaxed">
            We believe accessing appointment information should be simple and stress-free. This booking experience helps visitors explore available options and send their appointment requests directly through WhatsApp.
          </p>
        </div>

        {/* Three Value Cards */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-[#FCFDFB] rounded-2xl border border-[#E3E9EA] p-7 shadow-xs hover:shadow-md hover:border-[#168C83]/40 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-[#E8F5F1] text-[#168C83] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-[#71808D] px-2.5 py-0.5 rounded-full bg-[#F3F6F7]">
                      {card.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#17324D] mb-3 group-hover:text-[#168C83] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-[#71808D] leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E3E9EA]/60 text-xs text-[#168C83] font-medium flex items-center gap-1">
                  <span>Seamless via WhatsApp</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Demo Notice Banner */}
        <div className="mt-12 p-4 sm:p-5 rounded-xl bg-[#F3F6F7] border border-[#E3E9EA] text-center max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm text-[#71808D]">
            <strong className="text-[#17324D]">Demonstration Notice:</strong> {siteConfig.disclaimerText} No medical qualifications or doctor identities are fabricated on this website.
          </p>
        </div>

      </div>
    </section>
  );
};
