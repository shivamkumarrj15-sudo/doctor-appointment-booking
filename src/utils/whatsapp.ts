import { siteConfig } from '../config/siteConfig';

export interface AppointmentFormData {
  fullName: string;
  category: 'basic' | 'standard' | 'priority';
  preferredDate: string;
  preferredTime: string;
  bookingNote?: string;
  language?: 'en' | 'hi';
}

/**
 * Builds a valid WhatsApp web/app link with properly encoded message parameters.
 */
export function buildWhatsAppLink(message: string): string {
  const cleanMessage = message.trim();
  const encoded = encodeURIComponent(cleanMessage);
  return `${siteConfig.whatsapp.baseUrl}?text=${encoded}`;
}

/**
 * Formats appointment request details into the official required WhatsApp draft message.
 */
export function buildAppointmentMessage(data: AppointmentFormData): string {
  const selectedOption = siteConfig.appointmentOptions[data.category] || siteConfig.appointmentOptions.standard;
  const isHindi = data.language === 'hi';

  if (isHindi) {
    let msg = `नमस्ते! मैं अपॉइंटमेंट का अनुरोध करना चाहता/चाहती हूँ।\n\n`;
    msg += `नाम: ${data.fullName.trim()}\n`;
    msg += `अपॉइंटमेंट श्रेणी: ${selectedOption.name}\n`;
    msg += `सांकेतिक शुल्क: ${selectedOption.currency}${selectedOption.indicativeFee}\n`;
    msg += `पसंदीदा तिथि: ${data.preferredDate}\n`;
    msg += `पसंदीदा समय: ${data.preferredTime}\n`;

    if (data.bookingNote && data.bookingNote.trim()) {
      msg += `नोट: ${data.bookingNote.trim()}\n`;
    }

    msg += `\nकृपया उपलब्धता और अंतिम परामर्श शुल्क की पुष्टि करें।\n\nधन्यवाद।`;
    return msg;
  }

  let msg = `Hello! I would like to request an appointment.\n\n`;
  msg += `Name: ${data.fullName.trim()}\n`;
  msg += `Appointment Category: ${selectedOption.name}\n`;
  msg += `Indicative Fee: ${selectedOption.currency}${selectedOption.indicativeFee}\n`;
  msg += `Preferred Date: ${data.preferredDate}\n`;
  msg += `Preferred Time: ${data.preferredTime}\n`;

  if (data.bookingNote && data.bookingNote.trim()) {
    msg += `Booking Note: ${data.bookingNote.trim()}\n`;
  }

  msg += `\nPlease confirm availability and the final consultation fee.\n\nThank you.`;
  return msg;
}

/**
 * Returns the default enquiry message when the user clicks Customer Care or floating WhatsApp.
 */
export function getDefaultEnquiryMessage(language: 'en' | 'hi' = 'en'): string {
  return language === 'hi'
    ? siteConfig.whatsapp.defaultEnquiryMessageHindi
    : siteConfig.whatsapp.defaultEnquiryMessage;
}

/**
 * Reliable clipboard copy helper with fallback for older browsers.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below
    }
  }

  // Fallback using textarea
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    textArea.remove();
    return successful;
  } catch {
    return false;
  }
}
