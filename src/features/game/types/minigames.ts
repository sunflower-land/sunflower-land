import { GameState, Minigame, MinigamePrize } from "./game";

export type MinigameName =
  | "crop-boom"
  | "bumpkin-fight-club"
  | "bumpkin-board-game"
  | "sfl-world"
  | "maze-run"
  | "board-game"
  | "chicken-rescue"
  | "festival-of-colors"
  | "crops-and-chickens"
  | "farmer-football"
  | "fruit-dash"
  | "halloween"
  | "christmas-delivery"
  | "easter-eggstravaganza"
  | "mine-whack"
  | "festival-of-colors-2025";

export const SUPPORTED_MINIGAMES: MinigameName[] = [
  "crop-boom",
  "bumpkin-fight-club",
  "bumpkin-board-game",
  "sfl-world",
  "maze-run",
  "board-game",
  "chicken-rescue",
  "festival-of-colors",
  "crops-and-chickens",
  "farmer-football",
  "fruit-dash",
  "halloween",
  "christmas-delivery",
  "easter-eggstravaganza",
  "mine-whack",
  "festival-of-colors-2025",
];

export function isMinigameComplete({
  minigame,
  prize,
  now = new Date(),
}: {
  minigame: Minigame;
  prize: MinigamePrize;
  now?: Date;
}) {
  const todayKey = new Date(now).toISOString().slice(0, 10);

  if (!prize) {
    return false;
  }

  const history = minigame?.history[todayKey];

  if (!history) {
    return false;
  }

  // Has reached score
  return history.highscore >= prize.score;
}
