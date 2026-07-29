import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Circle, Ellipse } from 'react-native-svg';
import { fonts } from '../theme';

const BLUE = '#004CFF';
const FIELD_BG = '#F5F5F8';
const PLACEHOLDER = '#A0A0A8';
const TITLE = '#000000';
const MUTED = '#8A8A8A';

type CreateAccountScreenProps = {
  onDone: () => void;
  onCancel: () => void;
};

function EyeIcon({ hidden }: { hidden: boolean }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      {hidden ? (
        <>
          <Path
            d="M3 3l18 18"
            stroke={PLACEHOLDER}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
          <Path
            d="M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.1A10.4 10.4 0 0 1 12 5c5 0 9.3 3.1 11 7.5a11.7 11.7 0 0 1-1.7 2.9M6.1 6.1A11.8 11.8 0 0 0 1 12.5C2.7 16.9 7 20 12 20c1.6 0 3.1-.3 4.5-.9"
            stroke={PLACEHOLDER}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          <Path
            d="M1 12.5C2.7 8.1 7 5 12 5s9.3 3.1 11 7.5C21.3 16.9 17 20 12 20S2.7 16.9 1 12.5Z"
            stroke={PLACEHOLDER}
            strokeWidth={1.8}
          />
          <Circle cx="12" cy="12.5" r="3" stroke={PLACEHOLDER} strokeWidth={1.8} />
        </>
      )}
    </Svg>
  );
}

function UkFlag() {
  return (
    <Svg width={22} height={16} viewBox="0 0 60 30">
      <Rect width="60" height="30" fill="#012169" />
      <Path d="M0 0l60 30M60 0L0 30" stroke="#FFF" strokeWidth={6} />
      <Path d="M0 0l60 30M60 0L0 30" stroke="#C8102E" strokeWidth={2} />
      <Path d="M30 0v30M0 15h60" stroke="#FFF" strokeWidth={10} />
      <Path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth={6} />
    </Svg>
  );
}

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

export function CreateAccountScreen({ onDone, onCancel }: CreateAccountScreenProps) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [hidden, setHidden] = useState(true);

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top + 28,
          paddingBottom: Math.max(insets.bottom, 20),
        },
      ]}
    >
      <BackgroundBlobs />

      <View style={styles.content}>
        <View>
          <Text style={styles.title}>
            Create{'\n'}Account
          </Text>

          <View style={styles.form}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor={PLACEHOLDER}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              style={styles.field}
            />

            <View style={styles.passwordWrap}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor={PLACEHOLDER}
                secureTextEntry={hidden}
                autoComplete="password-new"
                style={[styles.field, styles.passwordField]}
              />
              <Pressable
                onPress={() => setHidden((v) => !v)}
                hitSlop={10}
                style={styles.eyeBtn}
                accessibilityRole="button"
                accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
              >
                <EyeIcon hidden={hidden} />
              </Pressable>
            </View>

            <View style={styles.phoneRow}>
              <Pressable style={styles.country} accessibilityRole="button">
                <UkFlag />
                <Text style={styles.chevron}>▾</Text>
              </Pressable>
              <View style={styles.phoneDivider} />
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Your number"
                placeholderTextColor={PLACEHOLDER}
                keyboardType="phone-pad"
                style={styles.phoneInput}
              />
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={onDone}
            accessibilityRole="button"
            style={({ pressed }) => [styles.doneBtn, pressed && styles.pressed]}
          >
            <Text style={styles.doneLabel}>Done</Text>
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
  title: {
    fontFamily: fonts.bold,
    fontSize: 40,
    lineHeight: 46,
    color: TITLE,
    marginBottom: 36,
  },
  form: {
    gap: 16,
  },
  field: {
    height: 56,
    borderRadius: 28,
    backgroundColor: FIELD_BG,
    paddingHorizontal: 22,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: TITLE,
  },
  passwordWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordField: {
    paddingRight: 52,
  },
  eyeBtn: {
    position: 'absolute',
    right: 18,
    height: 56,
    justifyContent: 'center',
  },
  phoneRow: {
    height: 56,
    borderRadius: 28,
    backgroundColor: FIELD_BG,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  country: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 10,
  },
  chevron: {
    fontSize: 12,
    color: MUTED,
    marginTop: -2,
  },
  phoneDivider: {
    width: 1,
    height: 22,
    backgroundColor: '#D8D8DE',
    marginRight: 12,
  },
  phoneInput: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: TITLE,
    padding: 0,
  },
  actions: {
    paddingTop: 24,
    paddingBottom: 12,
    gap: 18,
  },
  doneBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneLabel: {
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
