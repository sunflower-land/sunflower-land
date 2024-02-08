import { InventoryItemName } from "./game";

type Task = {
  requirements: {
    items: Partial<Record<InventoryItemName, number>>;
    sfl: number;
  };
  reward: {
    items: Partial<Record<InventoryItemName, number>>;
    sfl: number;
  };
  completedAt?: number;
};

type SpecialEvent = {
  startAt: number;
  endAt: number;
  tasks: Task[];
};

export type CurrentSpecialEvents = Partial<Record<string, SpecialEvent>>;

export type SpecialEvents = {
  history: Record<number, Partial<Record<string, number>>>;
  current: CurrentSpecialEvents;
};
