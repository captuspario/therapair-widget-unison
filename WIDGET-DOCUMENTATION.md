# Therapair Widget - Complete Documentation

**Version**: 1.0  
**Last Updated**: 2025-10-10  
**Status**: Production (Embedded in Unison Counselling)  
**URL**: https://unisoncounselling.com/therapair-widget/

---

## 📑 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Widget Purpose & Goals](#widget-purpose--goals)
3. [User Journey](#user-journey)
4. [Technical Architecture](#technical-architecture)
5. [Integration with Landing Page](#integration-with-landing-page)
6. [Email & Notification System](#email--notification-system)
7. [Future: Notion Integration](#future-notion-integration)
8. [Deployment](#deployment)
9. [Maintenance](#maintenance)

---

## Executive Summary

### What is the Therapair Widget?

An **embedded therapist-matching quiz** that helps users find the right therapist from the Unison Counselling team based on their preferences, concerns, and needs.

### Where It Lives

- **Host Site**: Unison Counselling (unisoncounselling.com)
- **Widget Type**: Embedded iframe
- **File**: `therapair-standalone.html`

### Current State

- ✅ 8-therapist database
- ✅ Interactive matching quiz (6 questions)
- ✅ Booking form integration
- ✅ Email notifications via FormSubmit.co
- ❌ No Notion sync yet (planned)
- ❌ No AI email personalization yet (planned)

---

## Widget Purpose & Goals

### Primary Goal

Help Unison Counselling clients find the therapist who best matches their needs through an engaging, interactive experience.

### Business Goals

1. **Increase Bookings**: Make it easier for clients to choose a therapist
2. **Reduce Mismatch**: Better first-time matches = better outcomes
3. **Showcase Team**: Highlight Unison's diverse, inclusive team
4. **Collect Data**: Learn what clients care about most
5. **Brand Differentiation**: Stand out with modern, thoughtful UX

### User Goals

1. **Find Right Fit**: Match with a therapist who understands them
2. **Feel Confident**: Make an informed decision
3. **Easy Booking**: Seamless path from match to booking
4. **Feel Understood**: See that their preferences matter

---

## User Journey

### Complete Flow

```
1. User lands on Unison website
2. Sees widget/link to therapist matching
3. Clicks to start quiz
4. Answers 6 questions:
   - Gender preference for therapist
   - Age preferences
   - Session type (in-person/online)
   - Primary concerns
   - Therapeutic approaches
   - Urgency/timeline
5. Sees 1-3 matched therapists (ranked)
6. Reviews therapist profiles
7. Clicks "Book with [Name]"
8. Fills booking form (name, email, phone)
9. Sees preferences summary
10. Submits booking
11. Receives confirmation
12. Unison team receives notification
```

### Quiz Questions

#### Q1: Gender Preference
- **Options**: Female, Male, Non-Binary, No preference
- **Why**: Many clients have strong preferences for therapist gender
- **Weight**: High

#### Q2: Age Preference  
- **Options**: Similar to my age, Older and more experienced, Younger and relatable, No preference
- **Why**: Age can impact therapeutic relationship
- **Weight**: Medium

#### Q3: Session Type
- **Options**: In-person (Melbourne CBD), Online (Zoom), Either works
- **Why**: Practical constraint for availability
- **Weight**: High (filters out non-available)

#### Q4: Primary Concerns (Multi-select)
- **Options**: Anxiety, Depression, Relationship issues, Trauma/PTSD, Identity/self-esteem, Grief/loss, Life transitions, Work stress, Other
- **Why**: Match therapist specializations
- **Weight**: High

#### Q5: Therapeutic Approach
- **Options**: CBT, ACT, Person-centred, Somatic/body-based, Psychodynamic, Open to recommendation
- **Why**: Match therapist training and style
- **Weight**: Medium

#### Q6: Urgency
- **Options**: ASAP, Within 2 weeks, Within a few weeks, Willing to wait for right therapist
- **Why**: Manage expectations and prioritize bookings
- **Weight**: Low (for matching), High (for admin)

### Matching Algorithm

**Scoring System**:
```javascript
// Each therapist gets scored based on:
1. Gender match (if specified): +3 points
2. Age preference match: +2 points
3. Session type availability: +3 points (or eliminate)
4. Primary concerns overlap: +1 per matched concern
5. Approach match: +2 points
```

**Result Display**:
- Top 3 therapists shown (sorted by score)
- Tied scores shown in original order
- Each card shows: Photo, Name, Specializations, Brief bio

---

## Technical Architecture

### Frontend Stack

**Core Technologies**:
- Pure HTML/CSS/JavaScript (no frameworks)
- Embedded in `<iframe>` on Unison site
- Mobile-responsive design
- Lucide icons for UI

**File Structure**:
```
therapair-widget-unison/
├── src/
│   └── therapair-standalone.html  (1674 lines, complete widget)
├── therapair-widget/
│   ├── index.html  (embedded version)
│   └── images/
│       ├── adam.jpeg
│       ├── emma.jpeg
│       ├── ... (8 therapist photos)
├── tests/  (Playwright tests)
└── docs/
```

### Key Functions

```javascript
// Main flow functions
startQuiz()                    // Initialize quiz
handleAnswer(questionId, value) // Process user answer
showNextQuestion()             // Progress through quiz
findMatches()                  // Run matching algorithm
displayResults(matches)        // Show top 3 results
showBookingForm(therapistName) // Open booking modal

// Data management
therapists[]                   // Therapist database
userResponses{}               // User's quiz answers
userBookingData{}             // Booking form data

// Form handling
handleBookingSubmission(e)     // Process booking form
formatPreferencesForEmail()    // Format for email
showBookingSuccess()          // Success state
```

### Therapist Data Structure

```javascript
{
  name: "Emma Thompson",
  image: "images/emma.jpeg",
  gender: "female",
  ageRange: "40-50",
  sessionTypes: ["in-person", "online"],
  specializations: ["LGBTQ+ affirming", "Trauma-informed", "ENM/relationship diversity"],
  approaches: ["person-centred", "somatic"],
  concerns: ["trauma", "identity", "relationships", "anxiety"],
  experience: "15+ years",
  bio: "Emma brings a trauma-informed, LGBTQ+ affirming approach..."
}
```

---

## Integration with Landing Page

### Current Separation

**Landing Page** (therapair.com.au):
- Purpose: Interest gathering for Therapair platform
- Email: PHP + OpenAI AI
- Database: Notion
- Audiences: 4 types (Individual, Therapist, Org, Supporter)

**Widget** (Unison embedding):
- Purpose: Book therapist at Unison
- Email: FormSubmit.co
- Database: None (email only)
- Audiences: 1 type (Individual/client)

### Shared Elements

✅ **Design System**:
- Same purple color palette (`#9B74B7`, `#4F064F`)
- Same typography (Open Sans)
- Same button styles (rounded, pill-shaped)
- Same form input styles

✅ **Brand Voice**:
- Warm, professional, conversational
- Inclusive language
- Australian English

✅ **Philosophy**:
- User-centred design
- Mobile-first
- Accessibility focused

### Integration Opportunities

**Phase 1: Email Unification**
- [ ] Replace FormSubmit.co with shared PHP email handler
- [ ] Add AI personalization to booking confirmations
- [ ] Use same email templates
- [ ] Sync email preference management

**Phase 2: Notion Integration**
- [ ] Add widget bookings to same Notion database
- [ ] Use "source: widget_unison" field
- [ ] Track booking → session completion funnel
- [ ] Deduplicate users across projects

**Phase 3: Shared Codebase**
- [ ] Extract matching algorithm to shared module
- [ ] Create reusable booking form component
- [ ] Shared therapist data management
- [ ] Unified analytics

---

## Email & Notification System

### Current Implementation (FormSubmit.co)

**Booking Notification**:
```javascript
fetch('https://formsubmit.co/tino@unisoncounselling.com', {
  method: 'POST',
  body: formData
})
```

**FormData Sent**:
- Full Name
- Email  
- Phone
- Selected Therapist
- Preferences Summary (formatted quiz responses)
- Timestamp

**Admin Email** (to tino@unisoncounselling.com):
- Subject: "📅 New Booking: [Therapist Name]"
- Contains: All booking details and preferences

**User Autoresponse**:
```
Thank you for your booking request, [Name]! 

We've received your information and will contact you within 1 business day 
to schedule your first session with [Therapist]. 

Looking forward to supporting you on your journey.
```

### Limitations of Current System

❌ **No Database**: Bookings not stored systematically  
❌ **No AI Personalization**: Generic autoresponse  
❌ **No Preference Management**: No unsubscribe/preference links  
❌ **Limited Analytics**: Can't track booking funnel  
❌ **No Follow-up**: Manual process for team  

### Future: Unified Email System

**Migration Plan**:

1. **Create `widget-booking-handler.php`**
   - Similar to landing page `submit-form.php`
   - Process booking form data
   - Send admin notification
   - Send AI-personalized user confirmation
   - Sync to Notion

2. **AI Personalization**
   ```php
   // System prompt
   "You're confirming a booking request for [Therapist] at Unison Counselling.
   Thank the user, confirm we received their booking request.
   Mention their specific preferences: [concerns], [urgency].
   Explain next steps: team will contact within 1 business day.
   Warm, professional, brief (2 paragraphs max)."
   ```

3. **Email Template**
   - Use same HTML structure as landing page
   - Therapair branding + Unison branding
   - Include preference management link
   - Include Unison contact details

---

## Future: Notion Integration

### Database Structure

**Add to Existing Notion Database**:

New fields for widget bookings:
```
Core Fields (shared):
- Email
- Submission Date
- Source: "widget_unison"
- Entry Type: "booking"
- Audience Type: "individual"
- Status: "new" | "contacted" | "scheduled" | "completed"

Widget-Specific Fields:
- Full Name
- Phone
- Selected Therapist (Select: Emma, Nicki, Adam, Joe, Michael, Natasha, Genevieve, Meg)
- Gender Preference
- Age Preference
- Session Type
- Primary Concerns (Multi-select)
- Therapeutic Approach
- Urgency
- Match Score (Number)
- Booking Status: "pending" | "confirmed" | "completed" | "cancelled"
- Session Date (Date)
- Session Notes (Long text)
```

### Notion Views

**Create Views**:
1. **All Widget Bookings** - Filter: source = "widget_unison"
2. **Pending Bookings** - Filter: booking_status = "pending"
3. **By Therapist** - Group by: Selected Therapist
4. **This Week's Bookings** - Filter: session_date this week
5. **Booking Funnel** - Board view by status

### Implementation

**File**: `therapair-widget-unison/notion-booking-sync.php`

```php
<?php
// Similar to landing page notion-sync.php
function syncBookingToNotion($bookingData) {
    $properties = [
        'Name' => ['title' => [['text' => ['content' => $bookingData['full_name']]]]],
        'Email' => ['email' => $bookingData['email']],
        'Phone' => ['phone_number' => $bookingData['phone']],
        'Source' => ['select' => ['name' => 'widget_unison']],
        'Entry Type' => ['select' => ['name' => 'booking']],
        'Selected Therapist' => ['select' => ['name' => $bookingData['therapist']]],
        'Primary Concerns' => ['multi_select' => [/* ... */]],
        'Urgency' => ['select' => ['name' => $bookingData['urgency']]],
        'Booking Status' => ['status' => ['name' => 'Pending']],
        // ... all other fields
    ];
    
    // Call Notion API
    callNotionAPI($properties);
}
?>
```

---

## Deployment

### Current Deployment (Manual)

1. Edit `src/therapair-standalone.html`
2. Copy to `therapair-widget/index.html`
3. Upload `therapair-widget/` folder to Unison server
4. Update iframe embedding if needed

### Future: Automated Deployment

**Goal**: Git-based deployment like landing page

**Setup**:
```bash
# Create deploy script
./deploy-widget-to-unison.sh

# Script contents:
- Build/minify if needed
- SSH to Unison server
- Pull from Git
- Restart if needed
```

### Embedding Code

**On Unison Website**:
```html
<iframe 
  src="https://unisoncounselling.com/therapair-widget/"
  width="100%"
  height="800px"
  style="border: none; border-radius: 12px;"
  title="Therapist Matching Quiz"
></iframe>
```

---

## Maintenance

### Regular Updates

**Weekly**:
- ✅ Check booking submissions (email)
- ✅ Monitor for errors/bugs
- ✅ Review user feedback

**Monthly**:
- ✅ Update therapist data if changes
- ✅ Review matching algorithm effectiveness
- ✅ Update copy/content as needed

**Quarterly**:
- ✅ Analyze booking patterns
- ✅ Optimize quiz questions
- ✅ Update design/UX improvements
- ✅ Review therapist database

### Updating Therapist Data

**Location**: Lines 100-300 in `therapair-standalone.html`

**Process**:
1. Find therapist object in `therapists` array
2. Update relevant fields (bio, image, specializations, etc.)
3. Test locally
4. Deploy to production

**Example**:
```javascript
{
  name: "Emma Thompson",
  image: "images/emma.jpeg",
  // Update these fields as needed
  specializations: ["New specialization", ...],
  bio: "Updated bio text...",
  sessionTypes: ["in-person", "online"], // Add/remove
  concerns: ["anxiety", "trauma"], // Add/remove
}
```

---

## Analytics & Tracking

### Current Tracking

❌ **No analytics implemented**

### Recommended Implementation

**Add Google Analytics 4**:
```javascript
// Track quiz start
gtag('event', 'quiz_start', {
  'event_category': 'widget',
  'event_label': 'therapist_matching'
});

// Track quiz completion
gtag('event', 'quiz_complete', {
  'event_category': 'widget',
  'matched_therapists': matchedNames.join(', ')
});

// Track booking submission
gtag('event', 'booking_submit', {
  'event_category': 'widget',
  'therapist': therapistName
});
```

**Metrics to Track**:
1. Quiz start rate
2. Quiz completion rate (% who finish)
3. Question abandonment (where users drop off)
4. Match satisfaction (which therapists get selected)
5. Booking conversion rate
6. Time to complete quiz

---

## Troubleshooting

### Common Issues

**Issue**: Widget not loading  
**Solution**: Check iframe src URL, verify server is up

**Issue**: Images not showing  
**Solution**: Verify image paths relative to HTML file

**Issue**: Booking form not submitting  
**Solution**: Check FormSubmit.co quota, verify email address

**Issue**: Matching algorithm not working  
**Solution**: Check console for errors, verify therapist data structure

---

## Related Documentation

- **Central Hub**: `/THERAPAIR-CENTRAL-DOCUMENTATION.md`
- **Landing Page**: `/therapair-landing-page/LANDING-PAGE-DOCUMENTATION.md`
- **Design System**: `/therapair-widget-unison/docs/unison-design-system.md`
- **Deployment**: `/therapair-widget-unison/DEPLOYMENT-INSTRUCTIONS.md`

---

## Version History

### v1.0 (2025-10-10)
- Initial widget documentation
- Aligned with landing page system
- Integration roadmap defined
- Scalability plan outlined

---

**Maintained By**: Therapair Development Team  
**Last Review**: 2025-10-10

---

**End of Documentation**

