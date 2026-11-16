import Constants from 'expo-constants';
import { Pressable, View } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { Screen } from '@/components/ui/Screen';
import { Separator } from '@/components/ui/Separator';
import { Text } from '@/components/ui/Text';
import { confirmDestructive } from '@/lib/confirm';
import type { AppearancePreference } from '@/lib/storage';
import { useAppearance } from '@/store/AppearanceProvider';
import { useBookmarks } from '@/store/BookmarksProvider';

const appearanceOptions: { value: AppearancePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export default function SettingsScreen() {
  const { bookmarks, collections, clearAll } = useBookmarks();
  const { preference, setPreference } = useAppearance();

  return (
    <Screen title="Settings">
      <View className="gap-3 px-6 py-4">
        <Text variant="label" tone="faint">
          Appearance
        </Text>
        <View className="flex-row gap-2">
          {appearanceOptions.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              selected={preference === option.value}
              onPress={() => setPreference(option.value)}
            />
          ))}
        </View>
      </View>

      <View className="gap-2 px-6 py-4">
        <Text variant="label" tone="faint">
          Library
        </Text>
        <Row label="Pages" value={String(bookmarks.length)} />
        <Separator />
        <Row label="Collections" value={String(collections.length)} />
      </View>

      <View className="px-6 py-4">
        <Pressable
          onPress={() =>
            confirmDestructive(
              'Delete everything?',
              'All pages and collections will be removed.',
              clearAll,
            )
          }
          className="self-start active:opacity-60">
          <Text tone="danger">Delete all data</Text>
        </Pressable>
      </View>

      <Text variant="caption" tone="faint" className="mt-auto pb-6 text-center">
        Bookie {Constants.expoConfig?.version}
      </Text>
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-1">
      <Text>{label}</Text>
      <Text tone="muted">{value}</Text>
    </View>
  );
}
