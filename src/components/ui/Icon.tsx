import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';

type SymbolName = ComponentProps<typeof SymbolView>['name'];

/** Central icon registry so screens use semantic names instead of per-platform symbols. */
const icons = {
  saved: { ios: 'bookmark', android: 'bookmark', web: 'bookmark' },
  collections: { ios: 'square.grid.2x2', android: 'grid_view', web: 'grid_view' },
  settings: { ios: 'gearshape', android: 'settings', web: 'settings' },
  add: { ios: 'plus', android: 'add', web: 'add' },
  chevron: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
  close: { ios: 'xmark', android: 'close', web: 'close' },
  trash: { ios: 'trash', android: 'delete', web: 'delete' },
} satisfies Record<string, SymbolName>;

export type IconName = keyof typeof icons;

export function Icon({
  name,
  size = 22,
  color,
}: {
  name: IconName;
  size?: number;
  color: ColorValue;
}) {
  return <SymbolView name={icons[name]} size={size} tintColor={color} />;
}
