import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ROUTE_KEY = 'givit:lastRoute';
const HOME_KEY = 'givit:homeNav';

export type AppRoute = 'welcome' | 'login' | 'signup' | 'forgot' | 'forgot-otp' | 'home';

export type HomeTabKey = 'home' | 'categories' | 'exclusives' | 'profile';

export type HomeNavState = {
  tab: HomeTabKey;
  category: string;
  productId: string | null;
  cartOpen: boolean;
  exclusiveId: string | null;
  cart: { id: string; qty: number }[];
};

const VALID_ROUTES: AppRoute[] = [
  'welcome',
  'login',
  'signup',
  'forgot',
  'forgot-otp',
  'home',
];

const VALID_TABS: HomeTabKey[] = ['home', 'categories', 'exclusives', 'profile'];

export const DEFAULT_HOME_NAV: HomeNavState = {
  tab: 'home',
  category: 'Gifts',
  productId: null,
  cartOpen: false,
  exclusiveId: null,
  cart: [],
};

function isAppRoute(value: string | null | undefined): value is AppRoute {
  return !!value && (VALID_ROUTES as string[]).includes(value);
}

function isHomeTab(value: string | null | undefined): value is HomeTabKey {
  return !!value && (VALID_TABS as string[]).includes(value);
}

function webHashPath(): string {
  if (typeof window === 'undefined') return '';
  return window.location.hash.replace(/^#\/?/, '').replace(/\/+$/, '');
}

function setWebHash(path: string) {
  if (typeof window === 'undefined') return;
  const next = `#/${path.replace(/^\/+/, '')}`;
  if (window.location.hash === next) return;
  // replaceState keeps refresh/history tidy without stacking entries for every tap
  const url = `${window.location.pathname}${window.location.search}${next}`;
  window.history.replaceState(null, '', url);
}

function routeFromHash(): AppRoute | null {
  const path = webHashPath();
  if (!path) return null;
  const top = path.split('/')[0];
  return isAppRoute(top) ? top : null;
}

function homeFromHash(): Partial<HomeNavState> | null {
  const path = webHashPath();
  if (!path.startsWith('home')) return null;

  const parts = path.split('/').filter(Boolean);
  // home | home/categories | home/product/:id | home/checkout | home/exclusives/:id
  const state: Partial<HomeNavState> = {};

  if (parts[1] === 'checkout') {
    state.cartOpen = true;
    state.tab = 'home';
    return state;
  }
  if (parts[1] === 'product' && parts[2]) {
    state.productId = parts[2];
    state.cartOpen = false;
    state.tab = 'home';
    return state;
  }
  if (parts[1] === 'exclusives' && parts[2]) {
    state.tab = 'exclusives';
    state.exclusiveId = parts[2];
    state.cartOpen = false;
    state.productId = null;
    return state;
  }
  if (isHomeTab(parts[1])) {
    state.tab = parts[1];
    state.cartOpen = false;
    state.productId = null;
    if (parts[1] !== 'exclusives') state.exclusiveId = null;
    return state;
  }

  state.tab = 'home';
  state.cartOpen = false;
  state.productId = null;
  state.exclusiveId = null;
  return state;
}

function hashForRoute(route: AppRoute, home?: HomeNavState | null): string {
  if (route !== 'home') return route;
  const h = home ?? DEFAULT_HOME_NAV;
  if (h.cartOpen) return 'home/checkout';
  if (h.productId) return `home/product/${h.productId}`;
  if (h.tab === 'exclusives' && h.exclusiveId) return `home/exclusives/${h.exclusiveId}`;
  if (h.tab !== 'home') return `home/${h.tab}`;
  return 'home';
}

export async function saveRoute(route: AppRoute, home?: HomeNavState | null): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      if (route === 'home' && home == null) {
        const path = webHashPath();
        if (!path.startsWith('home')) setWebHash('home');
      } else {
        setWebHash(hashForRoute(route, home));
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(ROUTE_KEY, route);
      }
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(ROUTE_KEY, route);
      }
      return;
    }
    await AsyncStorage.setItem(ROUTE_KEY, route);
  } catch {
    // ignore persistence failures
  }
}

export async function loadRoute(): Promise<AppRoute | null> {
  try {
    if (Platform.OS === 'web') {
      const fromHash = routeFromHash();
      if (fromHash) return fromHash;

      if (typeof sessionStorage !== 'undefined') {
        const session = sessionStorage.getItem(ROUTE_KEY);
        if (isAppRoute(session)) {
          setWebHash(hashForRoute(session));
          return session;
        }
      }
      if (typeof localStorage !== 'undefined') {
        const local = localStorage.getItem(ROUTE_KEY);
        if (isAppRoute(local)) {
          setWebHash(hashForRoute(local));
          return local;
        }
      }
      return null;
    }
    const value = await AsyncStorage.getItem(ROUTE_KEY);
    return isAppRoute(value) ? value : null;
  } catch {
    return null;
  }
}

function normalizeHome(raw: Partial<HomeNavState> | null | undefined): HomeNavState {
  const cart = Array.isArray(raw?.cart)
    ? raw!.cart
        .filter((c) => c && typeof c.id === 'string' && typeof c.qty === 'number')
        .map((c) => ({ id: c.id, qty: Math.max(1, Math.floor(c.qty)) }))
    : [];

  return {
    tab: isHomeTab(raw?.tab) ? raw!.tab : DEFAULT_HOME_NAV.tab,
    category: typeof raw?.category === 'string' && raw.category ? raw.category : DEFAULT_HOME_NAV.category,
    productId: typeof raw?.productId === 'string' ? raw.productId : null,
    cartOpen: !!raw?.cartOpen,
    exclusiveId: typeof raw?.exclusiveId === 'string' ? raw.exclusiveId : null,
    cart,
  };
}

export async function saveHomeNav(state: HomeNavState): Promise<void> {
  try {
    const normalized = normalizeHome(state);
    if (Platform.OS === 'web') {
      setWebHash(hashForRoute('home', normalized));
      const payload = JSON.stringify(normalized);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(HOME_KEY, payload);
        localStorage.setItem(ROUTE_KEY, 'home');
      }
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(HOME_KEY, payload);
        sessionStorage.setItem(ROUTE_KEY, 'home');
      }
      return;
    }
    await AsyncStorage.setItem(HOME_KEY, JSON.stringify(normalized));
    await AsyncStorage.setItem(ROUTE_KEY, 'home');
  } catch {
    // ignore
  }
}

export async function loadHomeNav(): Promise<HomeNavState> {
  try {
    let stored: Partial<HomeNavState> | null = null;

    if (Platform.OS === 'web') {
      if (typeof sessionStorage !== 'undefined') {
        const raw = sessionStorage.getItem(HOME_KEY);
        if (raw) stored = JSON.parse(raw) as Partial<HomeNavState>;
      }
      if (!stored && typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(HOME_KEY);
        if (raw) stored = JSON.parse(raw) as Partial<HomeNavState>;
      }
      const fromHash = homeFromHash();
      return normalizeHome({ ...stored, ...fromHash });
    }

    const raw = await AsyncStorage.getItem(HOME_KEY);
    if (raw) stored = JSON.parse(raw) as Partial<HomeNavState>;
    return normalizeHome(stored);
  } catch {
    return { ...DEFAULT_HOME_NAV };
  }
}
