import { TextInput, type TextInputProps } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/cn';

type Props = TextInputProps & {
  /** Drop the field's own border/background, for inputs placed inside another bordered container. */
  bare?: boolean;
};

/** Text input in the app's style. Keeps the user's own casing (no forced caps). */
export function TextField({ bare, className, ...rest }: Props) {
  const colors = useTheme();
  return (
    <TextInput
      placeholderTextColor={colors.faint}
      className={cn(
        'px-4 py-3 font-body text-input text-fg',
        !bare && 'rounded-[14px] border-hairline border-line bg-surface',
        className,
      )}
      {...rest}
    />
  );
}
