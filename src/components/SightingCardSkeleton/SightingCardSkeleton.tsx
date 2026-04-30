import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { View } from 'react-native';
import { useEffect } from 'react';
import { ThemedView } from '@/components/ThemedView';

function SkeletonLine({ width, height = 12 }: { width: string | number; height?: number }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.8, { duration: 900 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      className="bg-border dark:bg-border-dark"
      style={[{ height, width: width as any, borderRadius: height / 2 }, animatedStyle]}
    />
  );
}

interface SightingCardSkeletonProps {
  compact?: boolean;
}

export function SightingCardSkeleton({ compact = false }: SightingCardSkeletonProps) {
  return (
    <ThemedView variant="card" className="mb-3 overflow-hidden rounded-xl">
      <View className="p-4">
        <View className="flex-row items-start justify-between mb-2">
          <SkeletonLine width="60%" height={16} />
          <SkeletonLine width={60} height={20} />
        </View>

        {!compact && (
          <>
            <SkeletonLine width="100%" height={12} />
            <View className="h-1" />
            <SkeletonLine width="80%" height={12} />
            <View className="h-3" />
          </>
        )}

        <View className="flex-row items-center justify-between">
          <SkeletonLine width="30%" height={10} />
          <SkeletonLine width="25%" height={10} />
        </View>
      </View>
    </ThemedView>
  );
}
