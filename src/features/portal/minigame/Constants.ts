import {
  BumpkinWings,
  BumpkinAura,
  Equipped,
  BumpkinShoe,
  BumpkinHat,
} from "features/game/types/bumpkin";
import { translate as t } from "lib/i18n/translate";
import { NPC_WEARABLES } from "lib/npcs";
import { ITEM_DETAILS } from "features/game/types/images";
import { Position, Side } from "./Types";
import hat_immunity from "public/world/portal/images/prevents_slowing_icon.webp";
import shoes_immunity from "public/world/portal/images/prevents_slipping_icon.webp";
import wings_immunity_icon from "public/world/portal/images/prevents_enlargement_icon.webp";
import aura_immunity_icon from "public/world/portal/images/prevents_complete_visibility_icon.webp";

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

export type Immunity_Wearables = "aura" | "wings" | "shoe" | "hat";

export const IMMUNITY_TOOLTIP: {
  id: Immunity_Wearables;
  image: string;
  description: string;
}[] = [
  {
    id: "aura",
    image: aura_immunity_icon,
    description: t(`${PORTAL_NAME}.menace_Immunity`),
  },
  {
    id: "wings",
    image: wings_immunity_icon,
    description: t(`${PORTAL_NAME}.giant_Immunity`),
  },
  {
    id: "shoe",
    image: shoes_immunity,
    description: t(`${PORTAL_NAME}.sniper_Immunity`),
  },
  {
    id: "hat",
    image: hat_immunity,
    description: t(`${PORTAL_NAME}.blast_Immunity`),
  },
];

// Panel
export const PANEL_NPC_WEARABLES: Equipped = NPC_WEARABLES["elf"];

// Immunities
export const AURA_IMMUNITY: BumpkinAura = "Slime Aura";
export const WINGS_IMMUNITY: BumpkinWings = "Sol & Luna";
export const SHOES_IMMUNITY: BumpkinShoe = "Crimstone Boots";
export const HAT_IMMUNITY: BumpkinHat = "Grumpy Cat";

export const MENACE_SKELETON_POSITIONS: { x: number; y: number }[] = [
  { x: 320, y: 60 },
  { x: 150, y: 70 },
  { x: 450, y: 72 },
  { x: 230, y: 140 },
];

export const BLAST_SKELETON_POSITIONS: { x: number; y: number }[] = [
  { x: 300, y: 190 },
  //  { x: 150, y: 200},
  //  { x: 450, y: 180},
  //  { x: 230, y: 220}
];
