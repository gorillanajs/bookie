import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { cn } from '@/lib/cn';

const variants = {
  title: 'font-display text-title uppercase',
  heading: 'font-display text-heading uppercase',
  body: 'font-body text-body uppercase',
  caption: 'font-body text-caption uppercase',
  label: 'font-display text-label uppercase',
} as const;

const tones = {
  fg: 'text-fg',
  muted: 'text-muted',
  faint: 'text-faint',
  danger: 'text-danger',
  onAccent: 'text-on-accent',
} as const;

export type TextProps = RNTextProps & {
  variant?: keyof typeof variants;
  tone?: keyof typeof tones;
};

export function Text({ variant = 'body', tone = 'fg', className, ...rest }: TextProps) {
  return <RNText className={cn(variants[variant], tones[tone], className)} {...rest} />;
}
