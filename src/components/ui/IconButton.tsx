import { Pressable } from 'react-native';

import { Icon, type IconName } from '@/components/ui/Icon';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/cn';

type Props = {
  icon: IconName;
  onPress: () => void;
  accessibilityLabel: string;
  filled?: boolean;
};

export function IconButton({ icon, onPress, accessibilityLabel, filled }: Props) {
  const colors = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      className={cn(
        'h-9 w-9 items-center justify-center rounded-full active:opacity-60',
        filled && 'bg-accent',
      )}>
      <Icon name={icon} size={18} color={filled ? colors.onAccent : colors.fg} />
    </Pressable>
  );
}
