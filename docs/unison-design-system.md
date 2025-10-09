# Therapair Design System

## Typography
- Font family: Google Open Sans
- Usage:
  - Headings: 700
  - Body: 400/500
  - Buttons: 600

Embed
```html
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --font-sans: 'Open Sans', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  }
  body { font-family: var(--font-sans); color: #202020; }
</style>
```

## Colors
- Background: #D0B2E6
- Text: #202020
- Primary (Buttons, Progress): #9B74B7
- Neutrals (suggested):
  - White: #ffffff
  - Border: #EAE6EE

CSS tokens
```css
:root {
  --color-bg: #D0B2E6;
  --color-text: #202020;
  --color-primary: #9B74B7;
  --color-border: #EAE6EE;
}
```

## Typebot Theme
```json
{
  "theme": {
    "general": {
      "background": { "type": "Color", "content": "#D0B2E6" },
      "progressBar": { "isEnabled": true, "color": "#9B74B7" }
    },
    "chat": {
      "guestBubbles": { "backgroundColor": "#9B74B7" },
      "buttons": { "backgroundColor": "#9B74B7" }
    }
  }
}
```

## Buttons
```css
.button {
  background:#9B74B7; color:#fff; border:none; border-radius:10px;
  padding:12px 16px; font-weight:600; font-family: var(--font-sans);
}
.button:hover { filter: brightness(0.95); }
```

## Card Pattern (in-bot)
```html
<div style="display:flex;gap:12px;padding:12px;background:#fff;border:1px solid #EAE6EE;border-radius:12px;box-shadow:0 1px 2px rgba(0,0,0,0.04);">
  <img src="[photo]" alt="[Name]" style="width:56px;height:56px;border-radius:8px;object-fit:cover;">
  <div style="display:flex;flex-direction:column;gap:6px;">
    <div style="font-weight:700;color:#202020;font-family:'Open Sans',sans-serif;">[Name]</div>
    <div style="font-size:14px;color:#4A4A4A;">[One-line fit summary]</div>
    <div style="font-size:12px;color:#6B6B6B;">[Location • Availability]</div>
  </div>
</div>
```
