import { Fragment, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { CollectionRow } from '@/components/collections/CollectionRow';
import { IconButton } from '@/components/ui/IconButton';
import { Screen } from '@/components/ui/Screen';
import { Separator } from '@/components/ui/Separator';
import { Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';
import { useTheme } from '@/hooks/useTheme';
import { useBookmarks } from '@/store/BookmarksProvider';
import type { Collection } from '@/types';

/** Virtual collection for bookmarks that aren't filed anywhere. */
const UNSORTED_ID = 'unsorted';

const card = 'overflow-hidden rounded-[14px] border-hairline border-line bg-surface';

export default function CollectionsScreen() {
  const colors = useTheme();
  const { collections, bookmarks, addCollection } = useBookmarks();
  const [name, setName] = useState('');

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const b of bookmarks) {
      const key = b.collectionId ?? UNSORTED_ID;
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
  }, [bookmarks]);

  const unsorted: Collection = {
    id: UNSORTED_ID,
    name: 'Unsorted',
    color: colors.faint,
    createdAt: 0,
  };

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    addCollection(trimmed);
    setName('');
  };

  return (
    <Screen title="Collections" subtitle="Group pages by topic">
      <ScrollView contentContainerClassName="gap-4 px-6 pb-8" keyboardShouldPersistTaps="handled">
        {collections.length > 0 ? (
          <View className={card}>
            {collections.map((c, i) => (
              <Fragment key={c.id}>
                {/* Inset to line up with the collection name, past the color dot. */}
                {i > 0 ? <Separator className="ml-[38px]" /> : null}
                <CollectionRow collection={c} count={counts.get(c.id) ?? 0} />
              </Fragment>
            ))}
          </View>
        ) : null}

        <View className={card}>
          <CollectionRow collection={unsorted} count={counts.get(UNSORTED_ID) ?? 0} />
        </View>

        <View className="mt-2 gap-2">
          <Text variant="label" tone="faint" className="px-1">
            New collection
          </Text>
          <View className="flex-row items-center rounded-[14px] border-hairline border-line bg-surface pr-1.5">
            <TextField
              value={name}
              onChangeText={setName}
              onSubmitEditing={submit}
              placeholder="e.g. Recipes"
              returnKeyType="done"
              bare
              className="flex-1"
            />
            {name.trim() ? (
              <IconButton
                icon="add"
                filled
                accessibilityLabel="Create collection"
                onPress={submit}
              />
            ) : null}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
