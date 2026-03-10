import {
  BumpkinWings,
  BumpkinAura,
  Equipped,
} from "features/game/types/bumpkin";
import { translate as t } from "lib/i18n/translate";
import { NPC_WEARABLES } from "lib/npcs";
import { ITEM_DETAILS } from "features/game/types/images";
import { Position, Side } from "./Types";

export const PORTAL_NAME = "april-fools";
export const PORTAL_TOKEN = "April Fools Token 2025";

// Game config
export const GAME_SECONDS = 300;
export const GAME_LIVES = 5;

// Player
export const WALKING_SPEED = 70;
export const DEPTH = 1000;

// Attempts
export const INITIAL_DATE = "2025-10-28"; // YYYY-MM-DD
export const INITIAL_DATE_LEADERBOARD = "2025-10-29"; // YYYY-MM-DD
export const ATTEMPTS_BETA_TESTERS = 100;
export const UNLIMITED_ATTEMPTS_SFL = 150; // If this value is less than 0, the option disappears
export const FREE_DAILY_ATTEMPTS = 1;
export const RESTOCK_ATTEMPTS = [
  { attempts: 1, sfl: 3 },
  { attempts: 3, sfl: 7 },
  { attempts: 7, sfl: 14 },
  { attempts: 20, sfl: 30 },
];

// Beta testers
// export const BETA_TESTERS: number[] = [
//   29, 9609, 49035, 155026, 1181, 151471, 49035, 86, 79871, 2299, 21303, 206876,
//   9239, 36214, 55626, 3249, 128122,
// ];
export const BETA_TESTERS: number[] = [];

export const CANNON_CONFIG: (Position & { side: Side })[] = [
  { x: 160, y: 319, side: "left" },
  { x: 448, y: 319, side: "right" },
];

export const CANNON_COOLDOWN = 30000;

// Guide
export const INSTRUCTIONS: {
  image: string;
  description: string;
  width?: number;
}[] = [
  {
    image: ITEM_DETAILS["Abandoned Bear"].image,
    description: t(`${PORTAL_NAME}.resource1`),
  },
  {
    image: ITEM_DETAILS["Abandoned Bear"].image,
    description: t(`${PORTAL_NAME}.resource2`),
  },
  {
    image: ITEM_DETAILS["Abandoned Bear"].image,
    description: t(`${PORTAL_NAME}.resource3`),
  },
];

export const RESOURCES_TABLE: {
  image: string;
  description: string;
  width?: number;
}[] = [
  {
    image: ITEM_DETAILS["Abandoned Bear"].image,
    description: t(`${PORTAL_NAME}.resource1`),
  },
  {
    image: ITEM_DETAILS["Abandoned Bear"].image,
    description: t(`${PORTAL_NAME}.resource2`),
  },
  {
    image: ITEM_DETAILS["Abandoned Bear"].image,
    description: t(`${PORTAL_NAME}.resource3`),
  },
];

export const ENEMIES_TABLE: {
  image: string;
  description: string;
  width?: number;
}[] = [
  {
    image: ITEM_DETAILS["Abandoned Bear"].image,
    description: t(`${PORTAL_NAME}.enemy1`),
  },
  {
    image: ITEM_DETAILS["Abandoned Bear"].image,
    description: t(`${PORTAL_NAME}.enemy2`),
  },
];

export const VISIBLE_AURA: BumpkinAura[] = [
  "Slime Aura",
  "Wisp Aura",
  "Diamond Snow Aura",
];

export const NOT_VISIBLE_AURA: BumpkinAura[] = [
  "Coin Aura",
  "Love Puff Aura",
  "Paw Aura",
];

export const WING_BUFF: BumpkinWings = "Sol & Luna";

// Panel
export const PANEL_NPC_WEARABLES: Equipped = NPC_WEARABLES["elf"];

export const MENACE_SKELETON_POSITIONS: { x: number; y: number }[] = [
  { x: 320, y: 60 },
  { x: 150, y: 70 },
  { x: 450, y: 72 },
  { x: 230, y: 140 },
];

export const BLAST_SKELETON_POSITIONS: { x: number; y: number }[] = [
  { x: 320, y: 190 },
  //  { x: 150, y: 200},
  //  { x: 450, y: 180},
  //  { x: 230, y: 220}
];
