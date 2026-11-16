import { router } from 'expo-router';
import { useShareIntentContext } from 'expo-share-intent';
import { useEffect } from 'react';

import { getSharedPage } from '@/lib/share';

/**
 * Listens for pages shared to Bookie from a browser (or any app) through the
 * system share sheet, and opens the save sheet pre-filled with that page.
 */
export function ShareIntentHandler() {
  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntentContext();

  useEffect(() => {
    if (!hasShareIntent) return;
    const page = getSharedPage(shareIntent);
    resetShareIntent();
    if (page) router.push({ pathname: '/add', params: page });
  }, [hasShareIntent, shareIntent, resetShareIntent]);

  return null;
}
