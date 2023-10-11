import { SUNNYSIDE } from "assets/sunnyside";
import { KNOWN_IDS } from "features/game/types";
import { SeasonName } from "features/game/types/seasons";
import { MutantCropName } from "features/game/types/beans";
import { MutantChicken } from "features/game/types/craftables";
import { Mutants } from "./pages/Mutants";

// Section Icons
import mutantIcon from "assets/icons/mutants.webp";
import { MyFarm } from "./pages/MyFarm";
import { InventoryItemName } from "features/game/types/game";

export type CodexCategoryName = "My Farm" | "Fish" | "Mutants";

export interface CodexCategory {
  name: CodexCategoryName;
  icon: string;
  component: React.FC;
}

export const categories: CodexCategory[] = [
  {
    name: "My Farm",
    icon: SUNNYSIDE.icons.player_small,
    component: MyFarm,
  },
  {
    name: "Fish",
    icon: SUNNYSIDE.icons.heart,
    component: Mutants,
  },
  {
    name: "Mutants",
    icon: mutantIcon,
    component: Mutants,
  },
];

export type AssetType = "collectible" | "wearable" | "bud";

export type CodexTabIndex = keyof typeof categories;

// Extend from this type for more detailed information
export type BaseInformation = {
  id: number;
  name: string;
  season?: SeasonName;
  howToObtain: string[];
  type: AssetType;
  relatedItems?: InventoryItemName[];
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
      howToObtain: ["Can be found when harvesting a Magic Bean.", "OpenSea"],
      type: "collectible",
      relatedItems: ["Magic Bean"],
    },
    "Potent Potato": {
      id: KNOWN_IDS["Potent Potato"],
      name: "Potent Potato",
      howToObtain: ["Can be found when harvesting a Magic Bean.", "OpenSea"],
      type: "collectible",
      relatedItems: ["Magic Bean"],
    },
    "Radical Radish": {
      id: KNOWN_IDS["Radical Radish"],
      name: "Radical Radish",
      howToObtain: ["Can be found when harvesting a Magic Bean.", "OpenSea"],
      type: "collectible",
      relatedItems: ["Magic Bean"],
    },
  },
  chickens: {
    "Speed Chicken": {
      id: KNOWN_IDS["Speed Chicken"],
      name: "Speed Chicken",
      howToObtain: [
        "Can be found when collecting eggs laid by Chickens.",
        "OpenSea",
      ],
      type: "collectible",
    },
    "Rich Chicken": {
      id: KNOWN_IDS["Rich Chicken"],
      name: "Rich Chicken",
      howToObtain: [
        "Can be found when collecting eggs laid by Chickens.",
        "OpenSea",
      ],
      type: "collectible",
    },
    "Fat Chicken": {
      id: KNOWN_IDS["Fat Chicken"],
      name: "Fat Chicken",
      howToObtain: [
        "Can be found when collecting eggs laid by Chickens.",
        "OpenSea",
      ],
      type: "collectible",
    },
    "El Pollo Veloz": {
      id: KNOWN_IDS["El Pollo Veloz"],
      name: "El Pollo Veloz",
      season: "Witches' Eve",
      howToObtain: [
        "Can be found when collecting eggs laid by Chickens.",
        "OpenSea",
      ],
      type: "collectible",
    },
    "Ayam Cemani": {
      id: KNOWN_IDS["Ayam Cemani"],
      name: "Ayam Cemani",
      season: "Dawn Breaker",
      howToObtain: [
        "Can be found when collecting eggs laid by Chickens.",
        "OpenSea",
      ],
      type: "collectible",
    },
  },
};
