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
  /** One-liner shown on the community games list. */
  description: string;
  /** Whether the mini-game is actually implemented and playable. */
  available: boolean;
};

export const GIVEAWAY_MINIGAMES: GiveawayMinigame[] = [
  {
    type: "race",
    name: "Weekly Stream Race",
    description: "A community race — the fastest Bumpkins win prizes!",
    available: true,
  },
  {
    type: "chop",
    name: "Log Chop",
    description: "Chop in rhythm — the most points wins prizes!",
    available: true,
  },
  {
    type: "puzzle",
    name: "Puzzle (coming soon)",
    description: "Solve the puzzle to win prizes!",
    available: false,
  },
  {
    type: "trivia",
    name: "Trivia (coming soon)",
    description: "Answer fastest to win prizes!",
    available: false,
  },
];

export const DEFAULT_MINIGAME: MinigameType = "race";

export function minigameName(type: MinigameType): string {
  return (
    GIVEAWAY_MINIGAMES.find((m) => m.type === type)?.name ??
    "Weekly Stream Race"
  );
}

export function minigameDescription(type: MinigameType): string {
  return GIVEAWAY_MINIGAMES.find((m) => m.type === type)?.description ?? "";
}

/**
 * Best-effort guess of the mini-game from a giveaway's title, so other players
 * (who don't have the creator's local `id → type` mapping) still enter the
 * right game — the create form defaults the title to the mini-game name.
 * Falls back to `undefined` if the title was customised beyond recognition.
 */
export function minigameFromTitle(title: string): MinigameType | undefined {
  const lower = title.toLowerCase();
  return GIVEAWAY_MINIGAMES.find((m) =>
    lower.includes(m.name.replace(/\s*\(coming soon\)/i, "").toLowerCase()),
  )?.type;
}
