# Therapair Matching Widget (Unison Partnership)

**The intelligent therapy matching experience, powered by Therapair.**

> This is the embeddable widget that matches individuals with therapists based on their unique preferences, identity, and needs. Currently deployed on Unison Mental Health's website as a proof-of-concept.

---

## 🌐 Live Demo

**URL:** https://unisonmentalhealth.com/find-a-therapist-who-is-right-for-you/

---

## 📋 What This Is

The Therapair Widget is a standalone matching system that:

1. **Guides users through a 9-question quiz** about their therapy needs
2. **Matches them intelligently** with therapists who align with their preferences
3. **Displays ranked results** with photos, bios, and specialties
4. **Handles booking requests** with email confirmations to both admin and user
5. **Is embeddable** on any website (iframe or direct integration)

---

## 🚀 Quick Start

### Local Development

```bash
# Clone the repository
git clone <repo-url>
cd therapair-widget-unison

# Open in browser
open src/therapair-standalone.html

# Or use local server
python3 -m http.server 8000
# Visit http://localhost:8000/src/therapair-standalone.html
```

### Production Deployment

```bash
# Deploy to Unison server (Hostinger)
./deploy-widget-only.sh

# This will:
# - Test SSH connection
# - Create backup
# - Upload index.html, images/, PHP files
# - Set correct permissions
# - Verify deployment
```

---

## 📁 Project Structure

```
therapair-widget-unison/
├── README.md                      # This file
├── WIDGET-DEPLOYMENT-GUIDE.md    # Detailed deployment instructions
│
├── therapair-widget/              # Production files (deployed)
│   ├── index.html                 # Main widget
│   ├── submit-booking.php         # Booking form handler
│   ├── booking-thank-you.html     # Confirmation page
│   ├── .htaccess                  # Cache control
│   └── images/                    # Therapist photos
│       ├── nicki.jpeg
│       ├── adam.jpeg
│       ├── natasha.jpeg
│       ├── genevieve.jpeg
│       ├── emma.jpeg
│       ├── michael.jpeg
│       ├── meg.jpeg
│       └── joe.jpeg
│
├── src/                           # Development files
│   └── therapair-standalone.html  # Local testing version
│
├── deploy-widget-only.sh          # Automated deployment script
│
└── tests/                         # Screenshots & test files
    ├── final-ui-state.png
    ├── spacing-fixed.png
    └── ...
```

---

## 🎯 Key Features

### 1. Intelligent Matching Quiz (9 Questions)

1. **Who is seeking therapy?**  
   - For myself / For myself and my partner(s) / For someone else

2. **Age verification**  
   - Over 18 / Under 18 / Mixed

3. **Therapy format**  
   - Online (video/phone) / In-person / Either

4. **Primary concerns** (multi-select)  
   - Anxiety, Depression, Trauma, Relationships, Identity, etc.

5. **Therapist gender preference**  
   - Male / Female / Non-binary / No preference

6. **Cultural background preference**  
   - Specific culture / No preference

7. **LGBTQIA+ affirmation** (critical filter)  
   - Yes, this is important / Not important / Prefer but not essential

8. **Special requirements** (free text)  
   - Neurodivergence, language, accessibility, etc.

9. **Previous therapy experience**  
   - Yes / No / Not sure

### 2. Smart Matching Algorithm

**Scoring System:**
```javascript
// Mandatory filters (must match)
- LGBTQIA+ affirming (if required) → 10 points

// Preferred filters (boost score)
- Gender match → 5 points
- Cultural background match → 3 points
- Specialty alignment → 2 points each

// Results
- Sorted by score (highest first)
- Top 3 displayed as recommendations
```

### 3. Optimized Results Display

**Therapist Cards:**
- Profile photo (or initials fallback)
- Name + tagline
- **All specialties shown** (not just first 3)
- Smaller, more compact skill pills
- Only "Book Now" button (no "View Profile")
- Reduced whitespace (100px card padding)

### 4. Booking System

**Modal Form:**
- User contact info (name, email, phone)
- Pre-filled preference summary
- Selected therapist + specialty shown
- Smooth scrolling (modal content, not background)

**Email Notifications:**
- **Admin:** Full booking details to `tino@unisonmentalhealth.com`
- **User:** Professional confirmation with next steps
- Both emails: HTML formatted, mobile-responsive

---

## 🛠️ Tech Stack

**Frontend:**
- Vanilla JavaScript (ES6+)
- HTML5, CSS3
- No frameworks (intentional - lightweight & fast)
- Lucide icons (CDN)
- Google Fonts (Open Sans)

**Backend:**
- PHP 7.4+ (booking form handler)
- PHP mail() for email delivery
- No database (therapist data in HTML for MVP)

