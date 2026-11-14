# ANALYTICS SETUP & OWNER DATA ACCESS GUIDE

> **NO ADMIN PANEL NEEDED:** All analytics and visitor metrics are collected automatically in the background and stored directly in your secure Supabase PostgreSQL database. As the website owner, you access your reports directly through your Supabase Project Console.

---

## 1. Quick Start: Connecting Supabase

### Step 1: Create a Free Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create an account or sign in.
2. Click **New Project**.
3. Choose a name (e.g., `appointment-booking-analytics`), set a strong database password, and pick a region close to your visitors (e.g., `South Asia (Mumbai)`).

### Step 2: Run the Database Migration
1. In your Supabase dashboard, click **SQL Editor** on the left menu.
2. Click **New query**.
3. Copy the full contents of:
   `supabase/migrations/20261114_initial_schema.sql`
4. Paste it into the SQL editor and click **Run** (or `Ctrl+Enter`).
5. You should see `Success. No rows returned`. All tables (`analytics_events`, `website_feedback`), indexes, Row Level Security policies, and reporting views are now active.

### Step 3: Configure Environment Variables
1. In your Supabase dashboard, navigate to **Project Settings** → **API**.
2. Find:
   - **Project URL** (e.g., `https://abcdefghijklm.supabase.co`)
   - **anon / public key** (the public key with `anon` role)
3. Create a `.env` file in the root of your project:
   ```env
   VITE_SUPABASE_URL=https://abcdefghijklm.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. **Never put your `service_role` key in frontend `.env`.** The `anon` key is strictly protected by our Row Level Security policies (the public can only insert events, never read or delete analytics).

---

## 2. Viewing Real-Time Reports in Supabase

You do not need a custom admin interface. Simply open **SQL Editor** in Supabase and run these pre-built copy-and-run queries.

### Query 1: Master Traffic & WhatsApp Lead Summary
Run this query to view all key performance indicators at a glance:

```sql
SELECT * FROM public.analytics_summary;
```

**Columns returned:**
- `total_page_views`: Total genuine page loads.
- `total_sessions`: Total unique anonymous sessions (30-minute inactivity threshold).
- `total_whatsapp_clicks`: Every click on any WhatsApp appointment or chat button.
- `unique_whatsapp_enquiry_leads`: Distinct visitor sessions that clicked WhatsApp.
- `enquiry_conversion_rate_pct`: Percentage of visitors who became WhatsApp enquiry leads (`leads / sessions * 100`).
- `total_form_starts`: Visitors who started filling the booking form.
- `total_form_completions`: Visitors who completed the form and clicked Continue on WhatsApp.
- `feedback_prompts_shown`: Number of times the 90-second feedback popup was displayed.
- `feedback_submissions`: Real feedback submissions received.
- `feedback_response_rate_pct`: Percentage of prompted visitors who shared feedback.
- `feedback_skips`: Visitors who clicked Skip.
- `feedback_skip_rate_pct`: Percentage of prompted visitors who skipped.
- `approved_average_rating`: Verified average score (1.0 - 5.0) of approved reviews.
- `total_approved_reviews`: Total number of approved reviews.

---

### Query 2: Daily Traffic & Lead Trend
View daily growth, page views, and WhatsApp leads over time:

```sql
SELECT * FROM public.analytics_daily_summary;
```

---

### Query 3: WhatsApp Leads Breakdown by Button Location & Category
Analyze which button or consultation tier is driving the most WhatsApp enquiries:

```sql
SELECT * FROM public.whatsapp_lead_summary;
```

---

### Query 4: Why Visitors Skipped Feedback
Analyze visitor responses to the 1-tap follow-up ("What stopped you from sharing feedback today?"):

```sql
SELECT * FROM public.feedback_reason_summary;
```

---

## 3. How Metrics are Calculated

| Metric | Definition | Example |
| :--- | :--- | :--- |
| **Page View** | Counted once on initial route load. React re-renders and dev StrictMode double-mounts are excluded. | 1 visitor opening the page = 1 page view |
| **Session** | Anonymous UUID renewed after 30 minutes of inactivity. | 1 visitor browsing for 10 minutes = 1 session |
| **WhatsApp Clicks** | Every genuine click on any WhatsApp button. | Visitor clicks 3 times = 3 clicks |
| **WhatsApp Enquiry Leads** | Distinct sessions containing at least one WhatsApp click. | Visitor clicks 3 times in 1 session = 1 unique lead |
| **Form Starts** | Tracked upon initial user focus on any booking form input. | Indicates visitor purchase intent |
| **Form Completions** | Tracked when all form fields validate successfully and WhatsApp opens. | Finished booking funnel |

---

## 4. Exporting Data to CSV / Excel

1. In Supabase, go to **Table Editor**.
2. Select `analytics_events` or `website_feedback`.
3. Click the **Export** button on the top right.
4. Choose **Export to CSV**.
