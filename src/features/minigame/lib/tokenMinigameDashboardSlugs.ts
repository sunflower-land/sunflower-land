/** Dashboard routes that use the tokenized portal minigame API (gate with `TOKEN_MINIGAMES`). */
export const TOKEN_MINIGAME_DASHBOARD_SLUGS: readonly string[] = [];

export function isTokenMinigameDashboardSlug(slug: string): boolean {
  return slug.length > 0;
}
