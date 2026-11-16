This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## Styling

Style all components with **NativeWind (Tailwind CSS v3) utility classes** via `className`.
Do not add `StyleSheet.create` or inline `style` objects for component styling.

- Color tokens: `canvas`, `surface`, `fg`, `muted`, `faint`, `line`, `accent`, `on-accent`, `danger`
  (e.g. `bg-canvas`, `text-muted`, `border-line`). They're CSS variables set by
  `src/components/ThemeRoot.tsx` from `src/constants/theme.ts`, so light/dark switches
  automatically. Don't use `dark:` variants for these.
- Type: use `<Text variant="title|heading|body|caption|label" tone="…">` from
  `src/components/ui/Text.tsx` (fonts `font-display`/`font-body`, sizes `text-title`…`text-label`).
- Use `border-hairline` / `h-hairline` for thin borders and dividers, and `active:` for pressed
  states on `Pressable`.
- Safe areas: don't use NativeWind's `pt-safe`/`pb-safe` (they don't apply on device). Use
  `useSafeAreaInsets()` and apply the inset inline, as in `src/components/ui/Screen.tsx`.
- Join conditional classes with `cn()` from `src/lib/cn.ts`. There's no tailwind-merge, so don't rely
  on a later class overriding an earlier conflicting one; add a prop instead (see `TextField`'s `bare`).
- Allowed exceptions (APIs that take values, not classes): icon `color`/`tintColor`,
  `placeholderTextColor`, navigator `screenOptions`, safe-area insets, and data-driven colors such as a collection's
  color dot (`style={{ backgroundColor: collection.color }}`). Read raw colors with `useTheme()`.
- Tailwind config: `tailwind.config.js`; restart Metro with `--clear` after changing it.
