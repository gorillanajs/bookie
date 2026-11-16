import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';

import { collectionColors } from '@/constants/theme';
import { createId } from '@/lib/id';
import { loadState, saveState, type PersistedState } from '@/lib/storage';
import type { Bookmark, Collection } from '@/types';

type State = PersistedState & { hydrated: boolean };

export type BookmarkChanges = Partial<Pick<Bookmark, 'title' | 'url' | 'collectionId'>>;

type Action =
  | { type: 'hydrate'; state: PersistedState | null }
  | { type: 'addBookmark'; bookmark: Bookmark }
  | { type: 'removeBookmark'; id: string }
  | { type: 'updateBookmark'; id: string; changes: BookmarkChanges }
  | { type: 'addCollection'; collection: Collection }
  | { type: 'removeCollection'; id: string }
  | { type: 'clear' };

const now = Date.now();
const seed: PersistedState = {
  collections: [
    { id: 'read', name: 'Read later', color: collectionColors[0], createdAt: now },
    { id: 'design', name: 'Design', color: collectionColors[3], createdAt: now },
  ],
  bookmarks: [
    {
      id: 'welcome',
      url: 'https://docs.expo.dev/router/introduction/',
      title: 'Expo Router',
      collectionId: 'read',
      createdAt: now,
    },
  ],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'hydrate':
      return { ...(action.state ?? seed), hydrated: true };
    case 'addBookmark':
      return { ...state, bookmarks: [action.bookmark, ...state.bookmarks] };
    case 'removeBookmark':
      return { ...state, bookmarks: state.bookmarks.filter((b) => b.id !== action.id) };
    case 'updateBookmark':
      return {
        ...state,
        bookmarks: state.bookmarks.map((b) =>
          b.id === action.id ? { ...b, ...action.changes } : b,
        ),
      };
    case 'addCollection':
      return { ...state, collections: [...state.collections, action.collection] };
    case 'removeCollection':
      // Bookmarks in a deleted collection become unsorted rather than disappearing.
      return {
        ...state,
        collections: state.collections.filter((c) => c.id !== action.id),
        bookmarks: state.bookmarks.map((b) =>
          b.collectionId === action.id ? { ...b, collectionId: null } : b,
        ),
      };
    case 'clear':
      return { bookmarks: [], collections: [], hydrated: true };
  }
}

function useBookmarksStore() {
  const [state, dispatch] = useReducer(reducer, {
    bookmarks: [],
    collections: [],
    hydrated: false,
  });

  useEffect(() => {
    loadState().then((loaded) => dispatch({ type: 'hydrate', state: loaded }));
  }, []);

  useEffect(() => {
    if (state.hydrated) {
      saveState({ bookmarks: state.bookmarks, collections: state.collections });
    }
  }, [state]);

  return useMemo(
    () => ({
      ...state,
      addBookmark: (input: Omit<Bookmark, 'id' | 'createdAt'>) =>
        dispatch({
          type: 'addBookmark',
          bookmark: { ...input, id: createId(), createdAt: Date.now() },
        }),
      removeBookmark: (id: string) => dispatch({ type: 'removeBookmark', id }),
      updateBookmark: (id: string, changes: BookmarkChanges) =>
        dispatch({ type: 'updateBookmark', id, changes }),
      getBookmark: (id: string) => state.bookmarks.find((b) => b.id === id),
      addCollection: (name: string) =>
        dispatch({
          type: 'addCollection',
          collection: {
            id: createId(),
            name,
            color: collectionColors[state.collections.length % collectionColors.length],
            createdAt: Date.now(),
          },
        }),
      removeCollection: (id: string) => dispatch({ type: 'removeCollection', id }),
      clearAll: () => dispatch({ type: 'clear' }),
      getCollection: (id: string | null) => state.collections.find((c) => c.id === id),
    }),
    [state],
  );
}

type BookmarksContextValue = ReturnType<typeof useBookmarksStore>;

const BookmarksContext = createContext<BookmarksContextValue | null>(null);

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const store = useBookmarksStore();
  return <BookmarksContext.Provider value={store}>{children}</BookmarksContext.Provider>;
}

export function useBookmarks(): BookmarksContextValue {
  const ctx = useContext(BookmarksContext);
  if (!ctx) throw new Error('useBookmarks must be used inside <BookmarksProvider>');
  return ctx;
}
