import { ActivityIndicator, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { fonts } from '../theme';
import type { UpdateInfo } from '../hooks/useAppUpdate';

const BLUE = '#004CFF';
const TITLE = '#000000';
const MUTED = '#6B6B76';

type UpdateAvailableModalProps = {
  update: UpdateInfo;
  onUpdate: () => Promise<void>;
  onLater: () => void;
};

export function UpdateAvailableModal({ update, onUpdate, onLater }: UpdateAvailableModalProps) {
  const insets = useSafeAreaInsets();
  const [busy, setBusy] = useState(false);

  if (!update.available) return null;

  const handleUpdate = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await onUpdate();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent>
      <View style={[styles.backdrop, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <View style={styles.card}>
          <Text style={styles.badge}>Update available</Text>
          <Text style={styles.title}>Get the latest Givit</Text>
          <Text style={styles.body}>
            {update.remote?.notes ||
              'A newer version is ready. Update now so features work correctly.'}
          </Text>
          {update.remote?.version ? (
            <Text style={styles.meta}>
              v{update.local.version} → v{update.remote.version}
            </Text>
          ) : null}

          <Pressable
            onPress={handleUpdate}
            disabled={busy}
            accessibilityRole="button"
            accessibilityLabel="Update now"
            style={({ pressed }) => [styles.primaryBtn, (pressed || busy) && styles.pressed]}
          >
            {busy ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryLabel}>Update now</Text>
            )}
          </Pressable>

          {!update.force ? (
            <Pressable
              onPress={onLater}
              disabled={busy}
              accessibilityRole="button"
              accessibilityLabel="Update later"
              style={({ pressed }) => [styles.laterBtn, pressed && styles.pressed]}
            >
              <Text style={styles.laterLabel}>Later</Text>
            </Pressable>
          ) : (
            <Text style={styles.forceHint}>This update is required to continue.</Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 14, 30, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 18,
    ...(Platform.OS === 'web'
      ? ({ boxShadow: '0 18px 48px rgba(0,0,0,0.18)' } as object)
      : {
          shadowColor: '#000',
          shadowOpacity: 0.18,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 12 },
          elevation: 10,
        }),
  },
  badge: {
    alignSelf: 'flex-start',
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: BLUE,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: TITLE,
    marginBottom: 8,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: MUTED,
    marginBottom: 10,
  },
  meta: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: '#8A8A96',
    marginBottom: 18,
  },
  primaryBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  laterBtn: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  laterLabel: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: MUTED,
  },
  forceHint: {
    marginTop: 12,
    textAlign: 'center',
    fontFamily: fonts.regular,
    fontSize: 12,
    color: MUTED,
  },
  pressed: {
    opacity: 0.88,
  },
});
