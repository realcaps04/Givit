import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

const useNative = Platform.OS !== 'web';

export type TransitionDirection = 'forward' | 'back' | 'none';

type TransitionHostProps = {
  routeKey: string;
  direction: TransitionDirection;
  children: ReactNode;
};

/**
 * Smooth + snappy push/pop between screens (short slide, fade, tiny scale).
 * Keeps the outgoing screen painted until the animation completes.
 */
export function TransitionHost({ routeKey, direction, children }: TransitionHostProps) {
  const { width } = useWindowDimensions();
  const [current, setCurrent] = useState<{ key: string; node: ReactNode }>({
    key: routeKey,
    node: children,
  });
  const [outgoing, setOutgoing] = useState<ReactNode>(null);
  const progress = useRef(new Animated.Value(1)).current;
  const dirRef = useRef<TransitionDirection>(direction);
  const widthRef = useRef(width);
  const currentKeyRef = useRef(routeKey);
  widthRef.current = width;

  useEffect(() => {
    if (routeKey === currentKeyRef.current) {
      setCurrent({ key: routeKey, node: children });
      return;
    }

    dirRef.current = direction;
    setOutgoing(current.node);
    currentKeyRef.current = routeKey;
    setCurrent({ key: routeKey, node: children });
    progress.setValue(0);

    Animated.timing(progress, {
      toValue: 1,
      duration: direction === 'none' ? 0 : 300,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: useNative,
    }).start(({ finished }) => {
      if (finished) setOutgoing(null);
    });
    // Only kick animation when the route changes; children updates handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey]);

  useEffect(() => {
    if (routeKey === currentKeyRef.current) {
      setCurrent({ key: routeKey, node: children });
    }
  }, [children, routeKey]);

  const dir = dirRef.current;
  const w = widthRef.current;
  const enterX =
    dir === 'back'
      ? progress.interpolate({ inputRange: [0, 1], outputRange: [-w * 0.22, 0] })
      : progress.interpolate({ inputRange: [0, 1], outputRange: [w * 0.22, 0] });
  const exitX =
    dir === 'back'
      ? progress.interpolate({ inputRange: [0, 1], outputRange: [0, w * 0.18] })
      : progress.interpolate({ inputRange: [0, 1], outputRange: [0, -w * 0.14] });
  const enterOpacity = progress.interpolate({
    inputRange: [0, 0.45, 1],
    outputRange: [0, 1, 1],
  });
  const exitOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const enterScale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.985, 1],
  });

  return (
    <View style={styles.root}>
      {outgoing ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.layer,
            {
              opacity: exitOpacity,
              transform: [{ translateX: exitX }],
            },
          ]}
        >
          {outgoing}
        </Animated.View>
      ) : null}
      <Animated.View
        style={[
          styles.layer,
          {
            opacity: enterOpacity,
            transform: [{ translateX: enterX }, { scale: enterScale }],
          },
        ]}
      >
        {current.node}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  layer: {
    ...StyleSheet.absoluteFill,
  },
});
