import { BumpkinActivityName } from "./bumpkinActivity";
import { InventoryItemName } from "./game";
import { getSeasonalTicket } from "./seasons";

export type Chore = {
  activity: BumpkinActivityName;
  description: string;
  requirement: number;
  reward: {
    items: Partial<Record<InventoryItemName, number>>;
  };
};

export const CHORES: Chore[] = [
  {
    activity: "Sunflower Harvested",
    description: "Harvest 25 Sunflowers",
    requirement: 2,
    reward: {
      items: {
        "Sunflower Seed": 5,
        [getSeasonalTicket()]: 1,
      },
    },
  },
  {
    activity: "Pumpkin Harvested",
    description: "Harvest 20 Pumpkins",
    requirement: 20,
    reward: {
      items: {
        "Pumpkin Seed": 5,
        [getSeasonalTicket()]: 2,
      },
    },
  },
  {
    activity: "Potato Harvested",
    description: "Harvest 50 Potatoes",
    requirement: 50,
    reward: {
      items: {
        "Potato Seed": 10,
        [getSeasonalTicket()]: 5,
      },
    },
  },
];
