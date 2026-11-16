import { router, useLocalSearchParams } from 'expo-router';
import { Pressable } from 'react-native';

import { BookmarkForm } from '@/components/bookmarks/BookmarkForm';
import { EmptyState } from '@/components/ui/EmptyState';
import { Text } from '@/components/ui/Text';
import { confirmDestructive } from '@/lib/confirm';
import { useBookmarks } from '@/store/BookmarksProvider';

export default function EditBookmarkScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getBookmark, updateBookmark, removeBookmark } = useBookmarks();
  const bookmark = getBookmark(id);

  if (!bookmark) return <EmptyState title="Not found" message="This page may have been deleted." />;

  return (
    <BookmarkForm
      submitLabel="Done"
      initial={bookmark}
      onSubmit={(values) => {
        updateBookmark(bookmark.id, values);
        router.back();
      }}
      footer={
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            confirmDestructive('Delete page?', bookmark.title, () => {
              removeBookmark(bookmark.id);
              router.back();
            })
          }
          className="items-center py-2 active:opacity-60">
          <Text tone="danger">Delete page</Text>
        </Pressable>
      }
    />
  );
}
