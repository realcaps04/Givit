import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { colors, fonts } from './src/theme';

const WELCOME_SEEN_KEY = 'givit_welcome_seen';

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

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const fontsReady = fontsLoaded || !!fontError || timedOut;

  useEffect(() => {
    if (!fontsReady) return;

    // Always open on Welcome until real auth exists.
    // Clear any leftover skip flag from earlier sessions.
    AsyncStorage.removeItem(WELCOME_SEEN_KEY).catch(() => undefined);
    setRoute('welcome');

    if (Platform.OS !== 'web') {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [fontsReady]);

  if (!fontsReady || route === 'boot') {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.marigold} size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        {route === 'welcome' ? (
          <WelcomeScreen
            onGetStarted={() => setRoute('signup')}
            onHaveAccount={() => setRoute('login')}
          />
        ) : (
          <PlaceholderScreen
            title={route === 'signup' ? 'Create Account' : 'Welcome back'}
            subtitle={
              route === 'signup'
                ? 'Sign-up screen coming next.'
                : 'Login screen coming next.'
            }
            onBack={() => setRoute('welcome')}
          />
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

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
    backgroundColor: colors.lights,
    ...(Platform.OS === 'web'
      ? ({ minHeight: '100vh', height: '100%' } as object)
      : null),
  },
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lights,
    ...(Platform.OS === 'web'
      ? ({ minHeight: '100vh', height: '100%' } as object)
      : null),
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: colors.lights,
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
    color: colors.marigold,
  },
});
