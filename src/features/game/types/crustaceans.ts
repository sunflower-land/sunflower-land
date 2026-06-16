import type { InventoryItemName, IslandType } from "./game";
import type { Coordinates } from "../expansion/components/MapPlacement";
import { getWharfCoordinates } from "../expansion/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { translate } from "lib/i18n/translate";
import { getKeys } from "lib/object";

export type WaterTrapName = "Crab Pot" | "Mariner Pot";

type WaterTrap = {
  readyTimeHours: number;
  requiredBumpkinLevel: number;
  chums: CrustaceanChum[];
};

export const CRUSTACEANS = [
  "Isopod",
  "Blue Crab",
  "Lobster",
  "Hermit Crab",
  "Shrimp",
  "Mussel",
  "Oyster",
  "Anemone",
  "Barnacle",
  "Sea Slug",
  "Sea Snail",
  "Garden Eel",
  "Sea Grapes",
  "Octopus",
  "Sea Urchin",
  "Horseshoe Crab",
] as const;

export type CrustaceanName = (typeof CRUSTACEANS)[number];

export type MarinerPotChum = Extract<
  InventoryItemName,
  | "Crimstone"
  | "Chewed Bone"
  | "Ruffroot"
  | "Dewberry"
  | "Duskberry"
  | "Lunara"
  | "Moonfur"
  | "Fish Stick"
  | "Crab Stick"
>;

export type CrabPotChum = Extract<
  InventoryItemName,
  | "Heart leaf"
  | "Ribbon"
  | "Wild Grass"
  | "Frost Pebble"
  | "Grape"
  | "Rice"
  | "Crimstone"
  | "Moonfur"
  | "Fish Stick"
  | "Fish Oil"
  | "Crab Stick"
>;

export type CrustaceanChum = CrabPotChum | MarinerPotChum;

export const CRUSTACEANS_DESCRIPTIONS: Record<CrustaceanName, string> = {
  Isopod: translate("description.isopod"),
  "Blue Crab": translate("description.blueCrab"),
  Lobster: translate("description.lobster"),
  "Hermit Crab": translate("description.hermitCrab"),
  Shrimp: translate("description.shrimp"),
  Mussel: translate("description.mussel"),
  Oyster: translate("description.oyster"),
  Anemone: translate("description.anemone"),
  Barnacle: translate("description.barnacle"),
  "Sea Slug": translate("description.seaSlug"),
  "Sea Snail": translate("description.seaSnail"),
  "Garden Eel": translate("description.gardenEel"),
  "Sea Grapes": translate("description.seaGrapes"),
  Octopus: translate("description.octopus"),
  "Sea Urchin": translate("description.seaUrchin"),
  "Horseshoe Crab": translate("description.horseshoeCrab"),
};

export const MARINER_POT_CHUMS: Record<MarinerPotChum, number> = {
  Crimstone: 2,
  "Chewed Bone": 3,
  Ruffroot: 3,
  Dewberry: 3,
  Duskberry: 3,
  Lunara: 3,
  Moonfur: 1,
  "Fish Stick": 2,
  "Crab Stick": 2,
};

export const CRAB_POT_CHUMS: Record<CrabPotChum, number> = {
  "Heart leaf": 3,
  Ribbon: 3,
  "Wild Grass": 3,
  "Frost Pebble": 3,
  Grape: 5,
  Rice: 5,
  Crimstone: 2,
  Moonfur: 1,
  "Fish Stick": 2,
  "Fish Oil": 2,
  "Crab Stick": 2,
};

export const CRUSTACEAN_CHUM_AMOUNTS: Record<CrustaceanChum, number> = {
  ...CRAB_POT_CHUMS,
  ...MARINER_POT_CHUMS,
};

export type Crustacean = {
  chum?: Partial<Record<CrustaceanChum, number>>;
  waterTrap: WaterTrapName;
};

