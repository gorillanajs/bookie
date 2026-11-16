import { useMemo, useState } from 'react';
import { FlatList } from 'react-native';

import { BookmarkRow } from '@/components/bookmarks/BookmarkRow';
import { SortBar } from '@/components/bookmarks/SortBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { Separator } from '@/components/ui/Separator';
import { sortBookmarks } from '@/lib/sort';
import type { Bookmark, SortKey } from '@/types';

type Props = {
  bookmarks: Bookmark[];
  showCollection?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  /** Set on screens with a native header so content isn't hidden beneath it (iOS). */
  underHeader?: boolean;
};

export function BookmarkList({
  bookmarks,
  showCollection,
  emptyTitle = 'Nothing saved yet',
  emptyMessage = 'Tap + to save a page for later.',
  underHeader,
}: Props) {
  const [sort, setSort] = useState<SortKey>('newest');
  const sorted = useMemo(() => sortBookmarks(bookmarks, sort), [bookmarks, sort]);

  return (
    <FlatList
      data={sorted}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <BookmarkRow bookmark={item} showCollection={showCollection} />}
      ListHeaderComponent={
        bookmarks.length > 1 ? <SortBar value={sort} onChange={setSort} /> : undefined
      }
      // Inset past the 44px monogram so the line starts under the text.
      ItemSeparatorComponent={() => <Separator className="ml-[84px]" />}
      ListEmptyComponent={<EmptyState title={emptyTitle} message={emptyMessage} />}
      contentContainerClassName="pb-8"
      contentInsetAdjustmentBehavior={underHeader ? 'automatic' : 'never'}
    />
  );
}
