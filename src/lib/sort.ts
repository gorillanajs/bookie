import type { Bookmark, SortKey } from '@/types';
import { getDomain } from '@/lib/url';

export const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'newest', label: 'Newest' },
  { key: 'oldest', label: 'Oldest' },
  { key: 'title', label: 'A–Z' },
  { key: 'site', label: 'Site' },
];

export function sortBookmarks(bookmarks: Bookmark[], key: SortKey): Bookmark[] {
  const list = [...bookmarks];
  switch (key) {
    case 'newest':
      return list.sort((a, b) => b.createdAt - a.createdAt);
    case 'oldest':
      return list.sort((a, b) => a.createdAt - b.createdAt);
    case 'title':
      return list.sort((a, b) => a.title.localeCompare(b.title));
    case 'site':
      return list.sort((a, b) => getDomain(a.url).localeCompare(getDomain(b.url)));
  }
}
