import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { View } from 'react-native';
import { useEffect } from 'react';

const RING_COUNT = 4;
const PULSE_DURATION = 2400;

interface RadarRingProps {
  size: number;
  color: string;
  index: number;
}

function RadarRing({ size, color, index }: RadarRingProps) {
  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0.8);

  useEffect(() => {
    const delay = (index * PULSE_DURATION) / RING_COUNT;
    scale.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: PULSE_DURATION }), -1, false)
    );
    opacity.value = withDelay(
      delay,
      withRepeat(withTiming(0, { duration: PULSE_DURATION }), -1, false)
    );
    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1.5,
          borderColor: color,
        },
        animatedStyle,
      ]}
    />
  );
}

interface RadarAnimationProps {
  size?: number;
  color?: string;
}

export function RadarAnimation({ size = 200, color = '#00D4FF' }: RadarAnimationProps) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {Array.from({ length: RING_COUNT }, (_, i) => (
        <RadarRing key={i} size={size} color={color} index={i} />
      ))}
      <View
        style={{
          width: size * 0.075,
          height: size * 0.075,
          borderRadius: size * 0.0375,
          backgroundColor: color,
        }}
      />
    </View>
  );
}
