import { InventoryItemName } from "./game";
import { SUNNYSIDE } from "assets/sunnyside";
import { translate } from "lib/i18n/translate";
import { getKeys } from "./craftables";

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
