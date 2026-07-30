import { useEffect, useRef } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInput as TextInputType,
} from 'react-native';
import { fonts } from '../theme';

const BLUE = '#004CFF';
const DOT = 'rgba(0, 76, 255, 0.16)';
const DOT_FILLED = '#004CFF';
const ERROR = '#E11D48';

type OtpDotsInputProps = {
  length?: number;
  value: string;
  onChange: (code: string) => void;
  error?: string;
  autoFocus?: boolean;
};

/**
 * 4-dot OTP UI with a single invisible input.
 * Autofill: textContentType oneTimeCode + autoComplete sms-otp / one-time-code.
 */
export function OtpDotsInput({
  length = 4,
  value,
  onChange,
  error,
  autoFocus = true,
}: OtpDotsInputProps) {
  const inputRef = useRef<TextInputType>(null);
  const digits = value.replace(/\D/g, '').slice(0, length);

  useEffect(() => {
    if (autoFocus) {
      const t = setTimeout(() => inputRef.current?.focus(), 280);
      return () => clearTimeout(t);
    }
  }, [autoFocus]);

  const focusInput = () => inputRef.current?.focus();

  return (
    <View style={styles.wrap}>
      <Pressable onPress={focusInput} style={styles.row} accessibilityRole="none">
        {Array.from({ length }).map((_, i) => {
          const filled = Boolean(digits[i]);
          return (
            <View
              key={i}
              style={[styles.dot, filled ? styles.dotFilled : null, error ? styles.dotError : null]}
            >
              {filled ? <Text style={styles.digit}>{digits[i]}</Text> : null}
            </View>
          );
        })}
      </Pressable>

      <TextInput
        ref={inputRef}
        value={digits}
        onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
        importantForAutofill="yes"
        autoCorrect={false}
        caretHidden
        maxLength={length}
        style={styles.hiddenInput}
        accessibilityLabel="One-time code"
        {...(Platform.OS === 'web'
          ? ({
              autoComplete: 'one-time-code',
              inputMode: 'numeric',
              autocomplete: 'one-time-code',
            } as object)
          : null)}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    paddingVertical: 8,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: DOT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotFilled: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: DOT_FILLED,
  },
  dotError: {
    backgroundColor: 'rgba(225, 29, 72, 0.35)',
  },
  digit: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: '#FFFFFF',
  },
  hiddenInput: {
    ...StyleSheet.absoluteFill,
    opacity: 0.02,
    color: 'transparent',
    ...(Platform.OS === 'web'
      ? ({
          outlineStyle: 'none',
          caretColor: 'transparent',
        } as object)
      : null),
  },
  errorText: {
    marginTop: 10,
    fontFamily: fonts.regular,
    fontSize: 12,
    color: ERROR,
    textAlign: 'center',
  },
});
