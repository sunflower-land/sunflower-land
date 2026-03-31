/** Dashboard routes that use the tokenized portal minigame API (gate with `TOKEN_MINIGAMES`). */
export const TOKEN_MINIGAME_DASHBOARD_SLUGS = ["chicken-rescue-v2"] as const;

export function isTokenMinigameDashboardSlug(slug: string): boolean {
  return (TOKEN_MINIGAME_DASHBOARD_SLUGS as readonly string[]).includes(slug);
}
