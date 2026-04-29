export const COLORS = {
  background: '#0A0A1A',
  surface: '#12122A',
  card: '#1A1A35',
  border: '#2A2A4A',
  primary: '#00D4FF',
  secondary: '#7B2FBE',
  accent: '#FF6B35',
  textPrimary: '#E8E8FF',
  textSecondary: '#8888AA',
  textMuted: '#555577',
  threatLow: '#22C55E',
  threatMedium: '#F59E0B',
  threatHigh: '#EF4444',
  threatCritical: '#DC2626',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorKey = keyof typeof COLORS;
