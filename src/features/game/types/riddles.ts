import { InventoryItemName } from "./game";

export type Riddle = {
  id: string;
  startAt: number;
  endAt: number;
  hint: string;
  reward: {
    items: Partial<Record<InventoryItemName, number>>;
  };
};
