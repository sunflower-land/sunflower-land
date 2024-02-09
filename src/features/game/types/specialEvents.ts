import { InventoryItemName, Wardrobe } from "./game";

type Task = {
  requirements: {
    items: Partial<Record<InventoryItemName, number>>;
    sfl: number;
  };
  reward: {
    wearables: Wardrobe;
    items: Partial<Record<InventoryItemName, number>>;
    sfl: number;
  };
  completedAt?: number;
};

type SpecialEvent = {
  text: string;
  startAt: number;
  endAt: number;
  tasks: Task[];
};

export type CurrentSpecialEvents = Partial<Record<string, SpecialEvent>>;

export type SpecialEvents = {
  history: Record<number, Partial<Record<string, number>>>;
  current: CurrentSpecialEvents;
};
