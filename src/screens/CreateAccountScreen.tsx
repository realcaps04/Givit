import { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';
import { CountryFlag } from '../components/CountryFlag';
import { fonts } from '../theme';

const BLUE = '#004CFF';
const FIELD_BG = '#F5F5F8';
const PLACEHOLDER = '#A0A0A8';
const TITLE = '#000000';
const MUTED = '#8A8A8A';
const SKIP = '#B0B0B8';
const ERROR = '#E11D48';
const BORDER_ERR = 'rgba(225, 29, 72, 0.45)';

type Country = {
  code: string;
  name: string;
  dial: string;
  phoneLength: number;
};

const COUNTRIES: Country[] = [
  { code: 'IN', name: 'India', dial: '+91', phoneLength: 10 },
  { code: 'US', name: 'United States', dial: '+1', phoneLength: 10 },
  { code: 'GB', name: 'United Kingdom', dial: '+44', phoneLength: 10 },
  { code: 'AE', name: 'United Arab Emirates', dial: '+971', phoneLength: 9 },
  { code: 'AU', name: 'Australia', dial: '+61', phoneLength: 9 },
  { code: 'CA', name: 'Canada', dial: '+1', phoneLength: 10 },
  { code: 'SG', name: 'Singapore', dial: '+65', phoneLength: 8 },
  { code: 'DE', name: 'Germany', dial: '+49', phoneLength: 11 },
  { code: 'FR', name: 'France', dial: '+33', phoneLength: 9 },
  { code: 'JP', name: 'Japan', dial: '+81', phoneLength: 10 },
  { code: 'KR', name: 'South Korea', dial: '+82', phoneLength: 10 },
  { code: 'SA', name: 'Saudi Arabia', dial: '+966', phoneLength: 9 },
  { code: 'PK', name: 'Pakistan', dial: '+92', phoneLength: 10 },
  { code: 'BD', name: 'Bangladesh', dial: '+880', phoneLength: 10 },
  { code: 'LK', name: 'Sri Lanka', dial: '+94', phoneLength: 9 },
  { code: 'NP', name: 'Nepal', dial: '+977', phoneLength: 10 },
  { code: 'MY', name: 'Malaysia', dial: '+60', phoneLength: 9 },
  { code: 'NZ', name: 'New Zealand', dial: '+64', phoneLength: 9 },
];

type CreateAccountScreenProps = {
  onDone: () => void;
  onCancel: () => void;
  onSkip: () => void;
  onGoogle: () => void;
};

type FieldErrors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
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

function GoogleMark() {
  return (
    <Svg width={20} height={20} viewBox="0 0 48 48">
      <Path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z"
      />
      <Path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <Path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <Path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.5 5.5-6.4 6.9l.1.1 6.3 5.3C37 41.3 44 36 44 24c0-1.3-.1-2.5-.4-3.5z"
      />
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

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function validatePassword(value: string) {
  if (!value) return 'Password is required';
  if (value.length < 8) return 'Use at least 8 characters';
  if (!/[A-Za-z]/.test(value)) return 'Include at least one letter';
  if (!/[0-9]/.test(value)) return 'Include at least one number';
  return undefined;
}

export function CreateAccountScreen({
  onDone,
  onCancel,
  onSkip,
  onGoogle,
}: CreateAccountScreenProps) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [hidden, setHidden] = useState(true);
  const [confirmHidden, setConfirmHidden] = useState(true);
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<keyof FieldErrors, boolean>>({
    email: false,
    password: false,
    confirmPassword: false,
    phone: false,
  });

  const dialPrefix = useMemo(() => country.dial, [country]);

  const runValidation = (next?: {
    email?: string;
    password?: string;
    confirmPassword?: string;
    phone?: string;
    country?: Country;
  }): FieldErrors => {
    const e = next?.email ?? email;
    const p = next?.password ?? password;
    const c = next?.confirmPassword ?? confirmPassword;
    const ph = next?.phone ?? phone;
    const ct = next?.country ?? country;
    const nextErrors: FieldErrors = {};

    if (!e.trim()) nextErrors.email = 'Email is required';
    else if (!isValidEmail(e)) nextErrors.email = 'Enter a valid email address';

    const passwordError = validatePassword(p);
    if (passwordError) nextErrors.password = passwordError;

    if (!c) nextErrors.confirmPassword = 'Confirm your password';
    else if (c !== p) nextErrors.confirmPassword = 'Passwords do not match';

    const digits = ph.replace(/\D/g, '');
    if (!digits) nextErrors.phone = 'Phone number is required';
    else if (digits.length !== ct.phoneLength) {
      nextErrors.phone = `Enter a ${ct.phoneLength}-digit ${ct.name} number`;
    }

    return nextErrors;
  };

  const showError = (key: keyof FieldErrors) =>
    touched[key] && errors[key] ? errors[key] : undefined;

  const markTouched = (key: keyof FieldErrors) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(runValidation());
  };

  const onChangeEmail = (value: string) => {
    setEmail(value);
    if (touched.email) setErrors(runValidation({ email: value }));
  };

  const onChangePassword = (value: string) => {
    setPassword(value);
    if (touched.password || touched.confirmPassword) {
      setErrors(runValidation({ password: value }));
    }
  };

  const onChangeConfirm = (value: string) => {
    setConfirmPassword(value);
    if (touched.confirmPassword) setErrors(runValidation({ confirmPassword: value }));
  };

  const onChangePhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, country.phoneLength);
    setPhone(digits);
    if (touched.phone) setErrors(runValidation({ phone: digits }));
  };

  const selectCountry = (item: Country) => {
    setCountry(item);
    setPickerOpen(false);
    setPhone((prev) => prev.replace(/\D/g, '').slice(0, item.phoneLength));
    if (touched.phone) {
      setErrors(runValidation({ country: item }));
    }
  };

  const handleDone = () => {
    const nextErrors = runValidation();
    setTouched({
      email: true,
      password: true,
      confirmPassword: true,
      phone: true,
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onDone();
  };

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top + 12,
          paddingBottom: Math.max(insets.bottom, 16),
        },
      ]}
    >
      <BackgroundBlobs />

      <View style={styles.topBar}>
        <View style={styles.topBarSpacer} />
        <Pressable
          onPress={onSkip}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Skip account creation"
          style={({ pressed }) => [styles.skipBtn, pressed && styles.pressed]}
        >
          <Text style={styles.skipLabel}>Skip</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          Create{'\n'}Account
        </Text>

        <View style={styles.form}>
          <View>
            <TextInput
              value={email}
              onChangeText={onChangeEmail}
              onBlur={() => markTouched('email')}
              placeholder="Email"
              placeholderTextColor={PLACEHOLDER}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              underlineColorAndroid="transparent"
              style={[styles.field, showError('email') ? styles.fieldError : null]}
            />
            {showError('email') ? <Text style={styles.errorText}>{showError('email')}</Text> : null}
          </View>

          <View>
            <View style={styles.passwordWrap}>
              <TextInput
                value={password}
                onChangeText={onChangePassword}
                onBlur={() => markTouched('password')}
                placeholder="Password"
                placeholderTextColor={PLACEHOLDER}
                secureTextEntry={hidden}
                autoComplete="password-new"
                underlineColorAndroid="transparent"
                style={[
                  styles.field,
                  styles.passwordField,
                  showError('password') ? styles.fieldError : null,
                ]}
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
            {showError('password') ? (
              <Text style={styles.errorText}>{showError('password')}</Text>
            ) : null}
          </View>

          <View>
            <View style={styles.passwordWrap}>
              <TextInput
                value={confirmPassword}
                onChangeText={onChangeConfirm}
                onBlur={() => markTouched('confirmPassword')}
                placeholder="Confirm password"
                placeholderTextColor={PLACEHOLDER}
                secureTextEntry={confirmHidden}
                autoComplete="password-new"
                underlineColorAndroid="transparent"
                style={[
                  styles.field,
                  styles.passwordField,
                  showError('confirmPassword') ? styles.fieldError : null,
                ]}
              />
              <Pressable
                onPress={() => setConfirmHidden((v) => !v)}
                hitSlop={10}
                style={styles.eyeBtn}
                accessibilityRole="button"
                accessibilityLabel={confirmHidden ? 'Show confirm password' : 'Hide confirm password'}
              >
                <EyeIcon hidden={confirmHidden} />
              </Pressable>
            </View>
            {showError('confirmPassword') ? (
              <Text style={styles.errorText}>{showError('confirmPassword')}</Text>
            ) : null}
          </View>

          <View>
            <View
              style={[
                styles.phoneRow,
                showError('phone') ? styles.fieldError : null,
              ]}
            >
              <Pressable
                style={styles.country}
                accessibilityRole="button"
                accessibilityLabel={`Country code ${country.name}`}
                onPress={() => setPickerOpen(true)}
              >
                <CountryFlag code={country.code} width={24} height={16} />
                <Text style={styles.dial}>{dialPrefix}</Text>
                <Text style={styles.chevron}>▾</Text>
              </Pressable>
              <View style={styles.phoneDivider} />
              <TextInput
                value={phone}
                onChangeText={onChangePhone}
                onBlur={() => markTouched('phone')}
                placeholder="Phone number"
                placeholderTextColor={PLACEHOLDER}
                keyboardType="phone-pad"
                underlineColorAndroid="transparent"
                style={styles.phoneInput}
              />
            </View>
            {showError('phone') ? <Text style={styles.errorText}>{showError('phone')}</Text> : null}
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={handleDone}
            accessibilityRole="button"
            style={({ pressed }) => [styles.doneBtn, pressed && styles.pressed]}
          >
            <Text style={styles.doneLabel}>Done</Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            onPress={onGoogle}
            accessibilityRole="button"
            accessibilityLabel="Create account with Google"
            style={({ pressed }) => [styles.googleBtn, pressed && styles.pressed]}
          >
            <GoogleMark />
            <Text style={styles.googleLabel}>Continue with Google</Text>
          </Pressable>

          <Pressable
            onPress={onCancel}
            accessibilityRole="button"
            style={({ pressed }) => [styles.cancelWrap, pressed && styles.pressed]}
          >
            <Text style={styles.cancelLabel}>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal visible={pickerOpen} animationType="slide" transparent onRequestClose={() => setPickerOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setPickerOpen(false)}>
          <Pressable style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]} onPress={() => undefined}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Select country</Text>
            <FlatList
              data={COUNTRIES}
              keyExtractor={(item) => item.code}
              keyboardShouldPersistTaps="handled"
              style={styles.countryList}
              renderItem={({ item }) => {
                const selected = item.code === country.code;
                return (
                  <Pressable
                    onPress={() => selectCountry(item)}
                    style={({ pressed }) => [
                      styles.countryRow,
                      selected && styles.countryRowSelected,
                      pressed && styles.pressed,
                    ]}
                  >
                    <CountryFlag code={item.code} width={28} height={18} />
                    <View style={styles.countryMeta}>
                      <Text style={styles.countryName}>{item.name}</Text>
                      <Text style={styles.countryDial}>{item.dial}</Text>
                    </View>
                    {selected ? <Text style={styles.check}>✓</Text> : null}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  topBar: {
    zIndex: 2,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minHeight: 36,
  },
  topBarSpacer: {
    flex: 1,
  },
  skipBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  skipLabel: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: SKIP,
  },
  scroll: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingBottom: 20,
    flexGrow: 1,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 40,
    lineHeight: 46,
    color: TITLE,
    marginTop: 8,
    marginBottom: 52,
  },
  form: {
    gap: 14,
  },
  field: {
    height: 56,
    borderRadius: 28,
    backgroundColor: FIELD_BG,
    paddingHorizontal: 22,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: TITLE,
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...(Platform.OS === 'web'
      ? ({
          outlineStyle: 'none',
          outlineWidth: 0,
          outlineColor: 'transparent',
          boxShadow: 'none',
        } as object)
      : null),
  },
  fieldError: {
    borderColor: BORDER_ERR,
  },
  errorText: {
    marginTop: 6,
    marginLeft: 18,
    fontFamily: fonts.regular,
    fontSize: 12,
    color: ERROR,
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
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  country: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 8,
    paddingVertical: 8,
  },
  dial: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: TITLE,
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
    ...(Platform.OS === 'web'
      ? ({
          outlineStyle: 'none',
          outlineWidth: 0,
          outlineColor: 'transparent',
          boxShadow: 'none',
        } as object)
      : null),
  },
  actions: {
    marginTop: 28,
    paddingBottom: 8,
    gap: 14,
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
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 2,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#D8D8DE',
  },
  dividerText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: MUTED,
  },
  googleBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E4E4EA',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  googleLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: TITLE,
  },
  cancelWrap: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  cancelLabel: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: MUTED,
  },
  pressed: {
    opacity: 0.85,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    maxHeight: '70%',
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D8D8DE',
    marginBottom: 12,
  },
  sheetTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 17,
    color: TITLE,
    marginBottom: 10,
    paddingHorizontal: 6,
  },
  countryList: {
    marginBottom: 8,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  countryRowSelected: {
    backgroundColor: 'rgba(0,76,255,0.08)',
  },
  countryMeta: {
    flex: 1,
  },
  countryName: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: TITLE,
  },
  countryDial: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: MUTED,
    marginTop: 2,
  },
  check: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: BLUE,
  },
});
