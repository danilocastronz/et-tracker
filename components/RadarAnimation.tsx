import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const RINGS = [0, 1, 2, 3];
const RING_SIZE = 60;
const PULSE_DURATION = 2400;

interface RadarAnimationProps {
  size?: number;
  color?: string;
}

export function RadarAnimation({
  size = 200,
  color = '#00D4FF',
}: RadarAnimationProps) {
  const scales = RINGS.map(() => useSharedValue(0.3));
  const opacities = RINGS.map(() => useSharedValue(0.8));

  useEffect(() => {
    RINGS.forEach((_, i) => {
      const delay = (i * PULSE_DURATION) / RINGS.length;
      scales[i].value = withDelay(
        delay,
        withRepeat(withTiming(1, { duration: PULSE_DURATION }), -1, false)
      );
      opacities[i].value = withDelay(
        delay,
        withRepeat(withTiming(0, { duration: PULSE_DURATION }), -1, false)
      );
    });

    return () => {
      RINGS.forEach((_, i) => {
        cancelAnimation(scales[i]);
        cancelAnimation(opacities[i]);
      });
    };
  }, []);

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {RINGS.map((_, i) => {
        const style = useAnimatedStyle(() => ({
          transform: [{ scale: scales[i].value }],
          opacity: opacities[i].value,
        }));

        return (
          <Animated.View
            key={i}
            style={[
              {
                position: 'absolute',
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: 1.5,
                borderColor: color,
              },
              style,
            ]}
          />
        );
      })}

      {/* Center dot */}
      <View
        style={{
          width: RING_SIZE * 0.25,
          height: RING_SIZE * 0.25,
          borderRadius: RING_SIZE * 0.125,
          backgroundColor: color,
        }}
      />
    </View>
  );
}
