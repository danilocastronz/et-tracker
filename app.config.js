// Environment-specific app configuration
// Allows overriding settings based on EXPO_PUBLIC_APP_ENV or NODE_ENV
module.exports = () => {
  const env = process.env.EXPO_PUBLIC_APP_ENV || process.env.NODE_ENV || 'development';

  return {
    expo: {
      name: 'ET Tracker',
      slug: 'et-tracker',
      version: '1.0.0',
      orientation: 'portrait',
      icon: './assets/images/icon.png',
      scheme: 'ettracker',
      userInterfaceStyle: 'dark',
      newArchEnabled: true,
      backgroundColor: '#0A0A1A',
      ios: {
        supportsTablet: true,
        bundleIdentifier: 'com.ettracker.app',
        infoPlist: {
          NSLocationWhenInUseUsageDescription:
            'ET Tracker needs your location to pinpoint alien sighting coordinates.',
          NSLocationAlwaysAndWhenInUseUsageDescription:
            'ET Tracker needs background location for continuous alien monitoring.',
          NSCameraUsageDescription:
            'ET Tracker needs camera access to photograph alien encounters.',
          NSPhotoLibraryUsageDescription:
            'ET Tracker needs photo library access to attach images to sightings.',
          NSPhotoLibraryAddUsageDescription:
            'ET Tracker needs to save alien encounter photos to your library.',
          UIBackgroundModes: ['location', 'fetch', 'remote-notification'],
        },
      },
      android: {
        adaptiveIcon: {
          foregroundImage: './assets/images/android-icon-foreground.png',
          backgroundImage: './assets/images/android-icon-background.png',
          backgroundColor: '#0A0A1A',
        },
        edgeToEdgeEnabled: true,
        package: 'com.ettracker.app',
        permissions: [
          'ACCESS_FINE_LOCATION',
          'ACCESS_COARSE_LOCATION',
          'ACCESS_BACKGROUND_LOCATION',
          'CAMERA',
          'READ_EXTERNAL_STORAGE',
          'WRITE_EXTERNAL_STORAGE',
          'RECEIVE_BOOT_COMPLETED',
          'VIBRATE',
          'POST_NOTIFICATIONS',
        ],
      },
      web: {
        output: 'static',
        favicon: './assets/images/favicon.png',
      },
      plugins: [
        'expo-router',
        [
          'expo-splash-screen',
          {
            image: './assets/images/splash-icon.png',
            imageWidth: 200,
            resizeMode: 'contain',
            backgroundColor: '#0A0A1A',
          },
        ],
        [
          'expo-location',
          {
            locationAlwaysAndWhenInUsePermission:
              'ET Tracker needs your location to log alien sighting coordinates.',
            locationWhenInUsePermission:
              'ET Tracker needs your location to log alien sighting coordinates.',
            isIosBackgroundLocationEnabled: true,
            isAndroidBackgroundLocationEnabled: true,
          },
        ],
        [
          'expo-notifications',
          {
            color: '#00D4FF',
            sounds: [],
          },
        ],
        'expo-secure-store',
      ],
      experiments: {
        typedRoutes: true,
      },
      // Optional: Sentry error reporting setup
      ...(process.env.EXPO_PUBLIC_SENTRY_DSN && {
        hooks: {
          postPublish: [
            {
              file: 'sentry-expo/hooks/postPublish',
              config: {
                organization: process.env.SENTRY_ORG,
                project: process.env.SENTRY_PROJECT,
                authToken: process.env.SENTRY_AUTH_TOKEN,
              },
            },
          ],
        },
      }),
    },
  };
};
