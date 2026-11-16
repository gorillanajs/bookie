import { getShareExtensionKey } from 'expo-share-intent';

/**
 * The iOS share extension opens the app with `bookie://dataUrl=bookieShareKey…`,
 * which isn't a route. Send it to the home screen; <ShareIntentHandler /> then
 * reads the shared page and opens the save sheet.
 */
export function redirectSystemPath({ path }: { path: string; initial: boolean }) {
  try {
    if (path.includes(`dataUrl=${getShareExtensionKey()}`)) return '/';
    return path;
  } catch {
    return '/';
  }
}
