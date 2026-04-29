import { View, type ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

type ViewVariant = 'background' | 'surface' | 'card';

interface ThemedViewProps extends ViewProps {
  variant?: ViewVariant;
  className?: string;
}

const variantClasses: Record<ViewVariant, string> = {
  background: 'bg-[#0A0A1A]',
  surface: 'bg-[#12122A]',
  card: 'bg-[#1A1A35]',
};

export function ThemedView({
  variant = 'background',
  className,
  ...props
}: ThemedViewProps) {
  return (
    <View
      className={cn(variantClasses[variant], className)}
      {...props}
    />
  );
}
