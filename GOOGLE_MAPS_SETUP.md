# Google Maps Setup Guide for Android

This guide will help you configure Google Maps for your React Native app on Android.

## Prerequisites

- A Google Cloud Platform account
- Your app already has `react-native-maps` installed
- Expo project (based on your configuration)

## Step 1: Get a Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps SDK for Android**
   - **Maps SDK for iOS** (if you want iOS support too)
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key (keep it secure!)
6. (Recommended) Restrict your API key:
   - Click on the API key to edit it
   - Under "Application restrictions", select "Android apps"
   - Add your app's package name and SHA-1 certificate fingerprint

## Step 2: Get Your SHA-1 Certificate Fingerprint

```bash
# Get your debug certificate
eas credentials
```

## Step 3: Configure Your Expo App

### Option A: Using app.config.js (Recommended for Expo)

Add your API key to `app.config.js`:

```javascript
export default {
  expo: {
    // ... other config
    android: {
      // ... other android config
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE',
        },
      },
    },
    ios: {
      // ... other ios config
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE',
      },
    },
  },
};
```

## Step 4: Store Your API Key Securely

### Create a `.env` file

```bash
GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### Add `.env` to `.gitignore`

```
.env
.env.local
```

### Install dotenv (if not already installed)

```bash
npm install dotenv
# or
yarn add dotenv
```

### Update app.config.js to use environment variable

```javascript
import 'dotenv/config';

export default {
  expo: {
    // ... config using process.env.GOOGLE_MAPS_API_KEY
  },
};
```

## Step 5: Rebuild Your App

After configuration, you need to rebuild:

### For Expo

```bash
# Clear cache and rebuild
npx expo prebuild --clean

# Build for Android
eas build --platform android --profile development
# or
npx expo run:android
```

### For Bare React Native

```bash
cd android && ./gradlew clean
cd ..
npx react-native run-android
```

## Step 6: Verify Setup

Your map should now render correctly. Check for:

- ✅ Map loads and displays
- ✅ Markers appear on the map
- ✅ Custom map styles apply
- ✅ User location works (if permissions granted)

## Troubleshooting

### Map shows blank/gray screen

- Verify API key is correct
- Ensure "Maps SDK for Android" is enabled in Google Cloud Console
- Check that your API key restrictions allow your app's package name
- Rebuild the app after adding the API key

### "Authorization failure" error

- Your SHA-1 certificate doesn't match the one registered in Google Cloud Console
- API key restrictions are too strict
- Try temporarily removing restrictions to test

### Map works in development but not production

- Make sure you've added the release SHA-1 certificate to Google Cloud Console
- Production builds use a different keystore than debug builds

## Package Name

Your package name can be found in:

- Expo: `app.json` or `app.config.js` under `expo.android.package`
- Bare RN: `android/app/build.gradle` under `applicationId`

Default Expo format: `com.yourcompany.yourappname`

## Cost Considerations

Google Maps API has a free tier with generous limits:

Default Expo format: `com.yourcompany.yourappname`

## Cost Considerations

Google Maps API has a free tier with generous limits:

- 28,000 map loads per month (free)
- After that, $7 per 1,000 loads

For most apps, you'll stay within the free tier.
