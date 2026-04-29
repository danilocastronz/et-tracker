/** @type {import('tailwindcss').Config} */
// Tailwind config for NativeWind with light/dark mode support
// Light colors are defaults; dark variants use dark: prefix (e.g. dark:bg-card-dark)
// Note: Most colors are now in context/ThemeContext.tsx for dynamic theme switching
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './context/**/*.{js,jsx,ts,tsx}',
    './hooks/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Light mode defaults
        background: '#F2F2F7',
        surface: '#FFFFFF',
        card: '#FFFFFF',
        border: '#E0E0EA',
        primary: '#0099BB',
        'text-primary': '#1A1A2E',
        'text-secondary': '#555570',
        'text-muted': '#9999AA',
        // Dark mode variants (used with dark: prefix)
        'background-dark': '#0A0A1A',
        'surface-dark': '#12122A',
        'card-dark': '#1A1A35',
        'border-dark': '#2A2A4A',
        'primary-dark': '#00D4FF',
        'text-primary-dark': '#E8E8FF',
        'text-secondary-dark': '#8888AA',
        'text-muted-dark': '#555577',
        // Neutral colors (same in both modes)
        secondary: '#7B2FBE',
        accent: '#FF6B35',
        'threat-low': '#22C55E',
        'threat-medium': '#F59E0B',
        'threat-high': '#EF4444',
        'threat-critical': '#DC2626',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter_400Regular'],
        medium: ['Inter_500Medium'],
        semibold: ['Inter_600SemiBold'],
        bold: ['Inter_700Bold'],
      },
    },
  },
  darkMode: 'media',
  plugins: [],
};
