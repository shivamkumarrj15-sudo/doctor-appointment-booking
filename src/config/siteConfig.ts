/**
 * Central Site Configuration
 * All business details, pricing, WhatsApp info, and demo flags are managed here.
 * Do not duplicate these details across multiple files.
 */

export interface AppointmentOption {
  id: 'basic' | 'standard' | 'priority';
  name: string;
  tagline: string;
  indicativeFee: number;
  currency: string;
  description: string;
  badge?: string;
  recommended?: boolean;
  features: string[];
}

export interface SiteConfig {
  websiteLabel: string;
  demoSubtitle: string;
  isDemo: boolean;
  disclaimerText: string;
  whatsapp: {
    number: string;
    country: string;
    countryCode: string;
    internationalNumber: string;
    baseUrl: string;
    defaultEnquiryMessage: string;
    defaultEnquiryMessageHindi: string;
  };
  appointmentOptions: Record<'basic' | 'standard' | 'priority', AppointmentOption>;
  themeColors: {
    primaryNavy: string;
    healthcareTeal: string;
    softMint: string;
    warmWhite: string;
    lightGrey: string;
    mainText: string;
    secondaryText: string;
    border: string;
    whatsappGreen: string;
  };
  location: {
    isDemo: boolean;
    demoCity: string;
    demoState: string;
    demoCountry: string;
    displayNotice: string;
    futureNotice: string;
    clinicTimingNotice: string;
    // Authorized address placeholder for future clinic onboarding
    authorizedClinicAddress?: string;
    mapQuery: string;
  };
  customerCare: {
    heading: string;
    whatsappDisplay: string;
    supportNote: string;
  };
  socialMedia: {
    instagram: { name: string; status: string; active: boolean };
    youtube: { name: string; status: string; active: boolean };
  };
  analytics: {
    inactivityTimeoutMinutes: number;
    feedbackPopupActiveSeconds: number;
  };
}

export const siteConfig: SiteConfig = {
  websiteLabel: 'Appointment Booking',
  demoSubtitle: 'Demonstration Booking Assistance Service',
  isDemo: true,
  disclaimerText:
    'Displayed fees are indicative demo prices. Final fees and appointment availability must be verified with the authorized clinic.',
  
  whatsapp: {
    number: '8005844014',
    country: 'India',
    countryCode: '+91',
    internationalNumber: '918005844014',
    baseUrl: 'https://wa.me/918005844014',
    defaultEnquiryMessage:
      'Hello! I visited your appointment booking website. I would like to enquire about booking an appointment. Please share the available slots and booking details.',
    defaultEnquiryMessageHindi:
      'नमस्ते! मैंने आपकी अपॉइंटमेंट बुकिंग वेबसाइट देखी। मैं अपॉइंटमेंट बुक करने के बारे में जानकारी चाहता/चाहती हूँ। कृपया उपलब्ध स्लॉट्स और बुकिंग विवरण साझा करें।',
  },

  appointmentOptions: {
    basic: {
      id: 'basic',
      name: 'BASIC',
      tagline: 'Entry-level consultation enquiry',
      indicativeFee: 250,
      currency: '₹',
      description: 'An entry-level appointment request option.',
      features: [
        'Initial general consultation request',
        'Standard queue slot allocation',
        'Direct WhatsApp confirmation assistance',
        'Transparent indicative pricing'
      ],
    },
    standard: {
      id: 'standard',
      name: 'STANDARD',
      tagline: 'Comprehensive consultation enquiry',
      indicativeFee: 300,
      currency: '₹',
      description: 'A standard appointment request option.',
      badge: 'Most Popular',
      recommended: true,
      features: [
        'Comprehensive consultation request',
        'Preferred time-window scheduling support',
        'Priority WhatsApp triage & slot check',
        'Rescheduling assistance via WhatsApp'
      ],
    },
    priority: {
      id: 'priority',
      name: 'PRIORITY',
      tagline: 'Priority availability enquiry',
      indicativeFee: 500,
      currency: '₹',
      description: 'A priority appointment request option, subject to actual availability.',
      badge: 'Priority Request',
      features: [
        'Fast-track consultation request',
        'Earliest available slot priority',
        'Dedicated WhatsApp care assistance',
        'Subject to actual clinic doctor availability'
      ],
    },
  },

  themeColors: {
    primaryNavy: '#17324D',
    healthcareTeal: '#168C83',
    softMint: '#E8F5F1',
    warmWhite: '#FCFDFB',
    lightGrey: '#F3F6F7',
    mainText: '#263746',
    secondaryText: '#71808D',
    border: '#E3E9EA',
    whatsappGreen: '#25D366',
  },

  location: {
    isDemo: true,
    demoCity: 'Jaipur, Rajasthan, India',
    demoState: 'Rajasthan',
    demoCountry: 'India',
    displayNotice: 'Demo location: Jaipur, Rajasthan, India',
    futureNotice: 'Location details will be updated with the authorized clinic address.',
    clinicTimingNotice: 'Actual consultation timings are confirmed directly through WhatsApp after slot verification.',
    authorizedClinicAddress: undefined, // Will be set when verified clinic is onboarded
    mapQuery: 'Jaipur, Rajasthan, India',
  },

  customerCare: {
    heading: "We're Here to Help",
    whatsappDisplay: '8005844014',
    supportNote: 'Our team assists you with booking enquiries and scheduling availability via WhatsApp.',
  },

  socialMedia: {
    instagram: { name: 'Instagram', status: 'Coming Soon', active: false },
    youtube: { name: 'YouTube', status: 'Coming Soon', active: false },
  },

  analytics: {
    inactivityTimeoutMinutes: 30,
    feedbackPopupActiveSeconds: 90,
  },
};
