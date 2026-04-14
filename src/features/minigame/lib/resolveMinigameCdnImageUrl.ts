import { CONFIG } from "lib/config";

/**
 * Joins API / mock `items[token].image` paths onto the protected image CDN when
 * they are relative (not `http(s)` and not a Vite-bundled `/...` asset URL).
 */
export function resolveMinigameCdnImageUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return url;
  if (CONFIG.PROTECTED_IMAGE_URL) {
    return `${CONFIG.PROTECTED_IMAGE_URL.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
  }
  return url;
}
