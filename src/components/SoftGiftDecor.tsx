import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

const useNative = Platform.OS !== 'web';

/** Soft greys only */
const A = '#EDEDF1';
const B = '#E2E2E8';
const C = '#F3F3F6';
const D = '#D8D8E0';
const LINE = '#D2D2DA';

type ShapeKind = 'box' | 'bow' | 'tag' | 'ribbon' | 'parcel' | 'spark';

type Floater = {
  id: string;
  kind: ShapeKind;
  size: number;
  x: number;
  spawnOffset: number;
  driftX: number;
  duration: number;
  delay: number;
  opacity: number;
  rotate: number;
};

function SoftShape({ kind, size }: { kind: ShapeKind; size: number }) {
  if (kind === 'bow') {
    return (
      <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <Path
          d="M20 22c-7-9-14-8-14 0 0 4 7 7 14 10 7-3 14-6 14-10 0-8-7-9-14 0Z"
          fill={A}
          stroke={LINE}
          strokeWidth={1}
        />
        <Circle cx="20" cy="21" r="2.4" fill={D} />
      </Svg>
    );
  }

  if (kind === 'tag') {
    return (
      <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <Path
          d="M8 16 L22 8 L32 22 L18 30 Z"
          fill={C}
          stroke={LINE}
          strokeWidth={1}
        />
        <Circle cx="14" cy="16" r="2" fill={D} />
      </Svg>
    );
  }

  if (kind === 'ribbon') {
    return (
      <Svg width={size} height={size} viewBox="0 0 48 24" fill="none">
        <Path
          d="M4 12c6-8 12-8 18 0 6 8 12 8 18 0"
          stroke={D}
          strokeWidth={2.2}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M4 16c6-6 12-6 18 0 6 6 12 6 18 0"
          stroke={LINE}
          strokeWidth={1.4}
          strokeLinecap="round"
          fill="none"
          opacity={0.7}
        />
      </Svg>
    );
  }

  if (kind === 'parcel') {
    return (
      <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <Rect x="8" y="12" width="24" height="20" rx="3" fill={B} stroke={LINE} strokeWidth={1} />
        <Path d="M8 18h24" stroke={LINE} strokeWidth={1.2} />
        <Path d="M20 12v20" stroke={D} strokeWidth={1.5} strokeLinecap="round" />
      </Svg>
    );
  }

  if (kind === 'spark') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Ellipse cx="12" cy="12" rx="3.5" ry="3.5" fill={A} />
        <Path d="M12 3v3.5M12 17.5V21M3 12h3.5M17.5 12H21" stroke={D} strokeWidth={1.4} strokeLinecap="round" />
      </Svg>
    );
  }

  // soft open box — not the brand stacked-gift mark
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path d="M8 16 L20 10 L32 16 L20 22 Z" fill={C} stroke={LINE} strokeWidth={1} />
      <Path d="M8 16 V28 L20 34 V22 Z" fill={A} stroke={LINE} strokeWidth={1} />
      <Path d="M32 16 V28 L20 34 V22 Z" fill={B} stroke={LINE} strokeWidth={1} />
    </Svg>
  );
}

function FlowingPiece({ item, height }: { item: Floater; height: number }) {
  const progress = useRef(new Animated.Value(0)).current;
  const appear = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(appear, {
      toValue: 1,
      duration: 600,
      delay: item.delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: useNative,
    }).start();

    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: item.duration,
        easing: Easing.linear,
        useNativeDriver: useNative,
      }),
    );

    const t = setTimeout(() => {
      progress.setValue(0);
      loop.start();
    }, item.delay);

    return () => {
      clearTimeout(t);
      loop.stop();
    };
  }, [appear, progress, item.delay, item.duration]);

  // Always enter from below the fold, then rise off the top
  const fromY = height + 24 + item.spawnOffset;
  const toY = -item.size - 48;

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [fromY, toY],
  });

  const translateX = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, item.driftX, item.driftX * 0.35],
  });

  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [`${item.rotate}deg`, `${item.rotate + 18}deg`],
  });

  const fade = progress.interpolate({
    inputRange: [0, 0.08, 0.78, 1],
    outputRange: [0, item.opacity, item.opacity * 0.85, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.piece,
        {
          top: 0,
          left: `${item.x}%`,
          opacity: Animated.multiply(appear, fade),
          transform: [{ translateY }, { translateX }, { rotate }],
        },
      ]}
    >
      <SoftShape kind={item.kind} size={item.size} />
    </Animated.View>
  );
}

function buildFloaters(count: number): Floater[] {
  const kinds: ShapeKind[] = ['box', 'bow', 'tag', 'ribbon', 'parcel', 'spark', 'box', 'bow', 'parcel', 'spark'];
  const sizes = [22, 28, 34, 40, 26, 48, 30, 36, 24, 42];
  return Array.from({ length: count }, (_, i) => {
    const col = i % 5;
    return {
      id: `f-${i}`,
      kind: kinds[i % kinds.length],
      size: sizes[i % sizes.length],
      x: 6 + col * 20 + ((i * 7) % 9) - 4,
      spawnOffset: (i % 6) * 36,
      driftX: i % 2 === 0 ? 18 + (i % 5) * 4 : -(16 + (i % 4) * 5),
      duration: 14000 + (i % 6) * 2200,
      delay: (i % 8) * 450,
      opacity: 0.35 + (i % 5) * 0.08,
      rotate: (i % 7) * 8 - 20,
    };
  });
}

/** Soft grey gift motifs flowing through the welcome background */
export function SoftGiftDecor() {
  const { height } = useWindowDimensions();
  const floaters = useMemo(() => buildFloaters(14), []);

  return (
    <View pointerEvents="none" style={styles.layer}>
      {/* soft veil so icons stay whisper-light */}
      <View style={styles.veil} />
      {floaters.map((item) => (
        <FlowingPiece key={item.id} item={item} height={height} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
    zIndex: 0,
  },
  veil: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  piece: {
    position: 'absolute',
    marginLeft: -16,
  },
});
