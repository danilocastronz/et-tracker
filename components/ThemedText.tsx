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

const variantClasses: Record<TextVariant, string> = {
  primary: 'text-[#E8E8FF]',
  secondary: 'text-[#8888AA]',
  muted: 'text-[#555577]',
  accent: 'text-[#00D4FF]',
  error: 'text-[#EF4444]',
};

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
  ...props
}: ThemedTextProps) {
  return (
    <Text
      className={cn(
        variantClasses[variant],
        sizeClasses[size],
        weightClasses[weight],
        className
      )}
      {...props}
    />
  );
}
