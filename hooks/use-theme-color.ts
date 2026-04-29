import { COLORS } from '@/constants/theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  _colorName?: string
): string {
  if (props.dark) return props.dark;
  return COLORS.textPrimary;
}
