export type MinigameName =
  | "crop-boom"
  | "bumpkin-fight-club"
  | "bumpkin-board-game"
  | "sfl-world"
  | "maze-run"
  | "corn-maze"
  | "board-game"
  | "chicken-rescue"
  | "chicken-rescue-v2"
  | "nightshade-arcade"
  | "festival-of-colors"
  | "crops-and-chickens"
  | "farmer-football"
  | "fruit-dash"
  | "halloween"
  | "christmas-delivery"
  | "easter-eggstravaganza"
  | "mine-whack"
  | "festival-of-colors-2025"
  | "holiday-puzzle-2025"
  | "april-fools"
  | "memory"
  | "chaacs-temple";

export const V2_MINIGAMES: MinigameName[] = [
  "corn-maze",
  "chaacs-temple",
  "chicken-rescue-v2",
];

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
  "holiday-puzzle-2025",
  "nightshade-arcade",
  "april-fools",
  "memory",
  ...V2_MINIGAMES,
];
