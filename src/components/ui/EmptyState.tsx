import { View } from 'react-native';

import { Text } from '@/components/ui/Text';

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <View className="items-center gap-2 px-8 py-16">
      <Text variant="heading">{title}</Text>
      <Text tone="muted" className="text-center">
        {message}
      </Text>
    </View>
  );
}
