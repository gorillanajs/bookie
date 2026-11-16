import type { ShareIntent } from 'expo-share-intent';

export type SharedPage = { url: string; title?: string };

const URL_IN_TEXT = /https?:\/\/[^\s<>"']+/i;

/**
 * Pulls a web page out of whatever the system share sheet handed us. Browsers
 * usually send a URL, but some apps send text like "Look at this: https://…".
 */
export function getSharedPage(intent: ShareIntent): SharedPage | null {
  const url = intent.webUrl ?? intent.text?.match(URL_IN_TEXT)?.[0];
  if (!url) return null;

  const title = intent.meta?.title?.trim();
  return { url, title: title || undefined };
}
