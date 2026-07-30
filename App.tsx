import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Raleway_400Regular,
  Raleway_500Medium,
  Raleway_600SemiBold,
  Raleway_700Bold,
} from '@expo-google-fonts/raleway';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { CreateAccountScreen } from './src/screens/CreateAccountScreen';
import { UpdateAvailableModal } from './src/components/UpdateAvailableModal';
import { HardRefreshButton } from './src/components/HardRefreshButton';
import {
  TransitionHost,
  type TransitionDirection,
} from './src/components/ScreenTransition';
import { useAppUpdate } from './src/hooks/useAppUpdate';
import { colors, fonts } from './src/theme';

if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync().catch(() => undefined);
}

type Route = 'boot' | 'welcome' | 'login' | 'signup';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Raleway_400Regular,
    Raleway_500Medium,
    Raleway_600SemiBold,
    Raleway_700Bold,
    'Gropled-Bold': require('./assets/fonts/Gropled-Bold.otf'),
  });
  const [timedOut, setTimedOut] = useState(false);
  const [route, setRoute] = useState<Route>('boot');
  const [navDirection, setNavDirection] = useState<TransitionDirection>('none');
  const update = useAppUpdate();

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const fontsReady = fontsLoaded || !!fontError || timedOut;

  useEffect(() => {
    if (!fontsReady) return;
    setNavDirection('none');
    setRoute('welcome');
    if (Platform.OS !== 'web') {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [fontsReady]);

  const goTo = (next: Route, direction: TransitionDirection) => {
    setNavDirection(direction);
    setRoute(next);
  };

  if (!fontsReady || route === 'boot') {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={BLUE} size="large" />
      </View>
    );
  }

  const screen =
    route === 'welcome' ? (
      <WelcomeScreen
        onGetStarted={() => goTo('signup', 'forward')}
        onHaveAccount={() => goTo('login', 'forward')}
      />
    ) : route === 'signup' ? (
      <CreateAccountScreen
        onDone={() => goTo('welcome', 'back')}
        onCancel={() => goTo('welcome', 'back')}
        onSkip={() => goTo('welcome', 'back')}
        onGoogle={() => {
          Alert.alert('Google', 'Google sign-in will be available soon.');
        }}
      />
    ) : (
      <PlaceholderScreen
        title="Welcome back"
        subtitle="Login screen coming next."
        onBack={() => goTo('welcome', 'back')}
      />
    );

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <TransitionHost routeKey={route} direction={navDirection}>
          {screen}
        </TransitionHost>
        <HardRefreshButton />
        <UpdateAvailableModal
          update={update}
          onUpdate={update.applyUpdate}
          onLater={update.dismiss}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const BLUE = '#004CFF';

function PlaceholderScreen({
  title,
  subtitle,
  onBack,
}: {
  title: string;
  subtitle: string;
  onBack: () => void;
}) {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderTitle}>{title}</Text>
      <Text style={styles.placeholderSubtitle}>{subtitle}</Text>
      <Text style={styles.backLink} onPress={onBack}>
        ← Back to welcome
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    ...(Platform.OS === 'web'
      ? ({ minHeight: '100vh', height: '100%' } as object)
      : null),
  },
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    ...(Platform.OS === 'web'
      ? ({ minHeight: '100vh', height: '100%' } as object)
      : null),
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  placeholderTitle: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.darker,
  },
  placeholderSubtitle: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  backLink: {
    marginTop: 18,
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: BLUE,
  },
});
