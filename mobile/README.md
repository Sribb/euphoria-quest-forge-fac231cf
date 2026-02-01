# Euphoria Quest Forge - Mobile App

A production-ready, cross-platform mobile application for investment education, built with Expo (React Native).

## Features

- **Authentication** - Email/password login with Supabase Auth
- **Placement Quiz** - Personalized learning path based on skill assessment
- **Dashboard** - XP/leveling system, portfolio overview, quick stats
- **Learning** - Interactive lessons with 3-phase system (Learn, Practice, Test)
- **Trading** - Simulated stock trading with real-time mock prices
- **Games** - 5+ interactive financial education games
- **Profile** - Settings, achievements, theme customization

## Tech Stack

- **Framework**: Expo SDK 52 + React Native
- **Navigation**: Expo Router (file-based)
- **State Management**: TanStack React Query
- **Backend**: Supabase (Auth, PostgreSQL, Realtime)
- **UI**: Custom components with React Native
- **Animations**: React Native Reanimated
- **Charts**: React Native SVG Charts

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (for testing)
- EAS CLI (for building): `npm install -g eas-cli`

### Installation

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Add your Supabase credentials to .env
# EXPO_PUBLIC_SUPABASE_URL=your_url
# EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### Development

```bash
# Start the development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

### Testing on Device

1. Install **Expo Go** from App Store (iOS) or Play Store (Android)
2. Run `npm start` in the terminal
3. Scan the QR code with Expo Go (Android) or Camera app (iOS)

## Project Structure

```
mobile/
├── app/                    # Expo Router pages
│   ├── _layout.tsx         # Root layout
│   ├── index.tsx           # Entry/redirect
│   ├── (auth)/             # Auth screens
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (onboarding)/       # Onboarding flow
│   │   └── quiz.tsx
│   └── (app)/              # Main app tabs
│       ├── _layout.tsx     # Tab navigator
│       ├── dashboard.tsx
│       ├── learn.tsx
│       ├── trade.tsx
│       ├── games.tsx
│       ├── profile.tsx
│       ├── lesson/[id].tsx
│       └── stock/[symbol].tsx
├── src/
│   ├── components/         # Reusable UI components
│   │   └── ui/             # Core UI components
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # Supabase client
│   ├── lib/                # Utilities & services
│   └── constants/          # Theme & config
├── assets/                 # Images & fonts
├── app.json                # Expo config
├── eas.json                # EAS Build config
└── package.json
```

## Building for Production

### Setup EAS Build

```bash
# Login to Expo
eas login

# Configure the project
eas build:configure
```

### Build for iOS

```bash
# Development build (for testing)
eas build --platform ios --profile development

# Production build (for App Store)
eas build --platform ios --profile production
```

### Build for Android

```bash
# Development APK (for testing)
eas build --platform android --profile development

# Production AAB (for Play Store)
eas build --platform android --profile production
```

### Build Both Platforms

```bash
eas build --platform all --profile production
```

## Submitting to App Stores

### Apple App Store

1. **Prerequisites**:
   - Apple Developer account ($99/year)
   - App Store Connect setup
   - App ID and provisioning profiles

2. **Build & Submit**:
   ```bash
   eas build --platform ios --profile production
   eas submit --platform ios
   ```

3. **App Store Connect**:
   - Add app metadata, screenshots
   - Set pricing and availability
   - Submit for review

### Google Play Store

1. **Prerequisites**:
   - Google Play Developer account ($25 one-time)
   - Service account key for automated uploads

2. **Build & Submit**:
   ```bash
   eas build --platform android --profile production
   eas submit --platform android
   ```

3. **Play Console**:
   - Complete store listing
   - Add screenshots for all form factors
   - Roll out to production

## Configuration

### Environment Variables

Create a `.env` file with:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### App Configuration

Edit `app.json` to customize:
- App name and slug
- Bundle identifier (iOS) and package name (Android)
- Version numbers
- Splash screen and icon
- Permissions

### EAS Configuration

Edit `eas.json` to configure:
- Build profiles (development, preview, production)
- Environment variables per profile
- Submit settings for stores

## Customization

### Theme Colors

Edit `src/constants/theme.ts` to customize:
- Color palette
- Spacing scale
- Font sizes
- Border radius
- Shadows

### Adding Features

1. Create a new screen in `app/(app)/`
2. Add navigation in `app/(app)/_layout.tsx`
3. Create hooks in `src/hooks/`
4. Add UI components in `src/components/`

## Troubleshooting

### Common Issues

1. **Metro bundler stuck**:
   ```bash
   npx expo start --clear
   ```

2. **Pod install fails (iOS)**:
   ```bash
   cd ios && pod install --repo-update
   ```

3. **Android build fails**:
   - Ensure Android SDK is installed
   - Check JAVA_HOME is set correctly

4. **Supabase connection issues**:
   - Verify environment variables are set
   - Check Supabase project status

### Getting Help

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [Supabase Documentation](https://supabase.com/docs)

## License

This project is part of Euphoria Quest Forge.
