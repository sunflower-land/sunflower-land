/** Canonical iframe origin for player-economy minigames hosted on Sunflower Land. */
export const HOSTED_MINIGAMES_SUNFLOWER_LAND_SUFFIX =
  ".minigames.sunflower-land.com";

export function canonicalHostedMinigamePlayUrl(slug: string): string {
  const s = slug.trim();
  if (!s) return "";
  return `https://${s}${HOSTED_MINIGAMES_SUNFLOWER_LAND_SUFFIX}`;
}

export function looksLikeMinigamesSunflowerLandUrl(url: string): boolean {
  const t = url.trim();
  return /^https:\/\/[^/]+\.minigames\.sunflower-land\.com\/?$/i.test(t);
}
