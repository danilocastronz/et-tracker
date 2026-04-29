# ET Tracker 👽

A comprehensive mobile app for tracking and analyzing extraterrestrial sighting reports. ET Tracker combines location-based mapping, data persistence, and a polished native UI to create a professional tool for UFO/alien enthusiast researchers and investigators.

## About ET Tracker

ET Tracker is a **reference implementation** for building sophisticated React Native/Expo applications. The app demonstrates industry best practices for:

- **Multi-platform mobile development** (iOS, Android, Web)
- **Responsive UI with dark/light/system theme support**
- **Real-time geolocation and map visualization**
- **Local data persistence and offline support**
- **Native haptic feedback and animations**
- **Professional UI/UX patterns**

The app is designed to be **followed by The Expo Files ebook**, which provides deep-dive explanations of the patterns, architecture, and techniques used throughout the codebase. This README provides quick context; the ebook provides comprehensive educational content.

## Features

- 🗺️ **Interactive Map View** — Visualize sightings on a map with real-time location tracking
- 📊 **Threat Assessment** — Categorize sightings by threat level (low, medium, high, critical)
- 🌙 **Dark/Light/System Themes** — Full theme support with seamless switching
- 💾 **Local Data Storage** — All sightings stored locally on device via AsyncStorage
- 🔔 **Notifications & Reminders** — Background alerts for new sighting reports
- 📱 **Responsive Design** — Works beautifully on phones, tablets, and web
- ⌚ **Haptic Feedback** — Native vibration feedback for all interactions
- 🎯 **Location Permissions** — Handles location requests with proper UX patterns
- 📸 **Photo Attachments** — Users can photograph and store evidence

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator or Android Emulator (or Expo Go on physical device)

### Installation

