import { router, useLocalSearchParams } from 'expo-router';

import { BookmarkForm } from '@/components/bookmarks/BookmarkForm';
import { useBookmarks } from '@/store/BookmarksProvider';

/**
 * Save sheet. Optional params pre-fill it, which is how shared pages arrive
 * (and also enables deep links like `bookie://add?url=https://example.com`).
 */
export default function AddBookmarkScreen() {
  const params = useLocalSearchParams<{ collection?: string; url?: string; title?: string }>();
  const { addBookmark } = useBookmarks();

  return (
    <BookmarkForm
      // A shared page already has its link, so focus would just pop the keyboard over the collections.
      autoFocus={!params.url}
      submitLabel="Save"
      initial={{ url: params.url, title: params.title, collectionId: params.collection ?? null }}
      onSubmit={(values) => {
        addBookmark(values);
        router.back();
      }}
    />
  );
}
