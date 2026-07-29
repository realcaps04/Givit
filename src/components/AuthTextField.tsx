import { useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { Eye, EyeOff, type LucideIcon } from 'lucide-react-native';
import { colors, fonts, radii } from '../theme';

type AuthTextFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: LucideIcon;
  error?: string;
  secureTextEntry?: boolean;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'secureTextEntry'>;

export function AuthTextField({
  label,
  value,
  onChangeText,
  icon: Icon,
  error,
  secureTextEntry = false,
  ...inputProps
}: AuthTextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secureTextEntry);
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  const animateLabel = (toValue: number) => {
    Animated.timing(labelAnim, {
      toValue,
      duration: 160,
      useNativeDriver: false,
    }).start();
  };

  const handleFocus = () => {
    setFocused(true);
    animateLabel(1);
  };

  const handleBlur = () => {
    setFocused(false);
    if (!value) {
      animateLabel(0);
    }
  };

  const labelTop = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [18, 6],
  });
  const labelSize = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [15, 11],
  });

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.field,
          focused && styles.fieldFocused,
          !!error && styles.fieldError,
        ]}
      >
        <Icon
          size={20}
          color={error ? colors.error : focused ? colors.marigold : colors.textPlaceholder}
          strokeWidth={1.75}
          style={styles.leadingIcon}
        />
        <View style={styles.inputArea}>
          <Animated.Text
            style={[
              styles.label,
              {
                top: labelTop,
                fontSize: labelSize,
                color: error
                  ? colors.error
                  : focused
                    ? colors.marigold
                    : colors.textPlaceholder,
              },
            ]}
            pointerEvents="none"
          >
            {label}
          </Animated.Text>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            secureTextEntry={hidden}
            placeholder=""
            placeholderTextColor={colors.textPlaceholder}
            style={styles.input}
            selectionColor={colors.marigold}
            accessibilityLabel={label}
            {...inputProps}
          />
        </View>
        {secureTextEntry ? (
          <Pressable
            onPress={() => setHidden((prev) => !prev)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            style={styles.trailingIcon}
          >
            {hidden ? (
              <EyeOff size={20} color={colors.textPlaceholder} strokeWidth={1.75} />
            ) : (
              <Eye size={20} color={colors.textPlaceholder} strokeWidth={1.75} />
            )}
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  field: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.control,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
  },
  fieldFocused: {
    borderColor: colors.marigold,
  },
  fieldError: {
    borderColor: colors.error,
  },
  leadingIcon: {
    marginRight: 10,
  },
  trailingIcon: {
    marginLeft: 8,
    padding: 2,
  },
  inputArea: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingTop: 14,
    paddingBottom: 8,
  },
  label: {
    position: 'absolute',
    left: 0,
    fontFamily: fonts.medium,
  },
  input: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.textPrimary,
    padding: 0,
    margin: 0,
    minHeight: 22,
  },
  error: {
    marginTop: 6,
    marginLeft: 8,
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.error,
  },
});
