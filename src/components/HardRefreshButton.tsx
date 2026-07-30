import { useState } from 'react';
import {
  ActivityIndicator,
  DevSettings,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { applyAppUpdate } from '../hooks/useAppUpdate';
import { saveRoute, type AppRoute } from '../navigation/routePersistence';

const ICON = '#8A8A96';

function RefreshIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 12a9 9 0 1 1-2.6-6.3"
        stroke={ICON}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M21 3v6h-6"
        stroke={ICON}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

type HardRefreshButtonProps = {
  route: AppRoute;
};

/** Testing control — hard-reloads the UI while keeping the current page */
export function HardRefreshButton({ route }: HardRefreshButtonProps) {
  const insets = useSafeAreaInsets();
  const [busy, setBusy] = useState(false);

  const hardRefresh = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await saveRoute(route);
      if (Platform.OS === 'web') {
        await applyAppUpdate();
        return;
      }
      if (typeof DevSettings?.reload === 'function') {
        DevSettings.reload();
        return;
      }
    } finally {
      setTimeout(() => setBusy(false), 1200);
    }
  };

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.host,
        {
          top: Math.max(insets.top, 8) + 6,
          left: 14,
        },
      ]}
    >
      <Pressable
        onPress={hardRefresh}
        accessibilityRole="button"
        accessibilityLabel="Hard refresh UI"
        hitSlop={10}
        style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
      >
        {busy ? <ActivityIndicator size="small" color={ICON} /> : <RefreshIcon />}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    zIndex: 50,
  },
  btn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 245, 248, 0.92)',
    ...(Platform.OS === 'web'
      ? ({ boxShadow: '0 4px 14px rgba(0,0,0,0.08)' } as object)
      : {
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 3 },
          elevation: 3,
        }),
  },
  pressed: {
    opacity: 0.75,
  },
});
