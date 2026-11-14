# Premium Doctor Appointment Website + Automatic Lead Tracking + Genuine Feedback System

A premium, responsive, human-centered healthcare appointment booking website built for simplicity, direct WhatsApp enquiries, anonymous visitor lead tracking, and genuine user experience feedback.

---

## Key Highlights

- **Direct WhatsApp Enquiries**: Appointments are requested through WhatsApp with personalized URL-encoded drafts. No complex accounts, passwords, or checkout funnels.
- **Centralized Configuration**: All indicative prices, consultation categories, WhatsApp numbers, theme tokens, and demo notices are configured in `src/config/siteConfig.ts`.
- **Automatic Anonymous Lead Tracking**: Zero logins, zero PII, zero cross-site fingerprinting. Accurately tracks page views, unique sessions (with 30-minute inactivity renewal), WhatsApp clicks, unique WhatsApp enquiry leads, and booking form funnel drops.
- **Genuine Feedback System**: Starts strictly at 0.0 / 5 stars and "No reviews yet." with 5 empty neutral stars. Features a 90-second visible timer popup, 1-tap skip follow-up ("What stopped you from sharing feedback?"), and public display consent control.
- **No Complex Admin Panel**: The website owner accesses real-time analytics and moderates reviews directly through the Supabase Dashboard and SQL Editor.

---

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 with custom healthcare design tokens
- **Icons**: Lucide React + custom inline SVGs
- **Database & Telemetry**: Supabase PostgreSQL with Row Level Security (RLS)
- **Messaging**: WhatsApp Web / App API (`wa.me`)

---

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Navbar.tsx             # Sticky navigation with mobile menu & CTA
│   │   ├── Hero.tsx               # Healthcare hero with 3 trust badges & preview card
│   │   ├── About.tsx              # "Care Begins With Convenience" & 3 value cards
│   │   ├── AppointmentOptions.tsx # Basic (₹250), Standard (₹300), Priority (₹500)
│   │   ├── HowItWorks.tsx         # 4-step visual explanation of enquiry & confirmation
│   │   ├── BookingForm.tsx        # Form validation, date check, WhatsApp draft generator
│   │   ├── LocationSection.tsx    # Demo Jaipur overview, no fake clinic claims
│   │   ├── CustomerCare.tsx       # Direct WhatsApp customer support card
│   │   ├── FeedbackSection.tsx    # Genuine rating summary & moderated public reviews
│   │   ├── FeedbackModal.tsx      # 90-second visible popup & skip-reason collector
│   │   ├── FAQSection.tsx         # 10-item accordion answering critical questions
│   │   ├── Footer.tsx             # Navigation, Coming Soon socials, disclaimers
│   │   ├── FloatingWhatsApp.tsx   # Fixed bottom-right pulsing WhatsApp button
│   │   └── PrivacyModal.tsx       # Data transparency & analytics opt-out
│   ├── config/
│   │   └── siteConfig.ts          # Central source of truth for pricing, WhatsApp, location
│   ├── services/
│   │   ├── analytics.ts           # Anonymous session tracking & non-blocking events
│   │   └── feedback.ts            # Feedback submission & approved summary fetching
│   ├── utils/
│   │   └── whatsapp.ts            # WhatsApp message link builder & clipboard helper
│   ├── lib/
│   │   └── supabase.ts            # Graceful Supabase client initialization
│   ├── App.tsx                    # Root application layout & timer orchestrator
│   └── main.tsx                   # Entry point
├── supabase/
│   └── migrations/
│       └── 20261114_initial_schema.sql # Tables, RLS, indexes & reporting views
├── ANALYTICS_SETUP.md             # SQL reports & Supabase setup guide
├── FEEDBACK_SYSTEM_SETUP.md       # Feedback moderation & rating calculation guide
├── WHATSAPP_AUTOMATION_SETUP.md   # WhatsApp Business & Cloud API documentation
├── TESTING_REPORT.md              # Complete verification & test report
└── .env.example                   # Supabase environment variables example
```

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Environment (Optional for local test)
Copy `.env.example` to `.env` and fill in your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```
*(If credentials are not set, the app runs in local fallback mode with zero crashes).*

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## Central Configuration (`src/config/siteConfig.ts`)

To customize prices, contact details, or clinic information:
- Change consultation fees: edit `appointmentOptions.basic.indicativeFee`, etc.
- Change WhatsApp number: edit `whatsapp.number` and `whatsapp.internationalNumber`.
- Change clinic location from demo to live: set `location.isDemo = false` and update `location.authorizedClinicAddress`.
