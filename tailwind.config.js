// Thin divider/border width. NativeWind's hairlineWidth()/platformSelect() emit empty
// rules on web, so use a plain value that renders the same everywhere.
const hairline = '0.5px';

// Colors resolve to CSS variables set per color scheme in src/components/ThemeRoot.tsx,
// so `bg-canvas`, `text-fg`, etc. switch automatically between light and dark.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  // Light/dark switching goes through CSS variables (ThemeRoot), not `dark:` variants.
  // 'class' also stops NativeWind throwing when something sets the color scheme manually.
  darkMode: 'class',
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        canvas: token('canvas'),
        surface: token('surface'),
        fg: token('fg'),
        muted: token('muted'),
        faint: token('faint'),
        line: token('line'),
        accent: token('accent'),
        'on-accent': token('on-accent'),
        danger: token('danger'),
      },
      fontFamily: {
        // JetBrains Mono Nerd Font, one family per weight (Android ignores fontWeight for custom fonts).
        body: ['JetBrainsMonoNerd'],
        display: ['JetBrainsMonoNerd-Bold'],
      },
      fontSize: {
        title: ['24px', { letterSpacing: '3px' }],
        heading: ['14px', { letterSpacing: '1.2px' }],
        body: ['14px', { letterSpacing: '0.8px' }],
        caption: ['11px', { letterSpacing: '1.2px' }],
        label: ['10px', { letterSpacing: '2.4px' }],
        input: ['14px', { letterSpacing: '0.3px' }],
      },
      borderWidth: { hairline },
      height: { hairline },
    },
  },
  plugins: [],
};
