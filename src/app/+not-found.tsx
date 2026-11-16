import { Link, Stack } from 'expo-router';
import { View } from 'react-native';

import { Text } from '@/components/ui/Text';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'NOT FOUND' }} />
      <View className="flex-1 items-center justify-center bg-canvas p-6">
        <Text variant="heading">This page doesn’t exist.</Text>
        <Link href="/" className="mt-4 py-4">
          <Text tone="muted">Back to Saved</Text>
        </Link>
      </View>
    </>
  );
}
