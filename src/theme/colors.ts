/**
 * Givit brand palette — Marigold / Darker / Cultured / Lights
 */
export const colors = {
  marigold: '#FF7C0A',
  darker: '#120E00',
  cultured: '#F5F5F5',
  lights: '#FFFFFF',

  background: '#FFFFFF',
  secondaryBackground: '#F5F5F5',
  card: '#FFFFFF',
  primary: '#FF7C0A',
  ctaEnd: '#E86A00',
  textPrimary: '#120E00',
  textSecondary: '#6B665C',
  textPlaceholder: '#9A958A',
  border: '#E8E8E8',
  error: '#D32F2F',
  logo: '#FF7C0A',
} as const;

export type ColorName = keyof typeof colors;

/** Use only where interaction needs a soft corner */
export const radii = {
  control: 12,
  pill: 999,
} as const;
