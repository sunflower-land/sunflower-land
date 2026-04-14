/**
 * Client path for a minigame marketplace item detail view.
 * Example: `/marketplace/economies/chicken-rescue-v2/0` (`0` = item id).
 */
export function marketplaceMinigameItemPath(
  marketplaceBase: string,
  economy: string,
  itemId: number | string,
): string {
  return `${marketplaceBase}/economies/${encodeURIComponent(economy)}/${itemId}`;
}
