import { InventoryItemName } from "./game";
import { getKeys } from "../lib/crafting";
import { SUNNYSIDE } from "assets/sunnyside";
import { getObjectEntries } from "../expansion/lib/utils";
import { prng } from "lib/prng";
import { stringToInteger } from "lib/utils/stringToInteger";

export type WaterTrapName = "Crab Pot" | "Mariner Pot";

type WaterTrap = {
  readyTimeHours: number;
  requiredBumpkinLevel: number;
  chums: CrustaceanChum[];
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

export const CRUSTACEANS: Record<CrustaceanName, Crustacean> = {
  Isopod: {
    waterTrap: "Crab Pot",
  },
  "Blue Crab": {
    chum: {
      "Heart leaf": CRUSTACEAN_CHUM_AMOUNTS["Heart leaf"],
      Ribbon: CRUSTACEAN_CHUM_AMOUNTS["Ribbon"],
    },
    waterTrap: "Crab Pot",
  },
  Lobster: {
    chum: {
      "Wild Grass": CRUSTACEAN_CHUM_AMOUNTS["Wild Grass"],
      "Frost Pebble": CRUSTACEAN_CHUM_AMOUNTS["Frost Pebble"],
    },
    waterTrap: "Crab Pot",
  },
  "Hermit Crab": {
    chum: {
      Grape: CRUSTACEAN_CHUM_AMOUNTS["Grape"],
      Rice: CRUSTACEAN_CHUM_AMOUNTS["Rice"],
    },
    waterTrap: "Crab Pot",
  },
  Shrimp: {
    chum: {
      Crimstone: CRUSTACEAN_CHUM_AMOUNTS["Crimstone"],
    },
    waterTrap: "Crab Pot",
  },
  Mussel: {
    chum: {
      Moonfur: CRUSTACEAN_CHUM_AMOUNTS["Moonfur"],
    },
    waterTrap: "Crab Pot",
  },
  Oyster: {
    chum: {
      "Fish Stick": CRUSTACEAN_CHUM_AMOUNTS["Fish Stick"],
    },
    waterTrap: "Crab Pot",
  },
  Anemone: {
    chum: {
      "Fish Oil": CRUSTACEAN_CHUM_AMOUNTS["Fish Oil"],
      "Crab Stick": CRUSTACEAN_CHUM_AMOUNTS["Crab Stick"],
    },
    waterTrap: "Crab Pot",
  },
  Barnacle: {
    waterTrap: "Mariner Pot",
  },
  "Sea Slug": {
    chum: {
      Crimstone: CRUSTACEAN_CHUM_AMOUNTS["Crimstone"],
    },
    waterTrap: "Mariner Pot",
  },
  "Sea Snail": {
    chum: {
      "Chewed Bone": CRUSTACEAN_CHUM_AMOUNTS["Chewed Bone"],
      Ruffroot: CRUSTACEAN_CHUM_AMOUNTS["Ruffroot"],
    },
    waterTrap: "Mariner Pot",
  },
  "Garden Eel": {
    chum: {
      Dewberry: CRUSTACEAN_CHUM_AMOUNTS["Dewberry"],
      Duskberry: CRUSTACEAN_CHUM_AMOUNTS["Duskberry"],
    },
    waterTrap: "Mariner Pot",
  },
  "Sea Grapes": {
    chum: {
      Lunara: CRUSTACEAN_CHUM_AMOUNTS["Lunara"],
      Crimstone: CRUSTACEAN_CHUM_AMOUNTS["Crimstone"],
    },
    waterTrap: "Mariner Pot",
  },
  Octopus: {
    chum: {
      Moonfur: CRUSTACEAN_CHUM_AMOUNTS["Moonfur"],
    },
    waterTrap: "Mariner Pot",
  },
  "Sea Urchin": {
    chum: {
      "Fish Stick": CRUSTACEAN_CHUM_AMOUNTS["Fish Stick"],
    },
    waterTrap: "Mariner Pot",
  },
  "Horseshoe Crab": {
    chum: {
      "Crab Stick": CRUSTACEAN_CHUM_AMOUNTS["Crab Stick"],
    },
    waterTrap: "Mariner Pot",
  },
};

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

export const WATER_TRAP_ANIMATIONS: Record<WaterTrapName, string> = {
  "Crab Pot": SUNNYSIDE.tools.crab_pot_placed,
  "Mariner Pot": SUNNYSIDE.tools.mariner_pot_placed,
};

/**
 * Reverse lookup: Map from trap type and chum to crustacean name
 * This allows looking up which crustacean will be caught given a trap type and chum
 */
export const getCrustaceanByTrapAndChum = (): Record<
  WaterTrapName,
  Partial<Record<CrustaceanChum | "none", CrustaceanName[]>>
> => {
  const lookup: Record<
    WaterTrapName,
    Partial<Record<CrustaceanChum | "none", CrustaceanName[]>>
  > = {
    "Crab Pot": {},
    "Mariner Pot": {},
  };

  getObjectEntries(CRUSTACEANS).forEach(
    ([crustaceanName, crustacean]: [CrustaceanName, Crustacean]) => {
      const trapType = crustacean.waterTrap;

      if (!crustacean.chum || getKeys(crustacean.chum).length === 0) {
        // No chum required - this is the default catch for this trap
        if (!lookup[trapType]["none"]) {
          lookup[trapType]["none"] = [];
        }
        lookup[trapType]["none"]!.push(crustaceanName);
      } else {
        // Map each chum to this crustacean
        getKeys(crustacean.chum).forEach((chum) => {
          if (!lookup[trapType][chum]) {
            lookup[trapType][chum] = [];
          }
          lookup[trapType][chum]!.push(crustaceanName);
        });
      }
    },
  );

  return lookup;
};

export type CaughtCrustaceanPrngArgs = {
  farmId: number;
  trapId: string;
  counter: number;
};

/**
 * Deterministically pick one crustacean from multiple options
 * using PRNG to ensure FE/BE are in sync.
 */
function selectCrustaceanFromOptions(
  options: CrustaceanName[],
  trapType: WaterTrapName,
  prngArgs: CaughtCrustaceanPrngArgs,
): CrustaceanName {
  const value = prng({
    farmId: prngArgs.farmId,
    itemId: stringToInteger(prngArgs.trapId),
    counter: prngArgs.counter,
    criticalHitName: trapType,
  });
  const index = Math.floor(value * options.length);
  return options[Math.min(index, options.length - 1)];
}

export function caughtCrustacean(
  trapType: WaterTrapName,
  chum?: CrustaceanChum,
  prngArgs?: CaughtCrustaceanPrngArgs,
): Partial<Record<CrustaceanName, number>> {
  const trapMapping = getCrustaceanByTrapAndChum()[trapType];
  const crustaceans = trapMapping[chum ?? "none"];

  if (!crustaceans?.length) {
    throw new Error(`Invalid trap and chum combination: ${trapType} ${chum}`);
  }

  const crustacean =
    crustaceans.length === 1
      ? crustaceans[0]
      : prngArgs
        ? selectCrustaceanFromOptions(crustaceans, trapType, prngArgs)
        : crustaceans[0]; // fallback when no prng (e.g. backfill in collectWaterTrap)

  return {
    [crustacean]: 1,
  };
}
