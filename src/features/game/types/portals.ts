export type PortalName =
  | "crop-boom"
  | "bumpkin-fight-club"
  | "bumpkin-board-game"
  | "sfl-world";

export const SUPPORTED_PORTALS: PortalName[] = [
  "crop-boom",
  "bumpkin-fight-club",
  "bumpkin-board-game",
  "sfl-world",
];

export const MAX_TOTAL_ARCADE_TOKENS = 50;

export const DAILY_ARCADE_TOKENS: Record<PortalName, number> = {
  "crop-boom": 1,
  "bumpkin-fight-club": 1,
  "bumpkin-board-game": 1,
  "sfl-world": 1,
};
