import { Platform, StyleSheet, Text, View, type TextStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts } from '../theme';

type GivitLogoProps = {
  size?: number;
};

const wordmarkOutline: TextStyle =
  Platform.OS === 'web'
    ? {
        color: 'transparent',
        // @ts-expect-error web-only CSS property
        WebkitTextStrokeWidth: 1.35,
        WebkitTextStrokeColor: colors.marigold,
      }
    : {
        color: colors.marigold,
      };

export function GivitLogo({ size = 56 }: GivitLogoProps) {
  return (
    <View style={styles.container} accessibilityRole="image" accessibilityLabel="Givit logo">
      <Svg width={size} height={size} viewBox="0 0 72 72" fill="none">
        <Path
          d="M18 28h36v30a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4V28Z"
          stroke={colors.marigold}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <Path
          d="M18 38h36M36 28v34"
          stroke={colors.marigold}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <Path
          d="M36 28c-7.5-10-16-9.5-16 0 0 7 9 12 16 16 7-4 16-9 16-16 0-9.5-8.5-10-16 0Z"
          stroke={colors.marigold}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <Path
          d="M28 18h16"
          stroke={colors.marigold}
          strokeWidth={2}
          strokeLinecap="round"
        />
      </Svg>

      <Text style={[styles.wordmark, wordmarkOutline]}>GIVIT</Text>
      <Text style={styles.tagline}>Every Gift Tells a Story.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  wordmark: {
    marginTop: 12,
    fontFamily: fonts.bold,
    fontSize: 34,
    letterSpacing: 7,
  },
  tagline: {
    marginTop: 6,
    fontFamily: fonts.medium,
    fontSize: 11,
    letterSpacing: 0.8,
    color: colors.textSecondary,
  },
});
