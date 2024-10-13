import { SUNNYSIDE } from "assets/sunnyside";
import { Equipped } from "features/game/types/bumpkin";
import { ITEM_DETAILS } from "features/game/types/images";

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

export const MAX_LAMPS_IN_MAP = 30;

export const INITIAL_LAMPS_LIGHT_RADIUS = 0.3;
export const MIN_PLAYER_LIGHT_RADIUS = 0.1;
export const MAX_PLAYER_LIGHT_RADIUS = 0.6;
export const MAX_PLAYER_LAMPS = 10;
export const STEP_PLAYER_LIGHT_RADIUS =
  (MAX_PLAYER_LIGHT_RADIUS - MIN_PLAYER_LIGHT_RADIUS) / MAX_PLAYER_LAMPS;

export const DURATION_GAME_OVER_WITHOUT_LAMPS = 15; // 15 seconds
export const DURATION_LAMP_SECONDS = 15; // 15 seconds
export const LAMP_USAGE_MULTIPLIER_INTERVAL = 90; // 1 minute 30 seconds each multiplier
export const MAX_LAMP_USAGE_MULTIPLIER = 3;

export const LAMP_SPAWN_BASE_INTERVAL = 2; // 2 seconds
export const LAMP_SPAWN_INCREASE_PERCENTAGE = 0.05;

export const UNLIMITED_ATTEMPTS_SFL = 3;
export const RESTOCK_ATTEMPTS_SFL = 1;
export const DAILY_ATTEMPTS = 5;
export const RESTOCK_ATTEMPTS = 3;

export const ITEM_BUMPKIN = {
  x: 0,
  y: -12,
};

export const ENEMIES_TABLE: {
  [key: number]: {
    item: string;
    description: string;
  };
} = {
  0: { item: ITEM_DETAILS["Oil Reserve"].image, description: "5 points" },
  1: { item: SUNNYSIDE.resource.stone_rock, description: "5 points" },
  2: { item: SUNNYSIDE.resource.stone_small, description: "2 points" },
  3: {
    item: SUNNYSIDE.decorations.bonniesTombstone,
    description: "2 points",
  },
};

export const HALLOWEEN_NPC_WEARABLES: Equipped = {
  hair: "Basic Hair",
  shirt: "Pumpkin Shirt",
  pants: "Farmer Pants",
  background: "Cemetery Background",
  hat: "Luna's Hat",
  body: "Pale Potion",
  shoes: "Mushroom Shoes",
  tool: "Dawn Lamp",
  wings: "Crow Wings",
  coat: "Pirate General Coat",
};
