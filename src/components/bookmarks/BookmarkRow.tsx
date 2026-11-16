import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { getDomain } from '@/lib/url';
import { useBookmarks } from '@/store/BookmarksProvider';
import type { Bookmark } from '@/types';

type Props = { bookmark: Bookmark; showCollection?: boolean };

export function BookmarkRow({ bookmark, showCollection = true }: Props) {
  const { getCollection } = useBookmarks();
  const collection = showCollection ? getCollection(bookmark.collectionId) : undefined;
  const domain = getDomain(bookmark.url);

  return (
    <Pressable
      onPress={() => WebBrowser.openBrowserAsync(bookmark.url)}
      onLongPress={() => router.push({ pathname: '/bookmark/[id]', params: { id: bookmark.id } })}
      accessibilityRole="link"
      accessibilityHint="Long press to edit, move or delete"
      className="flex-row items-center gap-4 px-6 py-3 active:opacity-60">
      <View className="h-11 w-11 items-center justify-center rounded-[14px] border-hairline border-line bg-surface">
        <Text variant="heading" tone="muted">
          {domain.charAt(0)}
        </Text>
      </View>
      <View className="flex-1 gap-[3px]">
        <Text variant="heading" numberOfLines={1}>
          {bookmark.title}
        </Text>
        <View className="flex-row items-center gap-1.5">
          {collection ? (
            <View
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: collection.color }}
            />
          ) : null}
          <Text variant="caption" tone="muted" numberOfLines={1} className="shrink">
            {domain}
            {collection ? `  ·  ${collection.name}` : ''}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
