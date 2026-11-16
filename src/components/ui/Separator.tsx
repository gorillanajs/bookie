import { View } from 'react-native';

import { cn } from '@/lib/cn';

/** Hairline divider; pass an inset like `ml-[84px]` to align with row content. */
export function Separator({ className }: { className?: string }) {
  return <View className={cn('h-hairline bg-line', className)} />;
}
