import { Platform, Pressable, StyleSheet, Text, View, type TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight } from '../components/ArrowRight';
import { GiftLogo } from '../components/GiftLogo';
import { fonts } from '../theme';

const BLUE = '#004CFF';
const TITLE = '#000000';
const BODY = '#1A1A1A';
const MUTED = '#8A8A8A';

type WelcomeScreenProps = {
  onGetStarted: () => void;
  onHaveAccount: () => void;
};

/** Readable weight — light embolden only (heavy stroke made Gropled illegible) */
const titleWeight: TextStyle =
  Platform.OS === 'web'
    ? {
        // @ts-expect-error web-only
        WebkitTextStrokeWidth: 0.4,
        WebkitTextStrokeColor: TITLE,
      }
    : {};

export function WelcomeScreen({ onGetStarted, onHaveAccount }: WelcomeScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top,
          paddingBottom: Math.max(insets.bottom, 20),
        },
      ]}
    >
      <View style={styles.topBlock}>
        <GiftLogo size={134} />
        <Text style={[styles.title, titleWeight]}>Givit</Text>
        <Text style={styles.subtitle}>
          Beautiful gifts for every{'\n'}
          story worth celebrating
        </Text>
      </View>

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
  },
  topBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  title: {
    marginTop: 28,
    fontFamily: fonts.display,
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: 0.2,
    color: TITLE,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 12,
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: BODY,
    textAlign: 'center',
    opacity: 0.85,
  },
  bottomBlock: {
    width: '100%',
    paddingBottom: 28,
    gap: 20,
  },
  cta: {
    height: 56,
    borderRadius: 16,
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
    paddingVertical: 4,
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
