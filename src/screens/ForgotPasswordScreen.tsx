import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import { fonts } from '../theme';

const BLUE = '#004CFF';
const BLUE_SOFT = 'rgba(0, 76, 255, 0.10)';
const PINK_SOFT = 'rgba(255, 182, 193, 0.28)';
const TITLE = '#000000';
const BODY = '#1A1A1A';
const MUTED = '#8A8A8A';
const CHECK_PINK = 'rgba(255, 160, 180, 0.55)';

type RecoveryMethod = 'sms' | 'email';

type ForgotPasswordScreenProps = {
  onNext: (method: RecoveryMethod) => void;
  onCancel: () => void;
};

function BackgroundBlobs() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
        <Ellipse cx="40" cy="60" rx="120" ry="90" fill="rgba(120,140,255,0.12)" />
        <Path
          d="M250 0c40 40 90 70 140 80v220c-70-10-120-50-150-110-25-50-20-120 10-190Z"
          fill={BLUE}
        />
        <Ellipse cx="340" cy="180" rx="90" ry="70" fill="rgba(0,76,255,0.35)" />
      </Svg>
    </View>
  );
}

/** Soft gift avatar — matches Givit brand, not a photo */
function RecoveryAvatar() {
  return (
    <View style={styles.avatarRing}>
      <View style={styles.avatarInner}>
        <Svg width={72} height={72} viewBox="0 0 72 72" fill="none">
          <Circle cx="36" cy="36" r="36" fill="#FFE8F0" />
          <Rect x="20" y="28" width="26" height="28" rx="4" fill="rgba(0,76,255,0.18)" />
          <Rect x="28" y="24" width="26" height="32" rx="4" fill={BLUE} />
          <Path d="M41 24v32" stroke="#FFFFFF" strokeWidth={2} strokeOpacity={0.45} strokeLinecap="round" />
          <Path d="M28 38h26" stroke="#FFFFFF" strokeWidth={2} strokeOpacity={0.45} strokeLinecap="round" />
          <Path
            d="M41 24c-5.5-7.5-11-6.5-11 0 0 3.5 5.5 6.5 11 9.5 5.5-3 11-6 11-9.5 0-6.5-5.5-7.5-11 0Z"
            fill={BLUE}
          />
        </Svg>
      </View>
    </View>
  );
}

function CheckIcon({ active, tone }: { active: boolean; tone: 'blue' | 'pink' }) {
  const fill = active ? BLUE : tone === 'pink' ? CHECK_PINK : 'rgba(0,76,255,0.18)';
  return (
    <View style={[styles.checkCircle, { backgroundColor: fill }]}>
      {active ? (
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
          <Path
            d="M5 12.5l5 5 9-10"
            stroke="#FFFFFF"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      ) : null}
    </View>
  );
}

export function ForgotPasswordScreen({ onNext, onCancel }: ForgotPasswordScreenProps) {
  const insets = useSafeAreaInsets();
  const [method, setMethod] = useState<RecoveryMethod>('sms');

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top + 24,
          paddingBottom: Math.max(insets.bottom, 20),
        },
      ]}
    >
      <BackgroundBlobs />

      <View style={styles.content}>
        <View style={styles.hero}>
          <RecoveryAvatar />
          <Text style={styles.title}>Password Recovery</Text>
          <Text style={styles.subtitle}>How you would like to restore your password?</Text>
        </View>

        <View style={styles.options}>
          <Pressable
            onPress={() => setMethod('sms')}
            accessibilityRole="button"
            accessibilityState={{ selected: method === 'sms' }}
            style={({ pressed }) => [
              styles.option,
              method === 'sms' ? styles.optionSmsActive : styles.optionSmsIdle,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.optionLabel, method === 'sms' && styles.optionLabelActive]}>
              SMS
            </Text>
            <CheckIcon active={method === 'sms'} tone="blue" />
          </Pressable>

          <Pressable
            onPress={() => setMethod('email')}
            accessibilityRole="button"
            accessibilityState={{ selected: method === 'email' }}
            style={({ pressed }) => [
              styles.option,
              method === 'email' ? styles.optionEmailActive : styles.optionEmailIdle,
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.optionLabel,
                method === 'email' ? styles.optionLabelEmailActive : styles.optionLabelIdle,
              ]}
            >
              Email
            </Text>
            <CheckIcon active={method === 'email'} tone="pink" />
          </Pressable>
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={() => onNext(method)}
            accessibilityRole="button"
            accessibilityLabel="Next"
            style={({ pressed }) => [styles.nextBtn, pressed && styles.pressed]}
          >
            <Text style={styles.nextLabel}>Next</Text>
          </Pressable>

          <Pressable
            onPress={onCancel}
            accessibilityRole="button"
            style={({ pressed }) => [styles.cancelWrap, pressed && styles.pressed]}
          >
            <Text style={styles.cancelLabel}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    zIndex: 1,
    justifyContent: 'space-between',
  },
  hero: {
    alignItems: 'center',
    paddingTop: 36,
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
    ...(Platform.OS === 'web'
      ? ({ boxShadow: '0 10px 28px rgba(0,40,120,0.12)' } as object)
      : {
          shadowColor: '#002878',
          shadowOpacity: 0.12,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 6,
        }),
  },
  avatarInner: {
    width: 84,
    height: 84,
    borderRadius: 42,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE8F0',
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 34,
    color: TITLE,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: BODY,
    textAlign: 'center',
    opacity: 0.85,
    maxWidth: 280,
  },
  options: {
    gap: 14,
    paddingVertical: 12,
  },
  option: {
    height: 60,
    borderRadius: 30,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionSmsActive: {
    backgroundColor: BLUE_SOFT,
  },
  optionSmsIdle: {
    backgroundColor: 'rgba(0, 76, 255, 0.05)',
  },
  optionEmailActive: {
    backgroundColor: 'rgba(255, 150, 170, 0.35)',
  },
  optionEmailIdle: {
    backgroundColor: PINK_SOFT,
  },
  optionLabel: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: BODY,
  },
  optionLabelIdle: {
    color: TITLE,
  },
  optionLabelActive: {
    fontFamily: fonts.semiBold,
    color: BLUE,
  },
  optionLabelEmailActive: {
    fontFamily: fonts.semiBold,
    color: TITLE,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    paddingBottom: 12,
    gap: 16,
  },
  nextBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  cancelWrap: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  cancelLabel: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: MUTED,
  },
  pressed: {
    opacity: 0.85,
  },
});
