import { ScrollView } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { sortOptions } from '@/lib/sort';
import type { SortKey } from '@/types';

type Props = { value: SortKey; onChange: (key: SortKey) => void };

export function SortBar({ value, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 px-6 pb-2">
      {sortOptions.map((option) => (
        <Chip
          key={option.key}
          label={option.label}
          selected={option.key === value}
          onPress={() => onChange(option.key)}
        />
      ))}
    </ScrollView>
  );
}
