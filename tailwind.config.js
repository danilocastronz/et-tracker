/** @type {import('tailwindcss').Config} */
// Tailwind config for NativeWind with light/dark mode support
// Light colors are defaults; dark variants use dark: prefix (e.g. dark:bg-card-dark)
// Note: Most colors are now in context/ThemeContext.tsx for dynamic theme switching
module.exports = {
  content: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/context/**/*.{js,jsx,ts,tsx}',
    './src/hooks/**/*.{js,jsx,ts,tsx}',
    './src/lib/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Light mode defaults — accessible contrast, space-themed blue-gray
        background: '#F0F4F8',
        surface: '#FFFFFF',
        card: '#FFFFFF',
        border: '#CBD5E1',
        primary: '#0284C7',
        'text-primary': '#0F172A',
        'text-secondary': '#475569',
        'text-muted': '#64748B',
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
