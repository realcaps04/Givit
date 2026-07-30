import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import { BUILD_STAMP } from '../config/buildStamp';

export type RemoteVersion = {
  version: string;
  buildId: string;
  forceUpdate?: boolean;
  notes?: string;
  releasedAt?: string;
};

export type UpdateInfo = {
  available: boolean;
  force: boolean;
  remote: RemoteVersion | null;
  local: { version: string; buildId: string };
};

const CHECK_MS = 60_000;

function parseParts(v: string): number[] {
  return v
    .replace(/^v/i, '')
    .split('.')
    .map((p) => parseInt(p.replace(/\D/g, ''), 10) || 0);
}

/** Returns true if remote semver is newer than local */
export function isNewerVersion(remote: string, local: string): boolean {
  const a = parseParts(remote);
  const b = parseParts(local);
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i += 1) {
    const rv = a[i] ?? 0;
    const lv = b[i] ?? 0;
    if (rv > lv) return true;
    if (rv < lv) return false;
  }
  return false;
}

function needsUpdate(remote: RemoteVersion): boolean {
  if (!remote?.version || !remote?.buildId) return false;
  if (remote.buildId !== BUILD_STAMP.buildId && remote.buildId !== 'dev') {
    // Different deploy stamp → update available (production builds)
    if (BUILD_STAMP.buildId === 'dev') {
      // In local/dev, only treat as update when remote version is higher
      return isNewerVersion(remote.version, BUILD_STAMP.version);
    }
    return true;
  }
  return isNewerVersion(remote.version, BUILD_STAMP.version);
}

async function fetchRemoteVersion(): Promise<RemoteVersion | null> {
  if (Platform.OS !== 'web' || typeof fetch === 'undefined') return null;
  try {
    const res = await fetch(`/version.json?t=${Date.now()}`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    return (await res.json()) as RemoteVersion;
  } catch {
    return null;
  }
}

export async function applyAppUpdate(): Promise<void> {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;

  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        regs.map(async (reg) => {
          reg.active?.postMessage({ type: 'GIVIT_CLEAR_CACHES' });
          reg.waiting?.postMessage({ type: 'GIVIT_SKIP_WAITING' });
          await reg.unregister();
        }),
      );
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } catch {
    // continue to reload even if cache clear fails
  }

  const url = new URL(window.location.href);
  url.searchParams.set('_givit_update', String(Date.now()));
  window.location.replace(url.toString());
}

export function useAppUpdate(): UpdateInfo & {
  dismiss: () => void;
  applyUpdate: () => Promise<void>;
  checkNow: () => Promise<void>;
} {
  const [remote, setRemote] = useState<RemoteVersion | null>(null);
  const [dismissedBuild, setDismissedBuild] = useState<string | null>(null);
  const checking = useRef(false);

  const checkNow = useCallback(async () => {
    if (Platform.OS !== 'web' || checking.current) return;
    checking.current = true;
    try {
      const next = await fetchRemoteVersion();
      if (next) setRemote(next);
    } finally {
      checking.current = false;
    }
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    checkNow();
    const interval = setInterval(checkNow, CHECK_MS);

    const onFocus = () => checkNow();
    const onVisible = () => {
      if (document.visibilityState === 'visible') checkNow();
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('givit-sw-update', onFocus);

    let removeSwListener: (() => void) | undefined;
    if ('serviceWorker' in navigator) {
      const onMessage = (event: MessageEvent) => {
        if (event.data?.type === 'GIVIT_SW_ACTIVATED') checkNow();
      };
      navigator.serviceWorker.addEventListener('message', onMessage);
      removeSwListener = () => navigator.serviceWorker.removeEventListener('message', onMessage);

      navigator.serviceWorker.ready
        .then((reg) => {
          reg.update().catch(() => undefined);
        })
        .catch(() => undefined);
    }

    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') checkNow();
    });

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('givit-sw-update', onFocus);
      removeSwListener?.();
      sub.remove();
    };
  }, [checkNow]);

  const available = remote ? needsUpdate(remote) : false;
  const force = Boolean(remote?.forceUpdate) && available;
  const dismissed =
    !force && dismissedBuild != null && remote != null && dismissedBuild === remote.buildId;

  return {
    available: available && !dismissed,
    force,
    remote,
    local: { version: BUILD_STAMP.version, buildId: BUILD_STAMP.buildId },
    dismiss: () => {
      if (remote?.buildId) setDismissedBuild(remote.buildId);
    },
    applyUpdate: applyAppUpdate,
    checkNow,
  };
}
