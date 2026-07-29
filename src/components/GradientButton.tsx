import { useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, radii } from '../theme';

type GradientButtonProps = {
  label: string;
  loading?: boolean;
} & Omit<PressableProps, 'children' | 'style'>;

export function GradientButton({
  label,
  loading = false,
  disabled,
  onPressIn,
  onPressOut,
  ...props
}: GradientButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const isDisabled = disabled || loading;

  const handlePressIn: PressableProps['onPressIn'] = (event) => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
    onPressIn?.(event);
  };

  const handlePressOut: PressableProps['onPressOut'] = (event) => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
    onPressOut?.(event);
  };

  return (
    <Animated.View style={{ transform: [{ scale }], opacity: isDisabled ? 0.72 : 1 }}>
      <Pressable
        accessibilityRole="button"
        disabled={isDisabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...props}
      >
        <LinearGradient
          colors={[colors.marigold, colors.ctaEnd]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.button}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.label}>{label}</Text>
          )}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: radii.control,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    letterSpacing: 0.4,
    color: colors.lights,
  },
});
