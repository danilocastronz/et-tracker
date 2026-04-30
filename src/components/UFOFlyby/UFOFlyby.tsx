import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { Dimensions, View } from 'react-native';
import { useEffect } from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const UFO_DELAY = 6000;
const UFO_TRAVEL = 3500;

export function UFOFlyby() {
  const translateX = useSharedValue(-80);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateX.value = withDelay(
      UFO_DELAY,
      withRepeat(
        withSequence(
          // reset position
          withTiming(-80, { duration: 0 }),
          // fly across
          withTiming(SCREEN_WIDTH + 80, { duration: UFO_TRAVEL })
        ),
        -1,
        false
      )
    );

    opacity.value = withDelay(
      UFO_DELAY,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(1, { duration: UFO_TRAVEL - 600 }),
          withTiming(0, { duration: 300 })
        ),
        -1,
        false
      )
    );

    translateY.value = withDelay(
      UFO_DELAY,
      withRepeat(
        withSequence(
          withTiming(-8, { duration: UFO_TRAVEL / 3 }),
          withTiming(8, { duration: UFO_TRAVEL / 3 }),
          withTiming(0, { duration: UFO_TRAVEL / 3 })
        ),
        -1,
        false
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        height: 60,
      }}
    >
      <Animated.View style={[{ position: 'absolute', top: 20 }, animatedStyle]}>
        <ThemedText style={{ fontSize: 32 }}>🛸</ThemedText>
      </Animated.View>
    </View>
  );
}
