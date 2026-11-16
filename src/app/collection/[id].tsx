import { router, Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { BookmarkList } from '@/components/bookmarks/BookmarkList';
import { IconButton } from '@/components/ui/IconButton';
import { confirmDestructive } from '@/lib/confirm';
import { useBookmarks } from '@/store/BookmarksProvider';

export default function CollectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bookmarks, getCollection, removeCollection } = useBookmarks();

  const isUnsorted = id === 'unsorted';
  const collection = getCollection(id);
  const items = bookmarks.filter((b) =>
    isUnsorted ? b.collectionId === null : b.collectionId === id,
  );

  return (
    <View className="flex-1 bg-canvas">
      <Stack.Screen
        options={{
          title: (isUnsorted ? 'Unsorted' : (collection?.name ?? 'Collection')).toUpperCase(),
          headerRight: () => (
            <View className="flex-row gap-1">
              {collection ? (
                <IconButton
                  icon="trash"
                  accessibilityLabel="Delete collection"
                  onPress={() =>
                    confirmDestructive(
                      `Delete “${collection.name}”?`,
                      'Pages inside will move to Unsorted.',
                      () => {
                        removeCollection(collection.id);
                        router.back();
                      },
                    )
                  }
                />
              ) : null}
              <IconButton
                icon="add"
                accessibilityLabel="Save a page to this collection"
                onPress={() =>
                  router.push({
                    pathname: '/add',
                    params: collection ? { collection: collection.id } : {},
                  })
                }
              />
            </View>
          ),
        }}
      />
      <BookmarkList
        bookmarks={items}
        showCollection={false}
        underHeader
        emptyTitle="Empty collection"
        emptyMessage="Tap + to save a page here, or long-press any saved page to move it."
      />
    </View>
  );
}
