import { View, type ViewProps } from 'react-native';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';

type ViewVariant = 'background' | 'surface' | 'card';

interface ThemedViewProps extends ViewProps {
  variant?: ViewVariant;
  className?: string;
}

export function ThemedView({
  variant = 'background',
  className,
  style,
  ...props
}: ThemedViewProps) {
  const { colors } = useTheme();

  const variantColors: Record<ViewVariant, string> = {
    background: colors.background,
    surface: colors.surface,
    card: colors.card,
  };

  return (
    <View
      className={cn(className)}
      style={[{ backgroundColor: variantColors[variant] }, style]}
      {...props}
    />
  );
}
