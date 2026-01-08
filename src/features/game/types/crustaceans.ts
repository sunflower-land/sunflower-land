import { translate } from "lib/i18n/translate";
import { InventoryItemName } from "./game";

export type WaterTrapName = "Crab Pot" | "Mariner Pot";

type WaterTrap = {
  readyTimeHours: number;
  requiredBumpkinLevel: number;
};

export const WATER_TRAP: Record<WaterTrapName, WaterTrap> = {
  "Crab Pot": {
    readyTimeHours: 4,
    requiredBumpkinLevel: 18,
  },
  "Mariner Pot": {
    readyTimeHours: 8,
    requiredBumpkinLevel: 24,
  },
};

export type CrustaceanName =
  | "Isopod"
  | "Blue Crab"
  | "Lobster"
  | "Hermit Crab"
  | "Shrimp"
  | "Mussel"
  | "Oyster"
  | "Anemone"
  | "Barnacle"
  | "Sea Slug"
  | "Sea Snail"
  | "Garden Eel"
  | "Sea Grapes"
  | "Octopus"
  | "Sea Urchin"
  | "Horseshoe Crab";

export type CrustaceanChum = Extract<
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
  | "Chewed Bone"
  | "Ruffroot"
  | "Dewberry"
  | "Duskberry"
  | "Lunara"
  | "Fossil Shell"
>;

export const CRUSTACEAN_CHUM_AMOUNTS: Record<CrustaceanChum, number> = {
  "Heart leaf": 3,
  Ribbon: 3,
  "Wild Grass": 3,
  "Frost Pebble": 3,
  Grape: 5,
  Rice: 5,
  Crimstone: 2,
  Moonfur: 2,
  "Fish Stick": 2,
  "Fish Oil": 2,
  "Crab Stick": 2,
  "Chewed Bone": 2,
  Ruffroot: 2,
  Dewberry: 2,
  Duskberry: 2,
  Lunara: 2,
  "Fossil Shell": 1,
};

export const CRUSTACEANS: Record<CrustaceanName, string> = {
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
