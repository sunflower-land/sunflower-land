import type { SceneId } from "features/world/mmoMachine";

/**
 * THE config for community games. This one array is the single place you add a
 * new game: give it a `type`, a `name`, a `description`, a `sceneId`, and flip
 * `available` on. Then build one Phaser scene and register it in
 * `scenes/registry.ts` under the same `type`. That's the whole checklist —
 * everything else (the lobby, the 30s clock, joining, scoring, the leaderboard,
 * prize claiming, the create dropdown) is shared and reads from here.
 *
 * NOTE: the backend giveaway object has no `type` field yet, so the chosen type
 * is carried to the play screen via a `?type=` query param. Players who join via
 * the lobby (no query param) fall back to `race`.
 */
export type MinigameType =
  | "race"
  | "chop"
  | "eggs"
  | "jump"
  | "puzzle"
  | "trivia";

export type GiveawayMinigame = {
  type: MinigameType;
  name: string;
  /** One-liner shown on the community games list. */
  description: string;
  /** Whether the mini-game is actually implemented and playable. */
  available: boolean;
  /** The MMO scene id / Phaser scene key its gameplay runs in (playable games). */
  sceneId?: SceneId;
};

export const GIVEAWAY_MINIGAMES: GiveawayMinigame[] = [
  {
    type: "race",
    name: "Weekly Stream Race",
    description: "A community race — the fastest Bumpkins win prizes!",
    available: true,
    sceneId: "giveaway_race",
  },
  {
    type: "chop",
    name: "Log Chop",
    description: "Chop in rhythm — the most points wins prizes!",
    available: true,
    sceneId: "giveaway_chop",
  },
  {
    type: "eggs",
    name: "Egg Catch",
    description: "Catch the falling eggs — dodge the bombs, grab the gold!",
    available: true,
    sceneId: "giveaway_eggs",
  },
  {
    type: "jump",
    name: "Jumper",
    description: "Time your taps to leap higher — climb the furthest to win!",
    available: true,
    sceneId: "giveaway_jump",
  },
  {
    type: "trivia",
    name: "Trivia",
    description: "Answer the questions — most points wins prizes!",
    available: true,
    sceneId: "giveaway_trivia",
  },
  {
    type: "puzzle",
    name: "Puzzle (coming soon)",
    description: "Solve the puzzle to win prizes!",
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