**Hosting:**
- Hostinger (Unison account)
- Path: `/public_html/therapair-widget/`
- SSL/HTTPS enabled

---

## 🎨 Design System

### Colors
```css
--primary-purple: #9B74B7;
--dark-purple: #4F064F;
--accent-cyan: #06B6D4;
--success-green: #10B981;
--gray: #6b7280;
--light-gray: #f9fafb;
```

### Components

**Skill Pills:**
- Background: `#9B74B7` (purple)
- Padding: `0.25rem 0.625rem`
- Font Size: `0.7rem`
- Border Radius: `9999px` (fully rounded)

**Buttons:**
- Primary: Purple gradient
- Hover: Slightly darker, scale(1.02)
- Active: scale(0.98)

**Cards:**
- Border: 1px solid `#e5e7eb`
- Border Radius: `16px`
- Padding: `1.5rem`
- Shadow: `0 1px 3px rgba(0,0,0,0.1)`
- Hover: Elevated shadow

---

## 🔄 Matching Flow

```
User clicks "Start Matching"
    │
    ▼
Answer 9 questions (client-side)
    │
    ▼
JavaScript calculates match scores
    │ (Each therapist scored against responses)
    ▼
Results sorted by score (highest first)
    │
    ▼
Display top matches with "Book Now" CTA
    │
    ▼
User clicks "Book Now"
    │
    ▼
Booking modal opens (pre-filled preferences)
    │
    ▼
User fills contact info + submits
    │
    ▼
POST to submit-booking.php
    │
    ├──▶ Send admin notification
    │
    ├──▶ Send user confirmation
    │
    └──▶ Redirect to booking-thank-you.html
```

---

## 📧 Email System

### Admin Notification
**To:** `tino@unisonmentalhealth.com`  
**Subject:** 📅 New Booking Request: [Therapist] - [Client Name]

**Content:**
- Client details (name, email, phone)
- Selected therapist + specialty
- Preferences summary
- Submission timestamp

### User Confirmation
**From:** `bookings@unisonmentalhealth.com` (Unison Mental Health Bookings)  
**Subject:** Your booking request with Unison Mental Health

**Content:**
- Simple greeting: "We've received your booking request"
- Shows: Therapist + User preferences
- What happens next (contact within 1 business day)
- Contact information
- Professional, non-excited tone

---

## 🚢 Deployment

### Automated Deployment (Recommended)

```bash
./deploy-widget-only.sh
```

**What it does:**
1. Tests SSH connection to Hostinger
2. Creates backup of existing files
3. Uploads:
   - `therapair-widget/index.html`
   - `therapair-widget/images/*`
   - `therapair-widget/submit-booking.php`
   - `therapair-widget/booking-thank-you.html`
   - `therapair-widget/.htaccess`
4. Sets correct permissions (644 for files, 755 for directories)
5. Verifies deployment success

**Deployment Configuration:**
```bash
DEPLOY_USER="u549396201"
DEPLOY_HOST="45.87.81.159"
DEPLOY_PORT="65002"
DEPLOY_PATH="/home/u549396201/domains/unisonmentalhealth.com/public_html/therapair-widget"
```

### Manual Deployment (Fallback)

If automated script fails:
1. Connect via SFTP (port 65002)
2. Navigate to `/public_html/therapair-widget/`
3. Upload changed files
4. Set permissions: `chmod 644 index.html submit-booking.php`
5. Verify: Visit https://unisonmentalhealth.com/find-a-therapist-who-is-right-for-you/

### Deployment Checklist
- [ ] Test locally (open `src/therapair-standalone.html`)
- [ ] Verify quiz logic works
- [ ] Check therapist images load
- [ ] Test booking form submission
- [ ] Run `./deploy-widget-only.sh`
- [ ] Hard refresh production URL (Cmd+Shift+R)
- [ ] Complete quiz on production
- [ ] Submit booking
- [ ] Verify admin email received
- [ ] Verify user confirmation received

---

## 🐛 Troubleshooting

### Issue: Widget shows old version after deployment
**Cause:** Browser caching  
**Solution:**
1. Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
2. Clear browser cache
3. Use Comet browser (better cache handling)
4. Check `.htaccess` cache headers are present

### Issue: Images not loading
**Cause:** Incorrect paths or missing files  
**Solution:**
1. Verify images exist in `therapair-widget/images/`
2. Check permissions: `chmod 644 *.jpeg`
3. Confirm absolute paths in `index.html`:
   ```javascript
   src="${protocol}//${hostname}/therapair-widget/images/${filename}"
   ```

