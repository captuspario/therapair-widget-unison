# Therapair Widget - Deployment Guide

**Last Updated**: 2025-10-10  
**Target**: Unison Mental Health Server

---

## 📦 What Needs to Be Deployed

### **Updated Files**:
1. ✅ `therapair-widget/index.html` - Widget with updated booking flow
2. ✅ `therapair-widget/submit-booking.php` - NEW PHP email handler
3. ✅ `therapair-widget/booking-thank-you.html` - NEW thank-you page
4. ✅ `therapair-widget/images/` - All therapist photos (existing)

---

## 🚀 Deployment Steps

### **Option 1: Manual Upload (Current Method)**

1. **Connect to Unison Server**
   - Use FTP/SFTP client (FileZilla, Cyberduck, etc.)
   - Or use Unison's file manager/cPanel

2. **Upload Files**
   ```
   Local: /Users/tino/Projects/therapair-widget-unison/therapair-widget/
   Remote: /public_html/therapair-widget/
   
   Upload:
   - index.html (REPLACE existing)
   - submit-booking.php (NEW)
   - booking-thank-you.html (NEW)
   - images/ (keep existing)
   ```

3. **Set Permissions**
   ```
   submit-booking.php: 644 (readable, executable by server)
   booking-thank-you.html: 644
   index.html: 644
   ```

4. **Test**
   - Visit: https://unisonmentalhealth.com/find-a-therapist-who-is-right-for-you/
   - Complete quiz
   - Submit booking
   - Verify redirect to thank-you page
   - Check email received

---

### **Option 2: SSH/Git Deployment (Recommended Future)**

If Unison server has SSH access:

```bash
# On Unison server
cd /path/to/public_html/therapair-widget/
git pull origin main

# Or create deployment script
./deploy-widget-to-unison.sh
```

---

## ✅ Pre-Deployment Checklist

- [ ] All files committed to Git
- [ ] Email addresses verified (tino@unisonmentalhealth.com)
- [ ] Thank-you page tested locally
- [ ] PHP syntax checked (`php -l submit-booking.php`)
- [ ] Backup existing widget files
- [ ] Test email deliverability

---

## 🧪 Testing After Deployment

### **1. Visual Test**
- [ ] Visit widget page
- [ ] Start quiz
- [ ] Complete all questions
- [ ] Verify therapist cards show only "Book Now" (no "View Profile")
- [ ] Check card layout looks good

### **2. Booking Flow Test**
- [ ] Click "Book Now" on a therapist
- [ ] Fill out booking form
- [ ] Submit
- [ ] Verify redirect to booking-thank-you.html
- [ ] Check thank-you page displays correctly

### **3. Email Test**
- [ ] Check tino@unisonmentalhealth.com for admin notification
- [ ] Check test email address for user confirmation
- [ ] Verify both emails formatted correctly
- [ ] Check emails not in spam

### **4. Error Handling Test**
- [ ] Try submitting with empty fields (should show error)
- [ ] Try invalid email format (should show error)
- [ ] Verify error messages display properly

---

## 🔧 Configuration

### **Email Settings** (in submit-booking.php)

```php
$ADMIN_EMAIL = 'tino@unisonmentalhealth.com';
$FROM_EMAIL = 'bookings@unisonmentalhealth.com';
$FROM_NAME = 'Unison Mental Health';
```

### **Future: Add config.php**

When adding AI personalization or Notion sync:

```php
<?php
// Create: therapair-widget/config.php

define('ADMIN_EMAIL', 'tino@unisonmentalhealth.com');
define('FROM_EMAIL', 'bookings@unisonmentalhealth.com');
define('FROM_NAME', 'Unison Mental Health');

// OpenAI (when ready)
define('OPENAI_API_KEY', 'sk-proj-xxx');
define('USE_AI_PERSONALIZATION', true);

// Notion (when ready)
define('NOTION_TOKEN', 'ntn_xxx');
define('NOTION_DATABASE_ID', '2875c25944da80c0b14afbbdf2510bb0'); // Same as landing page
define('USE_NOTION_SYNC', true);

define('WEBSITE_URL', 'https://unisonmentalhealth.com');
?>
```

---

## 📊 What Changed

### **Before**:
```
User completes quiz → Clicks "Book Now" → Fills form → 
FormSubmit.co sends email → Generic autoresponse → 
Modal shows success message
```

### **After**:
```
User completes quiz → Clicks "Book Now" (no View Profile) → 
Fills form → PHP handler processes → 
Admin email sent → User confirmation sent → 
Redirects to professional thank-you page
```

### **Benefits**:
- ✅ Cleaner UI (removed View Profile button)
- ✅ Professional thank-you page
- ✅ Better email control
- ✅ Consistent with landing page
- ✅ Ready for AI/Notion integration
- ✅ Better user experience

---

## 🔮 Future Enhancements (Already Prepared For)

### **Phase 1: AI Personalization**
- Add OpenAI API key to config
- Enable `USE_AI_PERSONALIZATION`
- Emails become personalized based on preferences
- Similar to landing page system

### **Phase 2: Notion Integration**
- Add Notion credentials to config
- Create `notion-booking-sync.php`
- Bookings automatically sync to shared database
- Track booking → session completion funnel

### **Phase 3: Shared Modules**
- Use shared email handler from landing page
- Use shared Notion client
- Unified codebase across projects

---

## 🆘 Troubleshooting

### **Emails Not Sending**
1. Check server PHP mail() is configured
2. Verify email addresses are correct
3. Check spam folders
4. Review PHP error logs

### **Thank-You Page Not Loading**
1. Verify file uploaded to correct path
2. Check file permissions (644)
3. Verify redirect URL in submit-booking.php

### **Form Submission Fails**
1. Check PHP syntax: `php -l submit-booking.php`
2. Review browser console for JavaScript errors
3. Check network tab for failed requests
4. Verify server allows POST requests

---

## 📞 Support

**Technical Issues**: See WIDGET-DOCUMENTATION.md  
**Email Issues**: See email-deliverability-guide.md (landing page project)  
**Deployment Help**: Contact Unison server admin

---

## ✅ Deployment Verification

After deployment, verify:
- [ ] Widget loads at https://unisonmentalhealth.com/find-a-therapist-who-is-right-for-you/
- [ ] Quiz works correctly
- [ ] Therapist cards show only "Book Now" button
- [ ] Booking form opens
- [ ] Form submits successfully
- [ ] Thank-you page displays
- [ ] Admin email received
- [ ] User confirmation email received

**When all checked, deployment is complete!** ✅

---

**Last Updated**: 2025-10-10  
**Next Review**: After first production booking

