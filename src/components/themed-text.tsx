import { Text, type TextProps } from 'react-native';
import { cn } from '@/lib/utils';

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
  normal: 'font-sans',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const variantClasses: Record<TextVariant, string> = {
  primary: 'text-text-primary dark:text-text-primary-dark',
  secondary: 'text-text-secondary dark:text-text-secondary-dark',
  muted: 'text-text-muted dark:text-text-muted-dark',
  accent: 'text-primary dark:text-primary-dark',
  error: 'text-error',
};

export function ThemedText({
  variant = 'primary',
  size = 'base',
  weight = 'normal',
  className,
  ...props
}: ThemedTextProps) {
  return (
    <Text
      className={cn(sizeClasses[size], weightClasses[weight], variantClasses[variant], className)}
      {...props}
    />
  );
}