### Issue: Emails not being received
**Cause:** PHP mail() delivery issues  
**Solution:**
1. Check server logs: `/error_log` on Hostinger
2. Verify email headers in `submit-booking.php`
3. Check spam folder
4. Test with different email provider (Gmail vs Outlook)
5. Future: Migrate to SendGrid for better deliverability

### Issue: Booking form modal won't scroll
**Cause:** Incorrect overflow settings  
**Solution:**
- Verify overlay has `overflow-y: auto`
- Modal has `max-height: 90vh` and `overflow-y: auto`
- Background scroll is disabled with `body { overflow: hidden; }`

---

## 🧪 Testing

### Manual Testing Checklist

**Quiz Flow:**
- [ ] All 9 questions display correctly
- [ ] Progress indicator updates (1 of 9, 2 of 9...)
- [ ] Multi-select questions allow multiple selections
- [ ] Free text fields accept input
- [ ] Can navigate back to previous questions

**Matching:**
- [ ] Results display after final question
- [ ] Therapist images load correctly
- [ ] All specialties show (no "+X more")
- [ ] Skill pills are compact and readable
- [ ] Only "Book Now" button visible

**Booking:**
- [ ] Modal opens when "Book Now" clicked
- [ ] Preferences summary is pre-filled
- [ ] Form validates required fields
- [ ] Modal scrolls properly (not background)
- [ ] Submission shows loading state
- [ ] Redirects to thank-you page

**Emails:**
- [ ] Admin receives notification
- [ ] User receives confirmation
- [ ] Emails include all form data
- [ ] Emails render correctly on mobile

---

## 🔐 Security

### Current Measures
- ✅ Input sanitization (`htmlspecialchars`, `trim`)
- ✅ Email validation
- ✅ HTTPS enforcement
- ✅ No sensitive data stored client-side
- ✅ PHP injection prevention

### Future Improvements
- [ ] Add CSRF tokens
- [ ] Implement rate limiting
- [ ] Add reCAPTCHA v3
- [ ] Migrate to SendGrid (better auth)
- [ ] Add session management

---

## 📈 Performance

### Current Metrics
- **Load Time:** ~400ms
- **Time to Interactive:** ~800ms
- **Page Weight:** ~180KB (with images)
- **Lighthouse Score:** 92+ (Performance)

### Optimizations
- No JavaScript frameworks (zero bundle overhead)
- Lazy loading images (`loading="lazy"`)
- Compressed JPEG images (80% quality)
- Cache control headers (`.htaccess`)
- Minimal external dependencies

---

## 🗺️ Roadmap

**Current: MVP (Q4 2025)** ✅
- [x] 9-question matching quiz
- [x] 8 therapists in database
- [x] Booking form with email notifications
- [x] Deployed on Unison website

**Phase 1: Validation (Q1-Q2 2026)**
- [ ] User testing (50+ completions)
- [ ] Match quality tracking
- [ ] A/B test quiz questions
- [ ] Improve email deliverability (SendGrid)

**Phase 2: Multi-Tenant (Q2-Q3 2026)**
- [ ] Database-driven therapist data
- [ ] Multi-clinic support
- [ ] Admin dashboard for clinics
- [ ] White-label customization

**See full roadmap:** [Main project docs](../therapair-landing-page/docs/planning/PRODUCT-ROADMAP.md)

---

## 🤝 Contributing

### For Developers

**Making Changes:**
1. Edit `therapair-widget/index.html` (production file)
2. Test locally by opening in browser
3. Update cache-bust comment:
   ```html
   <!-- Cache bust: YYYY-MM-DD-HH:MM-DESCRIPTION -->
   ```
4. Commit to Git:
   ```bash
   git add therapair-widget/index.html
   git commit -m "fix: description"
   git push origin main
   ```
5. Deploy:
   ```bash
   ./deploy-widget-only.sh
   ```
6. Test on production with hard refresh

**Coding Standards:**
- Use vanilla JavaScript (no frameworks)
- Keep all code in single HTML file (for now)
- Comment complex logic
- Use semantic HTML
- Follow existing naming conventions

---

## 📞 Support

**Technical Issues:**
- Review `WIDGET-DEPLOYMENT-GUIDE.md`
- Check server logs on Hostinger
- Email: tino@unisoncounselling.com

**Partnership Inquiries:**
- Email: tino@unisoncounselling.com
- Main site: https://therapair.com.au

---

## 🙏 Acknowledgments

- **Unison Mental Health** - First partner, hosting the demo
- **Therapists** - Nicki, Adam, Natasha, Genevieve, Emma, Michael, Meg, Joe
- **Users** - Early testers providing feedback

---

## 📜 License

Proprietary - All Rights Reserved  
© 2025 Therapair

---

*Built with precision and care by the Therapair team*  
*Last Updated: October 10, 2025*
