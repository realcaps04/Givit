/** Client-side version — bump when shipping user-facing changes */
export const APP_VERSION = '1.0.1';

/** Set at build time by scripts/stamp-version.js (fallback for local dev) */
export const APP_BUILD_ID =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_BUILD_ID) || 'dev';
