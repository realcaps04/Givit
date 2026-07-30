import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import { OtpDotsInput } from '../components/OtpDotsInput';
import { fonts } from '../theme';

const BLUE = '#004CFF';
const PINK = '#FF6B9A';
const TITLE = '#000000';
const BODY = '#1A1A1A';
const MUTED = '#8A8A8A';

export type RecoveryChannel = 'sms' | 'email';

type PasswordRecoveryOtpScreenProps = {
  channel: RecoveryChannel;
  /** Masked destination e.g. +91*******21 or j***@mail.com */
  destination: string;
  onVerified: (code: string) => void;
  onSendAgain: () => void;
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

export function PasswordRecoveryOtpScreen({
  channel,
  destination,
  onVerified,
  onSendAgain,
  onCancel,
}: PasswordRecoveryOtpScreenProps) {
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [resent, setResent] = useState(false);

  const hint =
    channel === 'sms'
      ? 'Enter 4-digits code we sent you on your phone number'
      : 'Enter 4-digits code we sent you on your email';

  const handleChange = (next: string) => {
    setCode(next);
    setError(undefined);
    if (next.length === 4) {
      // UI-only verify — backend later
      onVerified(next);
    }
  };

  const handleSendAgain = () => {
    setCode('');
    setError(undefined);
    setResent(true);
    onSendAgain();
    setTimeout(() => setResent(false), 2500);
  };

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
          <Text style={styles.subtitle}>{hint}</Text>
          <Text style={styles.destination}>{destination}</Text>
        </View>

        <View style={styles.otpBlock}>
          <OtpDotsInput value={code} onChange={handleChange} error={error} />
          {resent ? <Text style={styles.resent}>Code sent again</Text> : null}
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={handleSendAgain}
            accessibilityRole="button"
            accessibilityLabel="Send again"
            style={({ pressed }) => [styles.sendBtn, pressed && styles.pressed]}
          >
            <Text style={styles.sendLabel}>Send Again</Text>
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
    maxWidth: 300,
  },
  destination: {
    marginTop: 10,
    fontFamily: fonts.medium,
    fontSize: 15,
    color: TITLE,
    letterSpacing: 0.3,
  },
  otpBlock: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  resent: {
    marginTop: 12,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: BLUE,
  },
  actions: {
    paddingBottom: 12,
    gap: 16,
  },
  sendBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: PINK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendLabel: {
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
