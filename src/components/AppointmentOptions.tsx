import React from 'react';
import { siteConfig, type AppointmentOption } from '../config/siteConfig';
import { Check, Star, Zap, Shield, ArrowRight } from 'lucide-react';
import { recordEvent } from '../services/analytics';

interface AppointmentOptionsProps {
  selectedCategory: 'basic' | 'standard' | 'priority';
  onSelectCategory: (category: 'basic' | 'standard' | 'priority') => void;
}

export const AppointmentOptions: React.FC<AppointmentOptionsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const options = Object.values(siteConfig.appointmentOptions);

  const handleSelect = (option: AppointmentOption) => {
    onSelectCategory(option.id);
    recordEvent('appointment_option_selected', {
      button_location: `card_${option.id}`,
      category_selected: option.id,
      fee_indicative: option.indicativeFee,
    });

    const formEl = document.getElementById('booking-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="appointments" className="py-16 md:py-24 bg-[#FCFDFB] border-t border-[#E3E9EA]">
      {/* Also anchor for #fees */}
      <div id="fees" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5F1] text-[#168C83] text-xs font-semibold uppercase tracking-wider">
            Consultation Categories & Indicative Fees
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17324D] tracking-tight">
            Appointment Options
          </h2>
          <p className="text-base sm:text-lg text-[#71808D] leading-relaxed">
            Choose a consultation category tailored to your schedule and urgency. Select any option to configure your WhatsApp booking request.
          </p>
        </div>

        {/* Visible Mandatory Disclaimer */}
        <div className="mt-6 max-w-3xl mx-auto p-3.5 rounded-xl bg-[#E8F5F1]/80 border border-[#168C83]/30 text-center">
          <p className="text-xs sm:text-sm text-[#17324D] font-medium">
            <span className="font-bold text-[#168C83]">Notice:</span> {siteConfig.disclaimerText}
          </p>
        </div>

        {/* The Three Premium Cards */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {options.map((option) => {
            const isSelected = selectedCategory === option.id;
            const isStandard = option.id === 'standard';
            const isPriority = option.id === 'priority';

            return (
              <div
                key={option.id}
                className={`relative rounded-2xl flex flex-col justify-between transition-all duration-300 p-8 ${
                  isSelected
                    ? 'ring-2 ring-[#168C83] shadow-xl bg-white scale-[1.02]'
                    : isStandard
                    ? 'bg-white border-2 border-[#168C83]/40 shadow-lg hover:shadow-xl'
                    : isPriority
                    ? 'bg-gradient-to-b from-white to-[#F3F6F7] border border-[#17324D]/30 shadow-md hover:shadow-lg'
                    : 'bg-white border border-[#E3E9EA] shadow-sm hover:shadow-md'
                }`}
              >
                {/* Badge if present */}
                {option.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-xs ${
                        isStandard
                          ? 'bg-[#168C83] text-white'
                          : 'bg-[#17324D] text-[#FCFDFB]'
                      }`}
                    >
                      {isStandard ? <Star className="w-3.5 h-3.5 fill-white" /> : <Zap className="w-3.5 h-3.5 text-[#25D366]" />}
                      {option.badge}
                    </span>
                  </div>
                )}

                <div>
                  {/* Category Title & Description */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-[#17324D] tracking-tight">
                      {option.name}
                    </h3>
                    {isSelected && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E8F5F1] text-[#168C83] border border-[#168C83]/30">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#71808D] mt-2 min-h-[40px]">
                    {option.description}
                  </p>

                  {/* Pricing Display */}
                  <div className="mt-6 pt-6 border-t border-[#E3E9EA] flex items-baseline gap-1.5">
                    <span className="text-xs font-semibold text-[#71808D] uppercase tracking-wider">
                      Indicative Fee
                    </span>
                    <div className="flex items-baseline ml-auto">
                      <span className="text-2xl font-bold text-[#17324D]">{option.currency}</span>
                      <span className="text-4xl font-extrabold text-[#17324D] tracking-tight">
                        {option.indicativeFee}
                      </span>
                      <span className="text-xs text-[#71808D] ml-1">/ request</span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="mt-6 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#17324D]">
                      Included in request:
                    </p>
                    <ul className="space-y-2.5">
                      {option.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-sm text-[#263746]">
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              isStandard
                                ? 'bg-[#168C83] text-white'
                                : 'bg-[#E8F5F1] text-[#168C83]'
                            }`}
                          >
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          </div>
                          <span className="leading-tight">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Button */}
                <div className="mt-8 pt-6 border-t border-[#E3E9EA]">
                  <button
                    onClick={() => handleSelect(option)}
                    className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#168C83] ${
                      isSelected
                        ? 'bg-[#168C83] text-white shadow-md hover:bg-[#0f6760]'
                        : isStandard
                        ? 'bg-[#168C83] text-white hover:bg-[#0f6760] shadow-sm'
                        : 'bg-[#F3F6F7] text-[#17324D] hover:bg-[#E3E9EA] hover:text-[#17324D]'
                    }`}
                  >
                    <span>{isSelected ? 'Selected — Proceed to Form' : 'Select Appointment'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-center text-[#71808D] mt-2">
                    Applies {option.name} category to the booking form below
                  </p>
                </div>

              </div>
            );
          })}
        </div>

        {/* Reassurance Footer */}
        <div className="mt-12 text-center flex items-center justify-center gap-2 text-xs text-[#71808D]">
          <Shield className="w-4 h-4 text-[#168C83]" />
          <span>No advance payment needed on this website. Final consultation charges are settled with the clinic.</span>
        </div>

      </div>
    </section>
  );
};
