import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { View } from 'react-native';
import { useEffect } from 'react';

function SkeletonLine({ width, height = 12 }: { width: string | number; height?: number }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.8, { duration: 900 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      className="bg-border dark:bg-border-dark"
      style={[{ height, width: width as any, borderRadius: height / 2 }, animatedStyle]}
    />
  );
}

export function AlienCardSkeleton() {
  return (
    <View className="bg-card dark:bg-card-dark rounded-xl p-4 mb-3">
      <View className="flex-row items-start justify-between mb-3">
        <SkeletonLine width="40%" height={16} />
        <View className="flex-row gap-2">
          <SkeletonLine width={60} height={20} />
          <SkeletonLine width={50} height={20} />
        </View>
      </View>
      <SkeletonLine width="100%" />
      <View className="h-2" />
      <SkeletonLine width="80%" />
      <View className="h-4" />
      <View className="flex-row justify-between">
        <SkeletonLine width="50%" />
        <SkeletonLine width="30%" />
      </View>
    </View>
  );
}
