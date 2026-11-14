import React from 'react';
import { MousePointerClick, Edit3, MessageCircle, CheckCircle } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Choose an Appointment Option',
      description: 'Select between Basic, Standard, or Priority options depending on your preference and schedule.',
      icon: MousePointerClick,
    },
    {
      step: '02',
      title: 'Enter Your Details',
      description: 'Provide your name, preferred consultation date, and ideal time slot in our simple form.',
      icon: Edit3,
    },
    {
      step: '03',
      title: 'Continue on WhatsApp',
      description: 'A pre-filled appointment request draft is prepared and opened in your WhatsApp automatically.',
      icon: MessageCircle,
    },
    {
      step: '04',
      title: 'Receive Booking Confirmation',
      description: 'Authorized clinic staff verifies slot availability and confirms your final appointment directly via chat.',
      icon: CheckCircle,
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-white border-t border-[#E3E9EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5F1] text-[#168C83] text-xs font-semibold uppercase tracking-wider">
            Clear 4-Step Process
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17324D] tracking-tight">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-[#71808D] leading-relaxed">
            From enquiry to confirmed slot in minutes — fast, stress-free, and powered by personal WhatsApp assistance.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#FCFDFB] rounded-2xl border border-[#E3E9EA] p-6 relative flex flex-col justify-between hover:border-[#168C83]/50 hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-black text-[#168C83]/20 group-hover:text-[#168C83]/40 transition-colors">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#E8F5F1] text-[#168C83] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#17324D] mb-2 group-hover:text-[#168C83] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-[#71808D] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[#E3E9EA]/50 text-xs font-semibold text-[#168C83]">
                  Step {idx + 1} of 4
                </div>
              </div>
            );
          })}
        </div>

        {/* Vital Clarification Note */}
        <div className="mt-12 p-4 rounded-xl bg-[#E8F5F1] border border-[#168C83]/30 text-center max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm text-[#17324D] leading-relaxed font-medium">
            <strong className="text-[#168C83]">Important Notice:</strong> Clicking Continue on WhatsApp sends an appointment request draft. The appointment is <span className="underline decoration-[#168C83]">confirmed only</span> after authorized clinic staff reviews availability and responds to your message.
          </p>
        </div>

      </div>
    </section>
  );
};
