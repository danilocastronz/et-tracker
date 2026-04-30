import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { View } from 'react-native';
import { useEffect } from 'react';

const RING_COUNT = 5;
const PULSE_DURATION = 1600;
const SWEEP_DURATION = 2000;

function RadarRing({ size, color, index }: { size: number; color: string; index: number }) {
  const scale = useSharedValue(0.2);
  const opacity = useSharedValue(0.85);

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
  }, [index, opacity, scale]);

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
          borderWidth: 2,
          borderColor: color,
        },
        animatedStyle,
      ]}
    />
  );
}

interface SweepArmProps {
  size: number;
  color: string;
  rotation: SharedValue<number>;
  angleOffset: number;
  lineOpacity: number;
}

function RadarSweepArm({ size, color, rotation, angleOffset, lineOpacity }: SweepArmProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value + angleOffset}deg` }],
  }));

  return (
    <Animated.View style={[{ position: 'absolute', width: size, height: size }, animatedStyle]}>
      <View
        style={{
          position: 'absolute',
          top: size / 2 - 1,
          left: size / 2,
          width: size / 2,
          height: angleOffset === 0 ? 2 : 1,
          backgroundColor: color,
          opacity: lineOpacity,
        }}
      />
    </Animated.View>
  );
}

function RadarSweep({ size, color }: { size: number; color: string }) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: SWEEP_DURATION, easing: Easing.linear }),
      -1,
      false
    );
    return () => cancelAnimation(rotation);
  }, [rotation]);

  return (
    <>
      <RadarSweepArm
        size={size}
        color={color}
        rotation={rotation}
        angleOffset={-60}
        lineOpacity={0.1}
      />
      <RadarSweepArm
        size={size}
        color={color}
        rotation={rotation}
        angleOffset={-40}
        lineOpacity={0.2}
      />
      <RadarSweepArm
        size={size}
        color={color}
        rotation={rotation}
        angleOffset={-20}
        lineOpacity={0.4}
      />
      <RadarSweepArm
        size={size}
        color={color}
        rotation={rotation}
        angleOffset={0}
        lineOpacity={0.9}
      />
    </>
  );
}

interface RadarAnimationProps {
  size?: number;
  color?: string;
}

export function RadarAnimation({ size = 200, color = '#00D4FF' }: RadarAnimationProps) {
  const dotScale = useSharedValue(0.8);

  useEffect(() => {
    dotScale.value = withRepeat(withTiming(1.5, { duration: 700 }), -1, true);
    return () => cancelAnimation(dotScale);
  }, [dotScale]);

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
  }));

  const dotSize = size * 0.075;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Static crosshair */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: 1,
          backgroundColor: color,
          opacity: 0.15,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: 1,
          height: size,
          backgroundColor: color,
          opacity: 0.15,
        }}
      />

      {/* Static guide circles */}
      {[0.33, 0.66].map((ratio) => (
        <View
          key={ratio}
          style={{
            position: 'absolute',
            width: size * ratio,
            height: size * ratio,
            borderRadius: (size * ratio) / 2,
            borderWidth: 1,
            borderColor: color,
            opacity: 0.15,
          }}
        />
      ))}

      {/* Pulsing rings */}
      {Array.from({ length: RING_COUNT }, (_, i) => (
        <RadarRing key={i} size={size} color={color} index={i} />
      ))}

      {/* Rotating sweep with trail */}
      <RadarSweep size={size} color={color} />

      {/* Pulsing center dot */}
      <Animated.View
        style={[
          {
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: color,
          },
          dotStyle,
        ]}
      />
    </View>
  );
}
