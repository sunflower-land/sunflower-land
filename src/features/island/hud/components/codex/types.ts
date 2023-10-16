import { KNOWN_IDS } from "features/game/types";
import { SeasonName } from "features/game/types/seasons";
import { MutantCropName } from "features/game/types/beans";
import { MutantChicken } from "features/game/types/craftables";
import { Mutants } from "./pages/Mutants";
import { categories } from "./Codex";

export type CodexCategoryName = "My Farm" | "Fish" | "Mutants" | "Guide";
export type CollectionGroup = "mutants" | "fish";

export interface CodexCategory {
  name: CodexCategoryName;
  icon: string;
}

type BoostType = "speed" | "quantity" | "critical hit" | "special";

type Boost = {
  item: string;
  /**
   * Short clear description of the boost eg. +0.1 Carrots -10% Grow Time
   */
  boost: string;
  type: BoostType;
};

export type AssetType = "collectible" | "wearable" | "bud";

export type CodexTabIndex = keyof typeof categories;

// Extend from this type for more detailed information
export type BaseInformation = {
  id: number;
  name: string;
  season?: SeasonName;
  howToObtain: string[];
  type: AssetType;
  // Leave empty if no boosts
  boosts: Boost[];
};

export type Mutants = {
  crops: Record<MutantCropName, BaseInformation>;
  chickens: Record<MutantChicken, BaseInformation>;
};

export type MutantType = keyof Mutants;

export const mutants: Mutants = {
  crops: {
    "Stellar Sunflower": {
      id: KNOWN_IDS["Stellar Sunflower"],
      name: "Stellar Sunflower",
      howToObtain: ["Can be found when harvesting a Magic Bean."],
      type: "collectible",
      boosts: [
        {
          type: "critical hit",
          item: "Sunflower",
          boost: "+10 Sunflowers",
        },
      ],
    },
    "Potent Potato": {
      id: KNOWN_IDS["Potent Potato"],
      name: "Potent Potato",
      howToObtain: ["Can be found when harvesting a Magic Bean."],
      type: "collectible",
      boosts: [
        {
          type: "critical hit",
          item: "Potato",
          boost: "+1 Potato",
        },
      ],
    },
    "Radical Radish": {
      id: KNOWN_IDS["Radical Radish"],
      name: "Radical Radish",
      howToObtain: ["Can be found when harvesting a Magic Bean."],
      type: "collectible",
      boosts: [
        {
          type: "critical hit",
          item: "Radish",
          boost: "+10 Radishes",
        },
      ],
    },
  },
  chickens: {
    "Speed Chicken": {
      id: KNOWN_IDS["Speed Chicken"],
      name: "Speed Chicken",
      howToObtain: ["Can be found when collecting eggs laid by Chickens."],
      type: "collectible",
      boosts: [
        {
          type: "speed",
          boost: "+10% Lay Time",
          item: "Egg",
        },
      ],
    },
    "Rich Chicken": {
      id: KNOWN_IDS["Rich Chicken"],
      name: "Rich Chicken",
      howToObtain: ["Can be found when collecting eggs laid by Chickens."],
      type: "collectible",
      boosts: [
        {
          type: "quantity",
          boost: "-10% Lay Time",
          item: "Egg",
        },
      ],
    },
    "Fat Chicken": {
      id: KNOWN_IDS["Fat Chicken"],
      name: "Fat Chicken",
      howToObtain: ["Can be found when collecting eggs laid by Chickens."],
      type: "collectible",
      boosts: [
        {
          type: "special",
          boost: "-10% Chicken Food",
          item: "Wheat",
        },
      ],
    },
    "El Pollo Veloz": {
      id: KNOWN_IDS["El Pollo Veloz"],
      name: "El Pollo Veloz",
      season: "Witches' Eve",
      howToObtain: ["Can be found when collecting eggs laid by Chickens."],
      type: "collectible",
      boosts: [{ type: "speed", boost: "-4 hrs Lay Time", item: "Egg" }],
    },
    "Ayam Cemani": {
      id: KNOWN_IDS["Ayam Cemani"],
      name: "Ayam Cemani",
      season: "Dawn Breaker",
      howToObtain: ["Can be found when collecting eggs laid by Chickens."],
      type: "collectible",
      boosts: [
        {
          type: "quantity",
          boost: "+0.2 Eggs",
          item: "Egg",
        },
      ],
    },
  },
};
