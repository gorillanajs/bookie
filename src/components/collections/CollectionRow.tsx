import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';
import type { Collection } from '@/types';

type Props = { collection: Collection; count: number };

// A plain Pressable + router.push: wrapping a Pressable in <Link asChild> drops
// its styling, which collapsed this row's horizontal layout.
export function CollectionRow({ collection, count }: Props) {
  const colors = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/collection/[id]', params: { id: collection.id } })}
      className="flex-row items-center gap-3 px-4 py-3.5 active:bg-line">
      <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: collection.color }} />
      <Text variant="heading" numberOfLines={1} className="flex-1">
        {collection.name}
      </Text>
      <Text variant="caption" tone="muted">
        {count}
      </Text>
      <Icon name="chevron" size={13} color={colors.faint} />
    </Pressable>
  );
}
