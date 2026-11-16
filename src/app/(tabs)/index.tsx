import { router } from 'expo-router';

import { BookmarkList } from '@/components/bookmarks/BookmarkList';
import { IconButton } from '@/components/ui/IconButton';
import { Screen } from '@/components/ui/Screen';
import { useBookmarks } from '@/store/BookmarksProvider';

export default function SavedScreen() {
  const { bookmarks } = useBookmarks();
  const count = bookmarks.length;

  return (
    <Screen
      title="Saved"
      subtitle={count === 1 ? '1 page' : `${count} pages`}
      action={
        <IconButton
          icon="add"
          filled
          accessibilityLabel="Save a page"
          onPress={() => router.push('/add')}
        />
      }>
      <BookmarkList bookmarks={bookmarks} />
    </Screen>
  );
}
