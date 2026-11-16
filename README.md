# Bookie

A minimal bookmark saver built with Expo (SDK 58), TypeScript and Expo Router.
Save web pages for later, file them in collections and sort them.

```bash
npm start        # dev server (press i / a / w)
npx tsc --noEmit # typecheck
npx expo lint    # lint
```

## Structure

```
src/
  app/                      Routes (Expo Router) — every file is a screen
    _layout.tsx             Root stack, theme, store provider, splash handling
    (tabs)/                 Tab navigator
      index.tsx             Saved: all pages, sortable
      collections.tsx       Collections list + create
      settings.tsx          Library stats, reset
    collection/[id].tsx     One collection (or `unsorted`)
    add.tsx                 Modal: save a page
    bookmark/[id].tsx       Modal: edit / move / delete a page
  components/
    ui/                     Primitives: Text, Icon, IconButton, Chip, Screen, EmptyState
    bookmarks/              BookmarkRow, BookmarkList, BookmarkForm, SortBar
    collections/            CollectionRow
  constants/theme.ts        Color tokens (light/dark), spacing, radius, type scale
  hooks/                    useColorScheme, useTheme
  lib/                      Pure helpers: url, sort, storage, id, confirm
  store/BookmarksProvider   Reducer + context, persisted to AsyncStorage
  types/                    Bookmark, Collection, SortKey
```

Tap a page to open it in the in-app browser; long-press to edit, move it to another collection, or delete it.

## Sharing pages from the browser

Bookie appears in the system share sheet (iOS Share Extension, Android `SEND`
intent) via [`expo-share-intent`](https://github.com/achorein/expo-share-intent).
Sharing a page opens the save sheet pre-filled with its link and title, so you
can pick a collection.

This is native code, so it **does not work in Expo Go**. Use a development build:

```bash
npx expo prebuild --clean   # generates ios/ and android/ (don't edit or commit them)
npx expo run:android        # or: npx expo run:ios (macOS)
# or in the cloud: npx eas-cli@latest build --profile development
```

Deep links work too: `bookie://add?url=https://example.com&title=Example`.

The bundle identifier / Android package is `com.mgnssan.bookie` (`app.json`). Don't change it after
the first store upload — stores treat a new ID as a different app.

## Type

All display text uses JetBrains Mono Nerd Font in caps (`assets/fonts`, SIL OFL 1.1,
see `JetBrainsMono-OFL.txt`). Text fields keep normal casing.

## App icon & splash

`assets/images/` icons and splash images are generated from SVG by
`scripts/generate-icons.mjs` (bookmark ribbon + collection dot, JetBrains Mono wordmark).
Edit the script and re-run it rather than hand-editing the PNGs:

```bash
npm install --no-save puppeteer-core@23.11.1 && node scripts/generate-icons.mjs . assets/images
```

The App Store icon (`icon.png`) must stay opaque (no alpha channel).

## App Store listing

The store name is **Bookie: Read Later** (the home-screen name stays "Bookie", from `app.json`).
Title, subtitle, description, keywords, category and review notes live in `store.config.json`
and are uploaded with:

```bash
npx eas-cli@latest metadata:push
```

Still to add before submitting: `privacyPolicyUrl` and `supportUrl` (under `apple.info.en-US`),
`copyright`, and review contact details (`apple.review`).
