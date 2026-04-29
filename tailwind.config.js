/** @type {import('tailwindcss').Config} */
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
        background: '#0A0A1A',
        surface: '#12122A',
        card: '#1A1A35',
        border: '#2A2A4A',
        primary: '#00D4FF',
        secondary: '#7B2FBE',
        accent: '#FF6B35',
        'text-primary': '#E8E8FF',
        'text-secondary': '#8888AA',
        'text-muted': '#555577',
        'threat-low': '#22C55E',
        'threat-medium': '#F59E0B',
        'threat-high': '#EF4444',
        'threat-critical': '#DC2626',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      },
    },
  },
  plugins: [],
};
