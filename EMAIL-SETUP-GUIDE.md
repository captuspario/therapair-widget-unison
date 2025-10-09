# Email Setup Guide for Therapair Widget

## 🚨 Current Issue
The booking form currently only logs to console and shows a fake "success" message. No actual emails are sent to `contact@unisonmentalhealth.com`.

## 🏆 Recommended Solution: Formspree

### Why Formspree?
- ✅ **No server setup required** - works with static sites
- ✅ **Professional email delivery** to any email address
- ✅ **Built-in confirmation emails** for users
- ✅ **Spam protection** included
- ✅ **Free tier**: 50 emails/month (perfect for testing)
- ✅ **Paid tier**: $10/month for 1000 emails
- ✅ **GDPR compliant** and secure

### Setup Steps:

#### 1. Create Formspree Account
1. Go to [formspree.io](https://formspree.io)
2. Sign up with your email
3. Create a new form
4. Set target email to: `contact@unisonmentalhealth.com`

#### 2. Get Your Form Endpoint
After creating the form, you'll get an endpoint like:
```
https://formspree.io/f/xpzvnvqk
```

#### 3. Update the Booking Form
Replace the current `handleBookingSubmission` function in your widget with this:

```javascript
function handleBookingSubmission(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData();

    // Add form fields
    formData.append('name', document.getElementById('fullName').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('phone', document.getElementById('phone').value);
    formData.append('therapist', userBookingData.selectedTherapist);
    formData.append('specialty', userBookingData.selectedSpecialty);
    formData.append('preferences', JSON.stringify(userBookingData.userResponses));
    formData.append('timestamp', new Date().toISOString());

    // Send to Formspree
    fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            showBookingSuccess();
        } else {
            showBookingError();
        }
    })
    .catch(error => {
        console.error('Form submission error:', error);
        showBookingError();
    });
}

function showBookingError() {
    const modal = document.getElementById('booking-modal');
    modal.innerHTML = \`
        <div style="background: white; padding: 2rem; border-radius: 16px; max-width: 500px; margin: 2rem; position: relative;">
            <div style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
                <h2 style="color: #dc2626; margin-bottom: 1rem; font-size: 1.5rem;">Booking Request Failed</h2>
                <p style="color: #6b7280; margin-bottom: 2rem; line-height: 1.6;">
                    There was an issue sending your booking request. Please try again or contact us directly.
                </p>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button onclick="closeBookingForm()" style="padding: 0.875rem 2rem; background: #dc2626; color: white; border: none; border-radius: 12px; font-weight: 600; cursor: pointer;">
                        Close
                    </button>
                    <a href="mailto:contact@unisonmentalhealth.com" style="padding: 0.875rem 2rem; background: #9B74B7; color: white; border: none; border-radius: 12px; font-weight: 600; text-decoration: none; display: inline-block;">
                        Email Direct
                    </a>
                </div>
            </div>
        </div>
    \`;
}
```

#### 4. Configure Auto-Reply Email
In your Formspree dashboard:
1. Go to form settings
2. Enable "Auto-Reply"
3. Set up a confirmation email template:

```
Subject: Booking Request Received - Unison Mental Health

Hi {{name}},

Thank you for your interest in therapy with {{therapist}}!

We've received your booking request and will get back to you within 24 hours to confirm your appointment and discuss next steps.

Your request details:
- Therapist: {{therapist}}
- Specialty: {{specialty}}
- Contact: {{email}} / {{phone}}

If you have any urgent questions, please don't hesitate to contact us directly at contact@unisonmentalhealth.com.

Best regards,
Unison Mental Health Team
```

## 🔄 Alternative Solutions

### Option 2: EmailJS
- **Setup**: More complex, requires API keys
- **Cost**: Free 200 emails/month
- **Pro**: Works purely client-side
- **Con**: More complex setup

### Option 3: Server-Side Solution
- **Setup**: Requires PHP/Node.js server
- **Cost**: Server hosting
- **Pro**: Full control
- **Con**: More maintenance

### Option 4: WordPress Contact Form 7 (If using WordPress)
- **Setup**: Plugin installation
- **Cost**: Free
- **Pro**: Integrates with WordPress
- **Con**: Only works with WordPress

## 🚀 Quick Implementation

**Fastest path to working emails:**

1. **5 minutes**: Sign up for Formspree free account
2. **2 minutes**: Create form, get endpoint URL
3. **3 minutes**: Update the `handleBookingSubmission` function
4. **Upload** updated widget to your server
5. **Test** with a real booking

**Total time: ~10 minutes for fully working email system!**

## 📧 Email Template Recommendation

The emails sent to `contact@unisonmentalhealth.com` should include:

```
Subject: New Therapist Booking Request

New booking request received:

Client Information:
- Name: [Full Name]
- Email: [Email]
- Phone: [Phone]

Therapist Selection:
- Requested Therapist: [Therapist Name]
- Primary Specialty: [Specialty]

Client Preferences:
- Seeking therapy for: [Who]
- Therapy preference: [Online/In-person]
- Support type: [Support Type]
- Timing: [Timing Preference]
- Wait time: [Wait Preference]
- Gender preference: [Gender]
- Community: [Community Preferences]

Submitted: [Timestamp]

Please follow up within 24 hours.
```

## 🔒 Security & Compliance

- ✅ **GDPR Compliant**: Formspree handles data protection
- ✅ **Spam Protection**: Built-in reCAPTCHA
- ✅ **SSL Encrypted**: All data transmitted securely
- ✅ **No Database Required**: No sensitive data storage

Choose Formspree for the fastest, most reliable solution! 🎯