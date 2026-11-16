/**
 * Color tokens. Components style with Tailwind classes (`bg-canvas`, `text-fg`, …),
 * which read these values as CSS variables (see ThemeRoot). Use the raw values
 * only where an API takes a color prop instead of a className — icon tints,
 * placeholder colors, navigator options.
 */
export const palette = {
  light: {
    canvas: '#FAFAF9',
    surface: '#FFFFFF',
    fg: '#1C1917',
    muted: '#78716C',
    faint: '#A8A29E',
    line: '#E7E5E4',
    accent: '#1C1917',
    onAccent: '#FAFAF9',
    danger: '#DC2626',
  },
  dark: {
    canvas: '#0C0A09',
    surface: '#1C1917',
    fg: '#F5F5F4',
    muted: '#A8A29E',
    faint: '#57534E',
    line: '#292524',
    accent: '#F5F5F4',
    onAccent: '#0C0A09',
    danger: '#F87171',
  },
} as const;

export type ThemeColors = { [K in keyof (typeof palette)['light']]: string };

/** Soft, desaturated tones used to tag collections. */
export const collectionColors = [
  '#E07A5F',
  '#81B29A',
  '#F2CC8F',
  '#5E81AC',
  '#9C89B8',
  '#3D405B',
] as const;

/** Font family names registered with useFonts; Tailwind maps `font-body` / `font-display` to these. */
export const fonts = {
  regular: 'JetBrainsMonoNerd',
  bold: 'JetBrainsMonoNerd-Bold',
} as const;

const toCssVar = (key: string) => `--${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;
const toRgbChannels = (hex: string) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(' ');

/** `{ '--on-accent': '250 250 249', … }` — the format tailwind.config.js expects. */
export function cssVariables(scheme: keyof typeof palette): Record<string, string> {
  return Object.fromEntries(
    Object.entries(palette[scheme]).map(([key, hex]) => [toCssVar(key), toRgbChannels(hex)]),
  );
}
