import { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { AppointmentOptions } from './components/AppointmentOptions';
import { HowItWorks } from './components/HowItWorks';
import { BookingForm } from './components/BookingForm';
import { LocationSection } from './components/LocationSection';
import { CustomerCare } from './components/CustomerCare';
import { FeedbackSection } from './components/FeedbackSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { FeedbackModal } from './components/FeedbackModal';
import { PrivacyModal } from './components/PrivacyModal';
import { recordEvent, getOrCreateSessionId } from './services/analytics';
import { siteConfig } from './config/siteConfig';

const FEEDBACK_SHOWN_SESSION_KEY = 'demo_feedback_prompt_shown';
const FEEDBACK_SUBMITTED_SESSION_KEY = 'demo_feedback_submitted';

export function App() {
  const [selectedCategory, setSelectedCategory] = useState<'basic' | 'standard' | 'priority'>('standard');
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [isAutomaticFeedback, setIsAutomaticFeedback] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [feedbackRefreshTrigger, setFeedbackRefreshTrigger] = useState(0);

  // State to track if user is actively typing in the booking form
  const isFormActiveRef = useRef(false);

  // StrictMode guard to prevent duplicate page_view in dev
  const pageViewRecordedRef = useRef(false);

  // 1. Initial Page View Tracking & Session Establishment
  useEffect(() => {
    if (!pageViewRecordedRef.current) {
      pageViewRecordedRef.current = true;
      getOrCreateSessionId(); // initialize or renew
      recordEvent('page_view', {
        source_page: window.location.pathname || '/',
      });
    }
  }, []);

  // 2. 90-second Active Visible Website Time Feedback Trigger
  useEffect(() => {
    // Check if feedback already shown or submitted in this session
    const alreadyShown = sessionStorage.getItem(FEEDBACK_SHOWN_SESSION_KEY) === 'true';
    const alreadySubmitted = sessionStorage.getItem(FEEDBACK_SUBMITTED_SESSION_KEY) === 'true';

    if (alreadyShown || alreadySubmitted) {
      return;
    }

    let activeSeconds = 0;
    const targetSeconds = siteConfig.analytics.feedbackPopupActiveSeconds || 90;

    const interval = setInterval(() => {
      // Only count when document is visible to the visitor
      if (document.visibilityState === 'visible') {
        activeSeconds += 1;

        if (activeSeconds >= targetSeconds) {
          clearInterval(interval);

          // Ensure we don't interrupt active booking form typing
          if (!isFormActiveRef.current) {
            sessionStorage.setItem(FEEDBACK_SHOWN_SESSION_KEY, 'true');
            setIsAutomaticFeedback(true);
            setFeedbackModalOpen(true);
          } else {
            // Check again in 15 seconds if form was active
            const retryTimeout = setTimeout(() => {
              if (!sessionStorage.getItem(FEEDBACK_SHOWN_SESSION_KEY)) {
                sessionStorage.setItem(FEEDBACK_SHOWN_SESSION_KEY, 'true');
                setIsAutomaticFeedback(true);
                setFeedbackModalOpen(true);
              }
            }, 15000);
            return () => clearTimeout(retryTimeout);
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOpenFeedbackManually = () => {
    setIsAutomaticFeedback(false);
    setFeedbackModalOpen(true);
  };

  const handleFeedbackSuccess = () => {
    sessionStorage.setItem(FEEDBACK_SUBMITTED_SESSION_KEY, 'true');
    setFeedbackRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFDFB] text-[#263746] font-sans">
      {/* Sticky Header & Navigation */}
      <Navbar
        onOpenFeedback={handleOpenFeedbackManually}
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* About Section */}
        <About />

        {/* Appointment Options & Fees Section */}
        <AppointmentOptions
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />

        {/* How It Works (4 Steps) */}
        <HowItWorks />

        {/* Appointment Booking Form (Interactive Form -> WhatsApp Draft) */}
        <BookingForm
          selectedCategory={selectedCategory}
          onCategoryChange={(cat) => setSelectedCategory(cat)}
          onFormActiveStateChange={(isActive) => {
            isFormActiveRef.current = isActive;
          }}
        />

        {/* Location Section (Demo Jaipur reference) */}
        <LocationSection />

        {/* Customer Care Section */}
        <CustomerCare />

        {/* Genuine Feedback & Rating Section */}
        <FeedbackSection
          onOpenFeedbackModal={handleOpenFeedbackManually}
          refreshTrigger={feedbackRefreshTrigger}
        />

        {/* FAQ Section */}
        <FAQSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
        onOpenFeedback={handleOpenFeedbackManually}
      />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />

      {/* Feedback Modal (Automatic after 90s or manual trigger) */}
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        onSuccessSubmitted={handleFeedbackSuccess}
        isAutomaticTrigger={isAutomaticFeedback}
      />

      {/* Privacy Notice Modal */}
      <PrivacyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />
    </div>
  );
}

export default App;
