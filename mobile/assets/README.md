# Assets

This directory contains the app's static assets.

## Required Assets

Before building the app, you need to add the following image assets:

### App Icons
- `icon.png` - 1024x1024 PNG app icon (no transparency for iOS)
- `adaptive-icon.png` - 1024x1024 PNG foreground for Android adaptive icons
- `favicon.png` - 48x48 PNG favicon for web

### Splash Screen
- `splash.png` - 1284x2778 PNG splash screen image

### Notifications
- `notification-icon.png` - 96x96 PNG notification icon (Android)

## Generating Assets

You can use Expo's asset generation tools:

```bash
npx expo-doctor
```

Or create these manually using design tools like Figma, Sketch, or Adobe XD.

## Recommended Design

For the Euphoria Quest Forge brand:
- Primary color: #8b5cf6 (Purple)
- Background: #1a1625 (Dark purple)
- Icon: A trending up arrow or chart symbol
