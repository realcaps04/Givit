import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'givit:lastRoute';

export type AppRoute = 'welcome' | 'login' | 'signup' | 'forgot' | 'forgot-otp' | 'home';

const VALID: AppRoute[] = ['welcome', 'login', 'signup', 'forgot', 'forgot-otp', 'home'];

function isAppRoute(value: string | null | undefined): value is AppRoute {
  return !!value && (VALID as string[]).includes(value);
}

export async function saveRoute(route: AppRoute): Promise<void> {
  try {
    if (Platform.OS === 'web' && typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(KEY, route);
      return;
    }
    await AsyncStorage.setItem(KEY, route);
  } catch {
    // ignore persistence failures
  }
}

export async function loadRoute(): Promise<AppRoute | null> {
  try {
    if (Platform.OS === 'web' && typeof sessionStorage !== 'undefined') {
      const value = sessionStorage.getItem(KEY);
      return isAppRoute(value) ? value : null;
    }
    const value = await AsyncStorage.getItem(KEY);
    return isAppRoute(value) ? value : null;
  } catch {
    return null;
  }
}
