import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";
import { KNOWN_IDS } from "features/game/types";
import { SeasonName } from "features/game/types/seasons";
import { MutantCropName } from "features/game/types/beans";
import { MutantChicken } from "features/game/types/craftables";
import { Mutants } from "./pages/Mutants";

// Section Icons
import mutantIcon from "assets/icons/mutants.webp";
import { MyFarm } from "./pages/MyFarm";

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

export type CodexTabIndex = keyof typeof categories;

// Extend from this type for more detailed information
export type BaseInformation = {
  id: number;
  name: string;
  description: string;
  image: string;
  season?: SeasonName;
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
      description: ITEM_DETAILS["Stellar Sunflower"].description,
      image: ITEM_DETAILS["Stellar Sunflower"].image,
    },
    "Potent Potato": {
      id: KNOWN_IDS["Potent Potato"],
      name: "Potent Potato",
      description: ITEM_DETAILS["Potent Potato"].description,
      image: ITEM_DETAILS["Potent Potato"].image,
    },
    "Radical Radish": {
      id: KNOWN_IDS["Radical Radish"],
      name: "Radical Radish",
      description: ITEM_DETAILS["Radical Radish"].description,
      image: ITEM_DETAILS["Radical Radish"].image,
    },
  },
  chickens: {
    "Speed Chicken": {
      id: KNOWN_IDS["Speed Chicken"],
      name: "Speed Chicken",
      description: ITEM_DETAILS["Speed Chicken"].description,
      image: ITEM_DETAILS["Speed Chicken"].image,
    },
    "Rich Chicken": {
      id: KNOWN_IDS["Rich Chicken"],
      name: "Rich Chicken",
      description: ITEM_DETAILS["Rich Chicken"].description,
      image: ITEM_DETAILS["Rich Chicken"].image,
    },
    "Fat Chicken": {
      id: KNOWN_IDS["Fat Chicken"],
      name: "Fat Chicken",
      description: ITEM_DETAILS["Fat Chicken"].description,
      image: ITEM_DETAILS["Fat Chicken"].image,
    },
    "El Pollo Veloz": {
      id: KNOWN_IDS["El Pollo Veloz"],
      name: "El Pollo Veloz",
      description: ITEM_DETAILS["El Pollo Veloz"].description,
      image: ITEM_DETAILS["El Pollo Veloz"].image,
      season: "Witches' Eve",
    },
    "Ayam Cemani": {
      id: KNOWN_IDS["Ayam Cemani"],
      name: "Ayam Cemani",
      description: ITEM_DETAILS["Ayam Cemani"].description,
      image: ITEM_DETAILS["Ayam Cemani"].image,
      season: "Dawn Breaker",
    },
  },
};