1. **Clone and install**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   ```

3. **Open in your preferred environment**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Press `w` for Web
   - Scan QR code with Expo Go app on physical device

## Technologies Used

### Core Framework
- **[Expo SDK 54](https://docs.expo.dev/)** — Build, deploy, and scale universal React Native apps
- **[React Native](https://reactnative.dev/)** — Cross-platform native UI development
- **[React 19](https://react.dev/)** — Modern UI with hooks and composition

### Navigation & Routing
- **[Expo Router](https://docs.expo.dev/router/introduction/)** — File-based routing (like Next.js but for native)
- **[React Navigation](https://reactnavigation.org/)** — Stack, tab, and drawer navigation primitives

### Styling & UI
- **[NativeWind](https://www.nativewind.dev/)** — Tailwind CSS for React Native with dark mode support
- **[Tailwind CSS v3](https://tailwindcss.com/)** — Utility-first CSS framework
- **[@expo-google-fonts/inter](https://docs.expo.dev/guides/using-custom-fonts/)** — Professional Inter typeface

### Data & Storage
- **[@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)** — Local key-value storage (replaces SQLite for simplicity)
- **[expo-secure-store](https://docs.expo.dev/sdk/securestore/)** — Encrypted credential storage

### Location & Maps
- **[expo-location](https://docs.expo.dev/sdk/location/)** — GPS and location services
- **[react-native-maps](https://github.com/react-native-maps/react-native-maps)** — Native map views
- **[expo-task-manager](https://docs.expo.dev/sdk/task-manager/)** — Background location tracking

### Interactions & Feedback
- **[expo-haptics](https://docs.expo.dev/sdk/haptics/)** — Vibration and haptic feedback (impact, notification patterns)
- **[expo-image-picker](https://docs.expo.dev/sdk/image-picker/)** — Camera and photo library access
- **[react-native-reanimated](https://docs.reanimated2.com/)** — Smooth 60fps animations
- **[@shopify/flash-list](https://shopify.github.io/flash-list/)** — High-performance virtualized lists

### Infrastructure
- **[expo-notifications](https://docs.expo.dev/sdk/notifications/)** — Local and push notifications
- **[expo-file-system](https://docs.expo.dev/sdk/filesystem/)** — File and directory management

### Development & Testing

- **TypeScript** — Static type safety
- **ESLint** — Code quality and consistency with Prettier integration
- **Prettier** — Code formatting with import sorting
- **Jest** — Unit testing framework
- **React Native Testing Library** — Component and hook testing utilities
- **Expo CLI** — Development, building, and deployment

## Key Concepts Explained

### File-Based Routing with Expo Router
The app uses Expo Router for navigation, which mirrors Next.js patterns in React Native:
- `app/(tabs)/_layout.tsx` — Tab navigation container
- `app/(tabs)/index.tsx` — Home/HQ screen (tab route)
- `app/(modals)/report-sighting.tsx` — Modal over tabs
- `app/+not-found.tsx` — 404 fallback

**Learn more:** [Expo Router Documentation](https://docs.expo.dev/router/introduction/)

### Dark Mode with NativeWind
The app supports light/dark/system themes using:
- **Appearance API**: `Appearance.setColorScheme()` to override system preference
- **Dark Mode Prefix**: NativeWind `dark:` utilities automatically respond to system/user theme
- **Tailwind Config**: Dual color tokens (`bg-background dark:bg-background-dark`)
- **Theme Context**: Central state management for theme preference and colors

**Learn more:** [NativeWind v4 Dark Mode](https://www.nativewind.dev/dark-mode)

### Local Data Persistence
Instead of a complex database, the app uses AsyncStorage:
- Simple JSON serialization for sightings array
- Key: `sightings_v1`
- All operations are async (safe for React 18)
- Data survives app restarts
- Reset to mock data in Dev screen (`__DEV__` only)

**Dev Tips:** Tap the "Dev" tab (visible only in development) to reset data to 20 mock sightings.

**Learn more:** [AsyncStorage Best Practices](https://react-native-async-storage.github.io/async-storage/docs/usage/)

### Haptic Feedback
Haptic feedback provides tactile confirmation for user interactions:
- **Medium Impact**: Theme selection buttons
- **Heavy Impact**: Dev screen action buttons (before confirmation dialog)
- **Success Notification**: After confirming data reset
- **Warning Notification**: After confirming data clear
- **Light Impact**: Tab bar navigation

Examples in codebase:
- `app/(tabs)/profile.tsx` — Theme selector haptics
- `app/(tabs)/dev.tsx` — Action confirmation haptics
- `components/haptic-tab.tsx` — Tab navigation haptics

**Learn more:** [Expo Haptics API](https://docs.expo.dev/sdk/haptics/)

### Responsive Design with Tailwind
All UI uses Tailwind CSS classes:
- Mobile-first responsive design
- Platform-specific utilities (iOS/Android differences)
- Safe area insets with `SafeAreaView`
- Flex layouts for responsive spacing

**Tip:** View source code to see Tailwind class usage patterns throughout components.

## Project Structure

```
├── app/                          # Expo Router file-based routes
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── index.tsx             # HQ home screen
│   │   ├── sightings.tsx         # Map + list view
│   │   ├── field-guide.tsx       # Alien species catalog
│   │   ├── profile.tsx           # User profile + theme selector
│   │   ├── dev.tsx               # Dev tools (__DEV__ only)
│   │   └── _layout.tsx           # Tab navigation setup
│   ├── (modals)/                 # Modal route group
│   │   └── report-sighting.tsx   # Report new sighting modal
│   ├── sightings/[id].tsx        # Sighting detail page
│   ├── aliens/[species].tsx      # Species detail page
│   ├── _layout.tsx               # Root layout + providers
│   └── +not-found.tsx            # 404 fallback
├── components/                   # Reusable UI components
│   ├── ThemedText.tsx            # Theme-aware text
│   ├── ThemedView.tsx            # Theme-aware container
│   ├── SightingCard.tsx          # Sighting list card
│   ├── AlienCard.tsx             # Species card
│   ├── SightingMapCard.tsx       # Map overlay card
│   └── ...
├── context/                      # React Context providers
│   ├── ThemeContext.tsx          # Theme state + system preference handling
│   └── SightingsContext.tsx      # Sighting CRUD + reset
├── hooks/                        # Custom React hooks
│   ├── useSightingsDB.ts         # Sighting data access
│   ├── usePreferences.ts         # User preferences (theme, notifications, etc.)
│   ├── useNotifications.ts       # Notification setup
│   └── ...
├── lib/                          # Utilities and services
│   ├── storage.ts                # AsyncStorage CRUD layer
│   ├── preferences.ts            # Preference persistence
│   ├── notifications.ts          # Notification scheduling
│   └── ...
├── data/                         # Static/seed data
│   ├── sightings.ts              # 20 mock sighting reports
│   └── aliens.ts                 # 8 alien species data
├── constants/                    # App constants
│   ├── theme.ts                  # Light/dark color palettes
│   └── mapStyle.ts               # Dark map style config
├── utils/                        # Helper functions
│   ├── threatLevel.ts            # Threat level utilities
│   ├── formatDate.ts             # Date formatting
│   └── ...
├── types/                        # TypeScript type definitions
│   └── index.ts                  # App-wide types (Sighting, ColorScheme, etc.)
├── tailwind.config.js            # Tailwind CSS configuration
├── nativewind.config.ts          # NativeWind configuration
├── app.json                      # Expo app config
└── package.json                  # Dependencies
```

## Development Workflow

### Available Scripts

```bash
# Start dev server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web

