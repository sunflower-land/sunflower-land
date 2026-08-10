import type { MinigameType } from "./minigames";

/**
 * The backend giveaway object has no `minigame`/`type` field yet, so the chosen
 * type would be lost the moment you leave the create form (joining an existing
 * giveaway can't know it). As a stop-gap we remember `id → type` locally, so the
 * creator (and anyone who created/opened it in this browser) drops into the
 * right mini-game. Other players still fall back to the default until the API
 * carries the type.
 */
const key = (id: string) => `giveaway.type.${id}`;

export function rememberGiveawayType(id: string, type: MinigameType) {
  try {
    localStorage.setItem(key(id), type);
  } catch {
    // Ignore storage failures (private mode / quota) — falls back to default.
  }
}

export function recallGiveawayType(id: string): MinigameType | undefined {
  try {
    return (localStorage.getItem(key(id)) as MinigameType | null) ?? undefined;
  } catch {
    return undefined;
  }
}
