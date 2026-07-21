/**
 * The catalogue of giveaway mini-games the admin can pick from when setting up a
 * giveaway. `race` is the only playable one today; the others are placeholders
 * so the dropdown shows the intended line-up and new types slot in here.
 *
 * NOTE: the backend giveaway object has no `type` field yet, so the chosen type
 * is carried to the play screen via a `?type=` query param. Players who join via
 * the lobby (no query param) fall back to `race`.
 */
export type MinigameType = "race" | "chop" | "puzzle" | "trivia";

export type GiveawayMinigame = {
  type: MinigameType;
  name: string;
  /** Whether the mini-game is actually implemented and playable. */
  available: boolean;
};

export const GIVEAWAY_MINIGAMES: GiveawayMinigame[] = [
  { type: "race", name: "Weekly Stream Race", available: true },
  { type: "chop", name: "Log Chop", available: true },
  { type: "puzzle", name: "Puzzle (coming soon)", available: false },
  { type: "trivia", name: "Trivia (coming soon)", available: false },
];

export const DEFAULT_MINIGAME: MinigameType = "race";

export function minigameName(type: MinigameType): string {
  return (
    GIVEAWAY_MINIGAMES.find((m) => m.type === type)?.name ??
    "Weekly Stream Race"
  );
}
