import { View, type ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

type ViewVariant = 'background' | 'surface' | 'card';

interface ThemedViewProps extends ViewProps {
  variant?: ViewVariant;
  className?: string;
}

const variantClasses: Record<ViewVariant, string> = {
  background: 'bg-background dark:bg-background-dark',
  surface: 'bg-surface dark:bg-surface-dark',
  card: 'bg-card dark:bg-card-dark',
};

export function ThemedView({ variant = 'background', className, ...props }: ThemedViewProps) {
  return <View className={cn(variantClasses[variant], className)} {...props} />;
}
