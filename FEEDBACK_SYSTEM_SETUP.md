# FEEDBACK SYSTEM SETUP & MODERATION GUIDE

> **INTEGRITY FIRST:** This website never generates fake reviews, fabricated 5-star ratings, or artificial testimonials. The system starts strictly at **0.0 / 5 stars** and displays **"No reviews yet."** until genuine visitors submit feedback and the website owner approves it.

---

## 1. How the Feedback Collection Works

1. **Automatic Timing**: After **90 seconds of active visible time** (pausing when the browser tab is hidden or backgrounded), a friendly popup appears once per session.
2. **No Intrusion**: The popup will NOT interrupt a visitor who is actively typing in the appointment booking form or who has already submitted or dismissed feedback in the current session.
3. **No Account Required**: Visitors submit their first name, rating (1–5 stars), and optional comment without needing a Google account, email, phone number, password, or OTP.
4. **Public Display Consent**:
   - An explicit, unchecked-by-default checkbox is provided: *"I agree that my first name and feedback may be displayed publicly on this website."*
   - **Without consent**: The submission remains strictly private. The rating is used solely for aggregate calculations once approved.
   - **With consent**: An approved first name and comment can be displayed in the website's review section. **Surnames are NEVER published under any circumstance.**

---

## 2. Moderation Workflow in Supabase

Every visitor submission enters the `website_feedback` table with `status = 'pending'`. Unapproved submissions are NEVER shown publicly on the website.

### Step 1: Open Supabase Table Editor
1. In your Supabase Dashboard, click **Table Editor** on the left menu.
2. Select the `website_feedback` table.
3. You will see columns:
   - `id`: Unique identifier
   - `first_name`: Submitter's first name
   - `surname`: Submitter's surname (private)
   - `rating`: 1 to 5
   - `feedback_text`: Feedback comments
   - `display_consent`: `true` or `false`
   - `status`: `'pending'`, `'approved'`, or `'rejected'`
   - `created_at`: Timestamp

### Step 2: Moderating via Table Editor (Click to Edit)
- To approve a review: Double-click the `status` cell of that row, change from `pending` to `approved`, and press enter.
- To reject spam/inappropriate submissions: Change `status` to `rejected`.

---

## 3. Moderating via Supabase SQL Editor (Fast Batch Commands)

Alternatively, run these simple SQL queries in the Supabase **SQL Editor**:

### View All Pending Feedback
```sql
SELECT id, first_name, rating, feedback_text, display_consent, created_at
FROM public.website_feedback
WHERE status = 'pending'
ORDER BY created_at DESC;
```

### Approve a Review by ID
```sql
UPDATE public.website_feedback
SET status = 'approved'
WHERE id = 'paste-the-uuid-here';
```

### Approve All High-Quality Pending Reviews
```sql
UPDATE public.website_feedback
SET status = 'approved'
WHERE status = 'pending'
  AND feedback_text IS NOT NULL
  AND char_length(feedback_text) > 10;
```

### Reject a Spam or Inappropriate Submission
```sql
UPDATE public.website_feedback
SET status = 'rejected'
WHERE id = 'paste-the-uuid-here';
```

---

## 4. Rating Calculation Logic

The average rating is calculated dynamically from approved submissions only:

$$\text{Average Rating} = \frac{\sum \text{Approved Ratings}}{\text{Total Number of Approved Reviews}}$$

- If `Total Approved Reviews = 0`: The website automatically displays **"0.0 / 5"** with **5 empty neutral stars** and the label **"No reviews yet."**
- Once at least one review is marked `approved`, the rating recalculates automatically without redeploying code.
- Rejected and pending submissions are completely excluded from the calculation.
