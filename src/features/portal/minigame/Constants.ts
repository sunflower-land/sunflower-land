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
import { PlayerFoodConfig, PlayerFoodType, Position, Side } from "./Types";
import hat_immunity from "public/world/portal/images/prevents_slowing_icon.webp";
import shoes_immunity from "public/world/portal/images/prevents_slipping_icon.webp";
import wings_immunity_icon from "public/world/portal/images/prevents_enlargement_icon.webp";
import aura_immunity_icon from "public/world/portal/images/prevents_complete_visibility_icon.webp";
import giantIcon from "public/world/portal/images/giant_icon.gif";
import sniperIcon from "public/world/portal/images/sniper_icon.gif";
import menaceIcon from "public/world/portal/images/menaceIcon.gif";
import blastIcon from "public/world/portal/images/blastIcon.gif";

export const PORTAL_NAME = "april-fools";
export const PORTAL_TOKEN = "April Fools Token 2025";

// Game config
export const GAME_SECONDS = 300;
export const GAME_LIVES = 6;

// Player
export const WALKING_SPEED = 70;
export const SLIDING_SPEED = 300;
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

export const PLAYER_CANNON_COOLDOWN = 500;
export const PLAYER_CANNON_CHARGE_DURATION = 1200;
export const PLAYER_CANNON_REAL_SHOT_APPLE_CHANCE = 0.1;
export const CANNON_COOLDOWN = 30000;
export const DRIP_WALKER_CYCLE_DURATION = 30000;

export const CHEST_LEFT_X = 50;
export const CHEST_RIGHT_X = 560;
export const CHEST_Y = 195;
export const CHEST_TRAVEL_DURATION = 10000;
export const CHEST_SPAWN_INTERVAL = 60000;

export const PLAYER_FOOD_CONFIG: Record<PlayerFoodType, PlayerFoodConfig> = {
  cabbage: {
    texture: "cabbage",
    scale: 1.1,
    hitRadiusScale: 0.5,
    splatTexture: "cabbage_splat",
    speed: 300,
  },
  potato: {
    texture: "potato",
    scale: 1.1,
    hitRadiusScale: 0.5,
    splatTexture: "sniper_skeleton_potato_splat",
    speed: 300,
  },
  banana: {
    texture: "banana",
    scale: 1.2,
    hitRadiusScale: 1,
    spins: true,
    noEnemyContact: true,
    boomerang: true,
    speed: 200,
  },
  apple: {
    texture: "apple",
    scale: 5,
    hitRadiusScale: 1,
    spins: true,
    noEnemyContact: true,
    speed: 300,
  },
};

export const PLAYER_FOOD_CYCLE: PlayerFoodType[] = ["cabbage", "potato", "banana"];

export const LUMBER_CONFIG: Position[] = [
  { x: 304, y: 190 },
  { x: 224, y: 190 },
  { x: 384, y: 190 },
];

export const REFEREE_POSITION: Position = { x: 304, y: 190 };
export const REFEREE_EFFECT_SCALE_MODIFIER = 0.4;
export const REFEREE_EFFECT_SPEED_MODIFIER = 0.4;
export const REFEREE_EFFECT_DURATION = 5000;
export const REFEREE_EFFECT_MIN_SCALE = 0.25;
export const REFEREE_EFFECT_MAX_SCALE = 2.25;

export const RICE_BUN_POSITIONS: Position[] = [
  { x: 480, y: 345 }, { x: 407, y: 360 }, { x: 140, y: 375 }, { x: 170, y: 350 }, { x: 318, y: 365 }, { x: 230, y: 355 }, { x: 100, y: 342 }, { x: 150, y: 280 }, { x: 200, y: 300 }, { x: 250, y: 290 }, { x: 300, y: 310 }, { x: 350, y: 285 }, { x: 400, y: 305 }, { x: 450, y: 282 }, { x: 200, y: 235 }, { x: 240, y: 255 }, { x: 280, y: 240 }, { x: 320, y: 260 }, { x: 360, y: 245 }, { x: 400, y: 250 }
];
export const RICE_BUN_SPAWN_INTERVAL = 5000;
export const RICE_BUN_DESPAWN_DURATION = 30000;
export const SIMULATED_LAG_DURATION = 5000;
export const GAME_OVER_EFFECT_DURATION = 3000;

export const POWER_UNLOCK_THRESHOLDS = {
  CANNON: 10,
  SHIELD: 20,
  HONEY: 30,
  EXPLOSIVE: 50,
};

export const HONEY_SPAWN_POSITION: Position = { x: 304, y: -50 };
export const HONEY_TARGET_Y = 80;

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
      image: giantIcon,
      description: t(`${PORTAL_NAME}.enemy1`),
    },
    {
      image: sniperIcon,
      description: t(`${PORTAL_NAME}.enemy2`),
    },
    {
      image: menaceIcon,
      description: t(`${PORTAL_NAME}.enemy3`),
    },
    {
      image: blastIcon,
      description: t(`${PORTAL_NAME}.enemy4`),
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
      description: t(`${PORTAL_NAME}.aura_immunityDescription`),
    },
    {
      id: "wings",
      image: wings_immunity_icon,
      description: t(`${PORTAL_NAME}.wings_immunityDescription`),
    },
    {
      id: "shoe",
      image: shoes_immunity,
      description: t(`${PORTAL_NAME}.shoes_immunityDescription`),
    },
    {
      id: "hat",
      image: hat_immunity,
      description: t(`${PORTAL_NAME}.hat_immunityDescription`),
    },
  ];

// Panel
export const PANEL_NPC_WEARABLES: Equipped = NPC_WEARABLES["elf"];

// Immunities
export const AURA_IMMUNITY: BumpkinAura = "Slime Aura";
export const WINGS_IMMUNITY: BumpkinWings = "Sol & Luna";
export const SHOES_IMMUNITY: BumpkinShoe = "Crimstone Boots";
export const HAT_IMMUNITY: BumpkinHat = "Grumpy Cat";

export const MENACE_SKELETON_POSITIONS: Position[] = [
  { x: 320, y: 60 },
  { x: 150, y: 70 },
  // { x: 450, y: 72 },
  // { x: 230, y: 110 },
];

export const BLAST_SKELETON_POSITIONS: { x: number; y: number }[] = [
  { x: 340, y: 200 },
];

export const DRIP_WALKER_POSITIONS: (Position & { side: Side })[] = [
  { x: 224, y: 140, side: "right" },
  { x: 385, y: 140, side: "left" },
];
