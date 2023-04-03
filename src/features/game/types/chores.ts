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
    description: "Plant 3 Sunflowers",
    requirement: 3,
    reward: {
      items: {
        "Potato Seed": 5,
      },
    },
  },
  {
    activity: "Mashed Potato Fed",
    description: "Eat 1 Mashed Potato",
    requirement: 1,
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
