import React, { useState, useEffect } from 'react';
import { siteConfig } from '../config/siteConfig';
import { Menu, X, Calendar, MessageSquare, ShieldCheck } from 'lucide-react';
import { recordEvent } from '../services/analytics';

interface NavbarProps {
  onOpenFeedback: () => void;
  onOpenPrivacy: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenFeedback, onOpenPrivacy }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['home', 'about', 'appointments', 'fees', 'location', 'feedback', 'customercare'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Appointments', href: '#appointments', id: 'appointments' },
    { label: 'Fees', href: '#fees', id: 'fees' },
    { label: 'Location', href: '#location', id: 'location' },
    { label: 'Feedback', href: '#feedback', id: 'feedback' },
    { label: 'Customer Care', href: '#customercare', id: 'customercare' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookClick = () => {
    setMobileMenuOpen(false);
    recordEvent('appointment_option_selected', { button_location: 'navbar_cta' });
    const target = document.getElementById('booking-form');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FCFDFB]/95 backdrop-blur-md shadow-sm border-b border-[#E3E9EA]'
          : 'bg-[#FCFDFB] border-b border-[#E3E9EA]/60'
      }`}
    >
      {/* Top Demo Notification Strip */}
      <div className="bg-[#17324D] text-[#FCFDFB] text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
        <span>
          <strong className="font-semibold">Demo Booking Assistance</strong> — Enquiries verified & processed via WhatsApp.
        </span>
        <button
          onClick={onOpenPrivacy}
          className="underline hover:text-[#25D366] transition-colors ml-1 cursor-pointer"
        >
          Privacy Info
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#home');
            }}
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#168C83] rounded-lg p-1"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#168C83] to-[#17324D] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-[#17324D] tracking-tight leading-tight">
                {siteConfig.websiteLabel}
              </span>
              <span className="text-xs text-[#71808D] font-medium">
                {siteConfig.demoSubtitle}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeSection === link.id
                    ? 'text-[#168C83] bg-[#E8F5F1] font-semibold'
                    : 'text-[#263746] hover:text-[#168C83] hover:bg-[#F3F6F7]'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Header Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenFeedback}
              className="px-3.5 py-2 text-xs font-semibold text-[#17324D] border border-[#E3E9EA] bg-white hover:bg-[#F3F6F7] rounded-lg transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#168C83] cursor-pointer"
              title="Share feedback"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#168C83]" />
              <span>Feedback</span>
            </button>

            <button
              onClick={handleBookClick}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#168C83] hover:bg-[#0f6760] active:scale-98 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#168C83] cursor-pointer flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-[#263746] hover:bg-[#F3F6F7] focus:outline-none focus:ring-2 focus:ring-[#168C83]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FCFDFB] border-b border-[#E3E9EA] shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-4 pt-3 pb-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`block px-3 py-2.5 rounded-md text-base font-medium ${
                  activeSection === link.id
                    ? 'text-[#168C83] bg-[#E8F5F1] font-semibold'
                    : 'text-[#263746] hover:text-[#168C83] hover:bg-[#F3F6F7]'
                }`}
              >
                {link.label}
              </a>
            ))}

            <div className="pt-4 border-t border-[#E3E9EA] flex flex-col gap-2.5">
              <button
                onClick={handleBookClick}
                className="w-full py-3 px-4 rounded-lg bg-[#168C83] hover:bg-[#0f6760] text-white font-semibold text-center flex items-center justify-center gap-2 shadow-sm"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenFeedback();
                }}
                className="w-full py-2.5 px-4 rounded-lg border border-[#E3E9EA] text-[#17324D] font-medium text-center flex items-center justify-center gap-2 bg-[#F3F6F7]"
              >
                <MessageSquare className="w-4 h-4 text-[#168C83]" />
                <span>Share Experience Feedback</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
