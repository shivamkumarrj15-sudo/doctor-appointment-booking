# WHATSAPP AUTOMATION & INTEGRATION SETUP

> **CURRENT STATUS:** All WhatsApp buttons generate properly URL-encoded draft messages pointing to the primary contact number `+91 8005844014` (`https://wa.me/918005844014`). WhatsApp automation is currently handled manually by clinic staff or through the standard WhatsApp Business app settings. This document outlines how to activate automated greetings and how to upgrade to the official WhatsApp Cloud API in the future.

---

## 1. Quick & Free Option: WhatsApp Business App Settings

If the clinic operates using the free **WhatsApp Business App** on Android or iOS:

### A. Greeting Message (Auto-Reply on First Enquiry)
1. Open the WhatsApp Business app on the clinic phone.
2. Go to **Settings** → **Business Tools** → **Greeting Message**.
3. Enable **Send greeting message**.
4. Set recipient to **Everyone**.
5. Recommended Message Template:
   > *"Hello! Thank you for contacting our Appointment Booking Assistance team. We have received your appointment request draft. Our clinic staff is reviewing available consultation slots and will confirm your timing and final fee shortly. Please let us know if you have an urgent inquiry."*

### B. Away Message (Outside Clinic Timings)
1. Go to **Settings** → **Business Tools** → **Away Message**.
2. Enable **Send away message**.
3. Schedule: **Outside of business hours**.
4. Recommended Message Template:
   > *"Thank you for your appointment request. Our clinic desk is currently closed. We will process your request and confirm your appointment slot first thing tomorrow morning."*

### C. Quick Replies (Fast Answers for Common Queries)
Set up quick reply shortcuts for rapid staff responses:
- Shortcut `/confirm`:
  > *"Your appointment is confirmed for [Date] at [Time] with Dr. [Doctor Name]. Consultation fee: ₹[Fee]. Please arrive 10 minutes prior to your slot."*
- Shortcut `/reschedule`:
  > *"The requested slot is currently booked. We have openings at [Time 1] and [Time 2] on the same date. Would either of these work for you?"*

---

## 2. Advanced Enterprise Option: WhatsApp Cloud API

When clinic volume scales and you require automated database status updates or CRM integration:

### Requirements:
1. **Meta Business Account**: Verified business account on [Meta for Developers](https://developers.facebook.com/).
2. **Clean Phone Number**: A phone number not currently registered with a consumer WhatsApp account.
3. **Webhook Server**: A lightweight Node.js/Python server or Supabase Edge Function to receive incoming messages.

### Recommended Future Architecture:
```
Website (Visitor) ──> wa.me link ──> Sends Request Message
                                            │
                                            ▼
Meta WhatsApp Cloud API ──Webhook──> Supabase Edge Function
                                            │
                                            ▼
                        1. Parses Date, Time, Category
                        2. Verifies Doctor Calendar
                        3. Auto-sends confirmation reply
                        4. Updates appointment record
```

### Transition Checklist:
- [ ] Upgrade clinic number to Meta WhatsApp Cloud API.
- [ ] Register pre-approved HSM templates with Meta for outbound notifications.
- [ ] Connect clinic management software or calendar via webhook.
