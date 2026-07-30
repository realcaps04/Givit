import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, View } from 'react-native';
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
import { LoginScreen } from './src/screens/LoginScreen';
import { ForgotPasswordScreen } from './src/screens/ForgotPasswordScreen';
import {
  PasswordRecoveryOtpScreen,
  type RecoveryChannel,
} from './src/screens/PasswordRecoveryOtpScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { UpdateAvailableModal } from './src/components/UpdateAvailableModal';
import {
  TransitionHost,
  type TransitionDirection,
} from './src/components/ScreenTransition';
import { useAppUpdate } from './src/hooks/useAppUpdate';
import { loadRoute, saveRoute, type AppRoute } from './src/navigation/routePersistence';

if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync().catch(() => undefined);
}

type Route = 'boot' | AppRoute;

type RecoveryContext = {
  channel: RecoveryChannel;
  destination: string;
};

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
  const [recovery, setRecovery] = useState<RecoveryContext>({
    channel: 'sms',
    destination: '+91*******00',
  });
  const update = useAppUpdate();

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const fontsReady = fontsLoaded || !!fontError || timedOut;

  useEffect(() => {
    if (!fontsReady) return;
    let cancelled = false;

    (async () => {
      const saved = await loadRoute();
      if (cancelled) return;
      setNavDirection('none');
      setRoute(saved ?? 'welcome');
      if (Platform.OS !== 'web') {
        SplashScreen.hideAsync().catch(() => undefined);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fontsReady]);

  useEffect(() => {
    if (route === 'boot') return;
    void saveRoute(route);
  }, [route]);

  const goTo = (next: AppRoute, direction: TransitionDirection) => {
    void saveRoute(next);
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

  const googleSoon = () => {
    Alert.alert('Google', 'Google sign-in will be available soon.');
  };

  const screen =
    route === 'welcome' ? (
      <WelcomeScreen
        onGetStarted={() => goTo('signup', 'forward')}
        onHaveAccount={() => goTo('login', 'forward')}
      />
    ) : route === 'signup' ? (
      <CreateAccountScreen
        onDone={() => goTo('home', 'forward')}
        onCancel={() => goTo('welcome', 'back')}
        onSkip={() => goTo('home', 'forward')}
        onGoogle={googleSoon}
      />
    ) : route === 'forgot' ? (
      <ForgotPasswordScreen
        onNext={(method) => {
          setRecovery({
            channel: method,
            destination: method === 'sms' ? '+91*******00' : 'y***@email.com',
          });
          goTo('forgot-otp', 'forward');
        }}
        onCancel={() => goTo('login', 'back')}
      />
    ) : route === 'forgot-otp' ? (
      <PasswordRecoveryOtpScreen
        channel={recovery.channel}
        destination={recovery.destination}
        onVerified={() => {
          Alert.alert('Verified', 'OTP accepted. Password reset will continue next.');
          goTo('login', 'back');
        }}
        onSendAgain={() => undefined}
        onCancel={() => goTo('forgot', 'back')}
      />
    ) : route === 'home' ? (
      <HomeScreen />
    ) : (
      <LoginScreen
        onLogin={() => goTo('home', 'forward')}
        onCancel={() => goTo('welcome', 'back')}
        onSkip={() => goTo('home', 'forward')}
        onGoogle={googleSoon}
        onCreateAccount={() => goTo('signup', 'forward')}
        onForgotPassword={() => goTo('forgot', 'forward')}
      />
    );

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <TransitionHost routeKey={route} direction={navDirection}>
          {screen}
        </TransitionHost>
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
});
