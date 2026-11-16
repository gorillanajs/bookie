export type Bookmark = {
  id: string;
  url: string;
  title: string;
  note?: string;
  /** `null` means the bookmark is unsorted (not in any collection). */
  collectionId: string | null;
  createdAt: number;
};

export type Collection = {
  id: string;
  name: string;
  color: string;
  createdAt: number;
};

export type SortKey = 'newest' | 'oldest' | 'title' | 'site';
