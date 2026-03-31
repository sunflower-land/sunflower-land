/**
 * Client path for a minigame marketplace item detail view.
 * Example: `/marketplace/minigames/chicken-rescue-v2/0` (`0` = item id).
 */
export function marketplaceMinigameItemPath(
  marketplaceBase: string,
  minigameSlug: string,
  itemId: number | string,
): string {
  return `${marketplaceBase}/minigames/${encodeURIComponent(minigameSlug)}/${itemId}`;
}
