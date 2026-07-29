import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mail, Lock } from 'lucide-react-native';
import { AuthTextField } from '../components/AuthTextField';
import { GivitLogo } from '../components/GivitLogo';
import { GoogleButton } from '../components/GoogleButton';
import { GradientButton } from '../components/GradientButton';
import { colors, fonts } from '../theme';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string) {
  if (!email.trim()) return 'Email address is required';
  if (!EMAIL_REGEX.test(email.trim())) return 'Enter a valid email address';
  return undefined;
}

function validatePassword(password: string) {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  return undefined;
}

function FadeBlock({
  delay = 0,
  children,
  style,
}: {
  delay?: number;
  children: React.ReactNode;
  style?: object;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 480,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 480,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, opacity, translateY]);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}

export function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleContinue = () => {
    setSubmitted(true);
    const nextEmailError = validateEmail(email);
    const nextPasswordError = validatePassword(password);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);

    if (nextEmailError || nextPasswordError) return;

    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  const contentMinHeight =
    windowHeight - insets.top - Math.max(insets.bottom, 16);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.content,
            {
              minHeight: contentMinHeight,
              paddingBottom: Math.max(insets.bottom, 20),
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.main}>
            <FadeBlock delay={40}>
              <GivitLogo />
            </FadeBlock>

            <FadeBlock delay={100} style={styles.welcomeBlock}>
              <Text style={styles.title}>Welcome to Givit</Text>
              <Text style={styles.subtitle}>
                Discover beautiful gifts that create unforgettable memories.
              </Text>
            </FadeBlock>

            <FadeBlock delay={180} style={styles.form}>
              <AuthTextField
                label="Email address"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (submitted) setEmailError(validateEmail(text));
                }}
                icon={Mail}
                error={emailError}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                textContentType="emailAddress"
                returnKeyType="next"
              />

              <AuthTextField
                label="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (submitted) setPasswordError(validatePassword(text));
                }}
                icon={Lock}
                error={passwordError}
                secureTextEntry
                autoComplete="password"
                textContentType="password"
                returnKeyType="done"
                onSubmitEditing={handleContinue}
              />

              <Pressable
                style={styles.forgotWrap}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Forgot Password"
              >
                <Text style={styles.forgot}>Forgot Password?</Text>
              </Pressable>

              <GradientButton
                label="Continue"
                onPress={handleContinue}
                loading={loading}
              />

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <GoogleButton />

              <View style={styles.createRow}>
                <Text style={styles.createPrompt}>Don't have an account? </Text>
                <Pressable hitSlop={6} accessibilityRole="button">
                  <Text style={styles.createLink}>Create Account</Text>
                </Pressable>
              </View>
            </FadeBlock>
          </View>

          <FadeBlock delay={260} style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our{' '}
              <Text
                style={styles.footerLink}
                onPress={() => undefined}
                accessibilityRole="link"
              >
                Terms of Service
              </Text>
              {' and '}
              <Text
                style={styles.footerLink}
                onPress={() => undefined}
                accessibilityRole="link"
              >
                Privacy Policy
              </Text>
            </Text>
          </FadeBlock>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.lights,
    overflow: 'hidden',
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  main: {
    width: '100%',
    alignItems: 'center',
    maxWidth: 420,
    alignSelf: 'center',
  },
  welcomeBlock: {
    marginTop: 28,
    marginBottom: 32,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 34,
    color: colors.darker,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    fontFamily: fonts.medium,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
  },
  form: {
    width: '100%',
    gap: 14,
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginTop: -4,
    marginBottom: 2,
  },
  forgot: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.darker,
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
    backgroundColor: colors.border,
  },
  dividerText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    letterSpacing: 1,
    color: colors.textPlaceholder,
  },
  createRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  createPrompt: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  createLink: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.marigold,
  },
  footer: {
    marginTop: 32,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  footerText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  footerLink: {
    color: colors.darker,
    textDecorationLine: 'underline',
  },
});
