/**
 * Must match API `domain/playerEconomy/playerEconomySlug.ts` (DNS label for
 * `{slug}.minigames…` and S3 prefixes for new economies).
 */
export const PLAYER_ECONOMY_SLUG_PATTERN =
  /^(?:[a-z0-9]|[a-z0-9][a-z0-9-]{0,61}[a-z0-9])$/;

export function normalizePlayerEconomySlugInput(raw: string): string {
  return raw.trim().toLowerCase();
}

export function isValidPlayerEconomySlug(raw: string): boolean {
  return PLAYER_ECONOMY_SLUG_PATTERN.test(normalizePlayerEconomySlugInput(raw));
}
