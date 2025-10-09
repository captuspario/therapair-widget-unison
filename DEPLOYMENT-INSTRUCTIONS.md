# Therapair Widget - Production Deployment Instructions

## 📁 Upload to Production Server

### Step 1: Upload the Widget Folder
1. Upload the entire `/therapair-widget/` folder to the public HTML directory of **unisonmentalhealth.com**
2. The final structure should be:
   ```
   public_html/
   └── therapair-widget/
       ├── index.html
       └── images/
           ├── adam.jpeg
           ├── emma.jpeg
           ├── genevieve.jpeg
           ├── joe.jpeg
           ├── meg.jpeg
           ├── michael.jpeg
           ├── natasha.jpeg
           └── nicki.jpeg
   ```

### Step 2: Verify Upload
- Test direct access: `https://unisonmentalhealth.com/therapair-widget/`
- Ensure images load: `https://unisonmentalhealth.com/therapair-widget/images/adam.jpeg`

## 🖼️ Embed in Elementor Page

### Step 3: Add HTML Widget in Elementor
1. In Elementor, add an **HTML** widget to your page
2. Paste this iframe code:

```html
<div style="width: 100%; max-width: 1200px; margin: 0 auto;">
    <iframe
        src="https://unisonmentalhealth.com/therapair-widget/"
        style="width: 100%; height: 1000px; border: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);"
        title="Find Your Therapist Matching Tool"
        allow="fullscreen">
    </iframe>
</div>
```

### Step 4: Responsive Height Adjustment (Optional)
For better mobile experience, you can use this responsive iframe:

```html
<div style="width: 100%; max-width: 1200px; margin: 0 auto;">
    <iframe
        src="https://unisonmentalhealth.com/therapair-widget/"
        style="width: 100%; height: 1000px; border: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);"
        title="Find Your Therapist Matching Tool"
        allow="fullscreen"
        onload="this.style.height = this.contentWindow.document.body.scrollHeight + 50 + 'px';">
    </iframe>
</div>

<style>
@media (max-width: 768px) {
    iframe[title="Find Your Therapist Matching Tool"] {
        height: 1200px !important;
    }
}
</style>
```

## ✅ Features Included

- **Smart Image Loading**: Automatically detects domain and loads images from correct paths
- **Perfect Spacing**: 54-73px spacing between specialty pills and buttons
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Accessibility**: WCAG AA compliant with proper ARIA labels
- **Professional UI**: Consistent with Unison Mental Health branding
- **Iframe Optimized**: No headers/footers, optimized for embedding

## 🔧 Technical Details

- **Widget URL**: `https://unisonmentalhealth.com/therapair-widget/`
- **Image Path**: Auto-detected as `https://unisonmentalhealth.com/therapair-widget/images/`
- **Card Height**: 820px for optimal spacing
- **Max Therapists**: Limited to 3 for optimal display
- **Fallback Images**: Gradient placeholders with therapist initials

## 🐛 Troubleshooting Image Loading

If images are not loading when deployed online:

1. **Check Browser Console**: Open browser dev tools and check console for debug messages showing image path generation
2. **Verify Image URLs**: The console will show which paths are being generated
3. **Test Direct Image Access**: Try accessing an image directly: `https://unisonmentalhealth.com/therapair-widget/images/adam.jpeg`
4. **Check Domain Detection**: Console logs will show hostname detection results

### Debug Information
The current version includes console logging to help diagnose image path issues. Look for messages like:
```
Image path debug: {filename: "adam.jpg", hostname: "unisonmentalhealth.com", protocol: "https:", href: "..."}
Using production path: https://unisonmentalhealth.com/therapair-widget/images/adam.jpeg
```

## 📞 Support

If you encounter any issues:
1. Verify all files uploaded correctly
2. Check browser console for any 404 errors
3. Test on different devices and browsers
4. Ensure HTTPS is working properly

The widget is now production-ready and optimized for iframe embedding! 🎉