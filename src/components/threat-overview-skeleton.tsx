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
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      className="bg-border dark:bg-border-dark"
      style={[{ height, width: width as any, borderRadius: height / 2 }, animatedStyle]}
    />
  );
}

export function ThreatOverviewSkeleton() {
  return (
    <View className="flex-row flex-wrap gap-3">
      {[1, 2, 3, 4].map((i) => (
        <View
          key={i}
          className="flex-1 min-w-[40%] bg-card dark:bg-card-dark rounded-xl p-4 items-center border border-border dark:border-border-dark"
        >
          <SkeletonLine width={50} height={32} />
          <View className="h-2" />
          <SkeletonLine width={60} height={10} />
        </View>
      ))}
    </View>
  );
}
