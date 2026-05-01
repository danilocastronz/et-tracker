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

function SkeletonCircle({ size }: { size: number }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.8, { duration: 900 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      className="bg-border dark:bg-border-dark"
      style={[{ height: size, width: size, borderRadius: size / 2 }, animatedStyle]}
    />
  );
}

export function ProfileStatsSkeleton() {
  return (
    <>
      {/* Profile Header Skeleton */}
      <View className="items-center pt-8 pb-6">
        <SkeletonCircle size={88} />
        <View className="h-3" />
        <SkeletonLine width={120} height={20} />
        <View className="h-2" />
        <SkeletonLine width={100} height={12} />
      </View>

      {/* Stats Skeleton */}
      <View className="flex-row justify-around p-4 mx-4 mb-6 border bg-card dark:bg-card-dark border-border dark:border-border-dark rounded-xl">
        {[1, 2, 3].map((i) => (
          <View key={i} className="items-center">
            <SkeletonLine width={40} height={28} />
            <View className="h-2" />
            <SkeletonLine width={50} height={10} />
          </View>
        ))}
      </View>
    </>
  );
}