export const WATER_TRAP_ANIMATIONS: Record<WaterTrapName, string> = {
  "Crab Pot": SUNNYSIDE.tools.crab_pot_placed,
  "Mariner Pot": SUNNYSIDE.tools.mariner_pot_placed,
};

export const CRUSTACEANS_LOOKUP: Record<
  WaterTrapName,
  Partial<Record<CrustaceanChum | "none", CrustaceanName>>
> = {
  "Crab Pot": {
    none: "Isopod",
    "Heart leaf": "Blue Crab",
    Ribbon: "Blue Crab",
    "Wild Grass": "Lobster",
    "Frost Pebble": "Lobster",
    Grape: "Hermit Crab",
    Rice: "Hermit Crab",
    Crimstone: "Shrimp",
    Moonfur: "Mussel",
    "Fish Stick": "Oyster",
    "Fish Oil": "Anemone",
    "Crab Stick": "Anemone",
  },
  "Mariner Pot": {
    none: "Barnacle",
    Crimstone: "Sea Slug",
    "Chewed Bone": "Sea Snail",
    Ruffroot: "Sea Snail",
    Dewberry: "Garden Eel",
    Duskberry: "Garden Eel",
    Lunara: "Sea Grapes",
    Moonfur: "Octopus",
    "Fish Stick": "Sea Urchin",
    "Crab Stick": "Horseshoe Crab",
  },
};

export function caughtCrustacean(
  trapType: WaterTrapName,
  chum?: CrustaceanChum,
): Partial<Record<CrustaceanName, number>> {
  const trapMapping = CRUSTACEANS_LOOKUP[trapType];

  const crustacean = trapMapping[chum ?? "none"];

  if (!crustacean) {
    throw new Error(`Invalid trap and chum combination: ${trapType} ${chum}`);
  }

  return {
    [crustacean]: 1,
  };
}

export const WATER_TRAP: Record<WaterTrapName, WaterTrap> = {
  "Crab Pot": {
    readyTimeHours: 4,
    requiredBumpkinLevel: 18,
    chums: getKeys(CRAB_POT_CHUMS),
  },
  "Mariner Pot": {
    readyTimeHours: 8,
    requiredBumpkinLevel: 24,
    chums: getKeys(MARINER_POT_CHUMS),
  },
};

/**
 * Crab-trap spot positions are a client render concern, anchored to the dock so
 * the cluster moves with it (see getWharfCoordinates). The back end owns only
 * the set of trap ids per island and whether each holds a trap — placement is
 * validated by trap id, never coordinates — so the FE computes the positions and
 * its id set must match the back end's.
 *
 * TRAP_POSITIONS give the per-island cluster shape; (14, 15) places the cluster
 * relative to the dock.
 */
const TRAP_POSITIONS: Record<IslandType, Record<string, Coordinates>> = {
  basic: {
    "1": { x: -14, y: -17 },
  },
  spring: {
    "1": { x: -13, y: -19 },
    "2": { x: -11, y: -16 },
  },
  desert: {
    "1": { x: -13, y: -19 },
    "2": { x: -10, y: -16 },
    "3": { x: -14.5, y: -18.5 },
  },
  volcano: {
    "1": { x: -12, y: -20 },
    "2": { x: -10, y: -16.5 },
    "3": { x: -14, y: -19.5 },
    "4": { x: -12, y: -16 },
  },
};

const TRAP_DOCK_OFFSET = { x: 14, y: 15 };

/** The render position of a crab-trap spot for the current land + island. */
export function getWaterTrapCoordinates(
  expansions: number,
  island: IslandType,
  trapId: string,
): Coordinates | undefined {
  const base = TRAP_POSITIONS[island][trapId];
  if (!base) return undefined;

  const wharf = getWharfCoordinates(expansions);

  return {
    x: wharf.x + base.x + TRAP_DOCK_OFFSET.x,
    y: wharf.y + base.y + TRAP_DOCK_OFFSET.y,
  };
}
