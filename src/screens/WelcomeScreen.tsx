import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight } from '../components/ArrowRight';
import { GiftLogo } from '../components/GiftLogo';
import { SoftGiftDecor } from '../components/SoftGiftDecor';
import { fonts } from '../theme';

const BLUE = '#004CFF';
const BODY = '#1A1A1A';
const MUTED = '#8A8A8A';

type WelcomeScreenProps = {
  onGetStarted: () => void;
  onHaveAccount: () => void;
};

export function WelcomeScreen({ onGetStarted, onHaveAccount }: WelcomeScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: Math.max(insets.top, 12) + 4,
          paddingBottom: Math.max(insets.bottom, 12) + 36,
        },
      ]}
    >
      <SoftGiftDecor />

      <View style={styles.topBlock}>
        <GiftLogo size={72} />
        <Text style={styles.subtitle}>
          Beautiful gifts for every{'\n'}
          story worth celebrating
        </Text>
      </View>

      <View style={styles.spacer} />

      <View style={styles.bottomBlock}>
        <Pressable
          onPress={onGetStarted}
          accessibilityRole="button"
          accessibilityLabel="Let's get started"
          style={({ pressed }) => [styles.cta, pressed && styles.pressed]}
        >
          <Text style={styles.ctaLabel}>Let's get started</Text>
        </Pressable>

        <Pressable
          onPress={onHaveAccount}
          accessibilityRole="button"
          accessibilityLabel="I already have an account"
          style={({ pressed }) => [styles.accountRow, pressed && styles.pressed]}
        >
          <Text style={styles.accountText}>I already have an account</Text>
          <View style={styles.arrowCircle}>
            <ArrowRight color="#FFFFFF" size={14} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  topBlock: {
    alignItems: 'center',
    paddingTop: 28,
    zIndex: 1,
  },
  subtitle: {
    marginTop: 14,
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: BODY,
    textAlign: 'center',
    opacity: 0.85,
  },
  spacer: {
    flex: 1,
  },
  bottomBlock: {
    width: '100%',
    gap: 14,
    paddingBottom: 8,
    zIndex: 1,
  },
  cta: {
    height: 52,
    borderRadius: 14,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 2,
  },
  accountText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: MUTED,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
});
