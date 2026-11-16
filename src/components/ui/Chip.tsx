import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/cn';

type Props = {
  label: string;
  selected?: boolean;
  dot?: string;
  onPress: () => void;
};

export function Chip({ label, selected, dot, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={cn(
        'flex-row items-center gap-1.5 rounded-full border-hairline px-3 py-1.5 active:opacity-70',
        selected ? 'border-accent bg-accent' : 'border-line',
      )}>
      {/* Collection colors are data, so the dot keeps an inline color. */}
      {dot ? (
        <View className="h-[7px] w-[7px] rounded-full" style={{ backgroundColor: dot }} />
      ) : null}
      <Text variant="caption" tone={selected ? 'onAccent' : 'muted'}>
        {label}
      </Text>
    </Pressable>
  );
}
