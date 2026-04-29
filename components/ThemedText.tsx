import { Text, type TextProps } from 'react-native';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';

type TextVariant = 'primary' | 'secondary' | 'muted' | 'accent' | 'error';
type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';

interface ThemedTextProps extends TextProps {
  variant?: TextVariant;
  size?: TextSize;
  weight?: TextWeight;
  className?: string;
}

const sizeClasses: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
};

const weightClasses: Record<TextWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export function ThemedText({
  variant = 'primary',
  size = 'base',
  weight = 'normal',
  className,
  style,
  ...props
}: ThemedTextProps) {
  const { colors } = useTheme();

  const variantColors: Record<TextVariant, string> = {
    primary: colors.textPrimary,
    secondary: colors.textSecondary,
    muted: colors.textMuted,
    accent: colors.primary,
    error: colors.error,
  };

  return (
    <Text
      className={cn(sizeClasses[size], weightClasses[weight], className)}
      style={[{ color: variantColors[variant] }, style]}
      {...props}
    />
  );
}
