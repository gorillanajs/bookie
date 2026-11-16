import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/Text';

type Props = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
};

/** Tab-level screen with a large, quiet title instead of a navigation header. */
export function Screen({ title, subtitle, action, children }: Props) {
  // Insets are runtime device values (notch / Dynamic Island), so they're applied inline.
  // NativeWind's `pt-safe` didn't apply on device, leaving the title under the island.
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-canvas" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-end justify-between px-6 pb-4 pt-6">
        <View className="shrink gap-0.5">
          <Text variant="title">{title}</Text>
          {subtitle ? (
            <Text variant="caption" tone="muted">
              {subtitle}
            </Text>
          ) : null}
        </View>
        {action}
      </View>
      {children}
    </View>
  );
}
