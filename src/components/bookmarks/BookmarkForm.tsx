import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';
import { getDomain, normalizeUrl } from '@/lib/url';
import { useBookmarks } from '@/store/BookmarksProvider';

export type BookmarkFormValues = { url: string; title: string; collectionId: string | null };

type Props = {
  initial?: Partial<BookmarkFormValues>;
  submitLabel: string;
  onSubmit: (values: BookmarkFormValues) => void;
  autoFocus?: boolean;
  footer?: ReactNode;
};

export function BookmarkForm({ initial, submitLabel, onSubmit, autoFocus, footer }: Props) {
  const { collections } = useBookmarks();

  const [url, setUrl] = useState(initial?.url ?? '');
  const [title, setTitle] = useState(initial?.title ?? '');
  const [collectionId, setCollectionId] = useState<string | null>(initial?.collectionId ?? null);
  const [error, setError] = useState<string | null>(null);
  const canSubmit = url.trim().length > 0;

  const submit = () => {
    const normalized = normalizeUrl(url);
    if (!normalized) {
      setError('That doesn’t look like a web address.');
      return;
    }
    onSubmit({ url: normalized, title: title.trim() || getDomain(normalized), collectionId });
  };

  return (
    <ScrollView
      className="bg-canvas"
      contentContainerClassName="gap-6 p-6"
      // Keeps fields clear of a translucent native header (iOS) instead of sliding under it.
      contentInsetAdjustmentBehavior="automatic"
      automaticallyAdjustKeyboardInsets
      keyboardShouldPersistTaps="handled">
      <Field label="Link">
        <TextField
          value={url}
          onChangeText={(text) => {
            setUrl(text);
            setError(null);
          }}
          placeholder="https://"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={autoFocus}
          keyboardType="url"
          returnKeyType="next"
        />
        {error ? (
          <Text variant="caption" tone="danger">
            {error}
          </Text>
        ) : null}
      </Field>

      <Field label="Title">
        <TextField
          value={title}
          onChangeText={setTitle}
          placeholder="Optional"
          returnKeyType="done"
          onSubmitEditing={submit}
        />
      </Field>

      <Field label="Collection">
        <View className="flex-row flex-wrap gap-2">
          <Chip
            label="None"
            selected={collectionId === null}
            onPress={() => setCollectionId(null)}
          />
          {collections.map((c) => (
            <Chip
              key={c.id}
              label={c.name}
              dot={c.color}
              selected={collectionId === c.id}
              onPress={() => setCollectionId(c.id)}
            />
          ))}
        </View>
      </Field>

      <Pressable
        onPress={submit}
        disabled={!canSubmit}
        accessibilityRole="button"
        className={`mt-2 items-center rounded-[14px] bg-accent py-4 ${canSubmit ? 'active:opacity-80' : 'opacity-30'}`}>
        <Text variant="heading" tone="onAccent">
          {submitLabel}
        </Text>
      </Pressable>

      {footer}
    </ScrollView>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View className="gap-2">
      <Text variant="label" tone="faint">
        {label}
      </Text>
      {children}
    </View>
  );
}
