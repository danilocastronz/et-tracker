export const DARK_COLORS = {
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

export const LIGHT_COLORS = {
  background: '#F0F4F8',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  border: '#CBD5E1',
  primary: '#0284C7',
  secondary: '#7B2FBE',
  accent: '#FF6B35',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
  threatLow: '#16A34A',
  threatMedium: '#D97706',
  threatHigh: '#DC2626',
  threatCritical: '#B91C1C',
  success: '#16A34A',
  warning: '#D97706',
  error: '#DC2626',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const COLORS = DARK_COLORS;

export type Colors = typeof DARK_COLORS | typeof LIGHT_COLORS;
export type ColorKey = keyof Colors;

export function getColors(scheme: 'dark' | 'light'): typeof DARK_COLORS | typeof LIGHT_COLORS {
  return scheme === 'light' ? LIGHT_COLORS : DARK_COLORS;
}