# Lint code
npm run lint

# Code formatting
npm run format          # Format all files with Prettier
npm run format:check    # Check formatting without writing

# Type checking
npm run typecheck       # Run TypeScript type check

# Testing
npm test                # Run tests once
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
```

### Theme Development

To test theme switching:
1. Open the Profile tab
2. Tap "Light", "System", or "Dark" buttons
3. Watch NativeWind `dark:` prefix styles update instantly
4. Check that all colors update consistently

### Data Development

To reset app data during development:
1. Open the Dev tab (only visible in `__DEV__` mode)
2. Tap "Reset to Mock Data" to load 20 sample sightings
3. Tap "Clear All Sightings" to start with an empty database

### Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```bash
# App Environment
EXPO_PUBLIC_APP_ENV=development

# Sentry Error Reporting (optional)
# EXPO_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# API Configuration (if using external APIs)
# EXPO_PUBLIC_API_URL=https://api.example.com
```

**Note:** Only variables prefixed with `EXPO_PUBLIC_` are accessible at runtime. Never commit `.env` files with secrets.

### Testing

The project includes comprehensive unit testing with Jest and React Native Testing Library.

```bash
# Run tests once
npm test

# Run tests in watch mode (re-run on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Test Files:** Tests are located in the `__tests__` directory, mirroring the source structure.

**Example Tests:** See `__tests__/components/`, `__tests__/hooks/`, and `__tests__/context/` for testing patterns.

**Learn More:** See [TESTING.md](./TESTING.md) for comprehensive testing documentation.

## Community & Support

Have questions about how ET Tracker works? Want to discuss Expo patterns?

### Ask Questions
- 📖 **[The Expo Files Ebook](https://www.example.com/)** — Comprehensive educational companion to this project
- 💬 **[GitHub Discussions](https://github.com/yourusername/et-tracker/discussions)** — Ask questions, share feedback, and discuss patterns
- 🐛 **[GitHub Issues](https://github.com/yourusername/et-tracker/issues)** — Report bugs or request features
- 💬 **[Expo Discord Community](https://chat.expo.dev)** — Chat with Expo developers and get help

### Resources
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Community](https://reactnative.dev/community/overview)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

This project is part of The Expo Files educational series. See LICENSE file for details.

## Built with Expo

This app showcases the power and flexibility of Expo for building professional mobile applications. From development to deployment, Expo provides everything you need to build once and deploy everywhere.

[Learn more about Expo →](https://expo.dev)
