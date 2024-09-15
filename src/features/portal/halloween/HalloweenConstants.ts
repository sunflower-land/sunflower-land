export const LAMPS_CONFIGURATION: { x: number; y: number }[] = [
  // { x: 450, y: 300 },
  // { x: 300, y: 330 },
  { x: 290, y: 120 },
  { x: 510, y: 120 },
  { x: 615, y: 200 },
  { x: 610, y: 425 },
  { x: 480, y: 560 },
  { x: 110, y: 410 },
  { x: 385, y: 315 },
];

export const TOTAL_LAMPS = LAMPS_CONFIGURATION.length;

export const INITIAL_LAMPS_LIGHT_RADIUS = 0.3;
export const MIN_PLAYER_LIGHT_RADIUS = 0.1;
export const MAX_PLAYER_LIGHT_RADIUS = 0.6;
export const STEP_PLAYER_LIGHT_RADIUS =
  (MAX_PLAYER_LIGHT_RADIUS - MIN_PLAYER_LIGHT_RADIUS) / TOTAL_LAMPS;

export const UNLIMITED_ATTEMPTS_SFL = 3;
export const RESTOCK_ATTEMPTS_SFL = 1;
export const DAILY_ATTEMPTS = 5;
export const RESTOCK_ATTEMPTS = 3;
