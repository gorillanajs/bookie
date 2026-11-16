import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Bookmark, Collection } from '@/types';

const KEY = 'bookie/state/v1';

export type PersistedState = {
  bookmarks: Bookmark[];
  collections: Collection[];
};

export async function loadState(): Promise<PersistedState | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PersistedState) : null;
  } catch {
    return null;
  }
}

export async function saveState(state: PersistedState): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Persistence is best-effort; the in-memory state stays authoritative.
  }
}

const APPEARANCE_KEY = 'bookie/appearance/v1';

export type AppearancePreference = 'system' | 'light' | 'dark';

export async function loadAppearance(): Promise<AppearancePreference> {
  try {
    const value = await AsyncStorage.getItem(APPEARANCE_KEY);
    return value === 'light' || value === 'dark' ? value : 'system';
  } catch {
    return 'system';
  }
}

export async function saveAppearance(preference: AppearancePreference): Promise<void> {
  try {
    await AsyncStorage.setItem(APPEARANCE_KEY, preference);
  } catch {
    // Best-effort, like the rest of persistence.
  }
}
