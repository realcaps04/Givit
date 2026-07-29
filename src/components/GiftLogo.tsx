import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import Svg, { Path, G, Rect } from 'react-native-svg';

type GiftLogoProps = {
  size?: number;
};

const BLUE = '#004CFF';
const BLUE_SOFT = 'rgba(0, 76, 255, 0.45)';

/** Soft circular badge + gift icon with a calm entrance + float */
export function GiftLogo({ size = 134 }: GiftLogoProps) {
  const icon = size * 0.46;
  const appear = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(appear, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 2800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 2800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [appear, float]);

  const scale = appear.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1],
  });

  const translateY = float.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });

  return (
    <Animated.View
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity: appear,
          transform: [{ scale }, { translateY }],
        },
      ]}
    >
      <Svg width={icon} height={icon} viewBox="0 0 64 64" fill="none">
        <G>
          <Rect x="10" y="24" width="28" height="30" rx="3" fill={BLUE_SOFT} />
          <Rect x="26" y="20" width="28" height="34" rx="3" fill={BLUE} />
          <Path
            d="M40 20v34"
            stroke="#FFFFFF"
            strokeWidth={2}
            strokeOpacity={0.35}
            strokeLinecap="round"
          />
          <Path
            d="M26 34h28"
            stroke="#FFFFFF"
            strokeWidth={2}
            strokeOpacity={0.35}
            strokeLinecap="round"
          />
          <Path
            d="M40 20c-6-8-12-7-12 0 0 4 6 7 12 10 6-3 12-6 12-10 0-7-6-8-12 0Z"
            fill={BLUE}
          />
        </G>
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 22,
    elevation: 8,
  },
});
