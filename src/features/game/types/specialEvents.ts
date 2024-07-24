import { InventoryItemName, Wardrobe } from "./game";

export type SpecialEventName =
  | "Lunar New Year"
  | "Earn Alliance Banner"
  | "One Planet Popper"
  | "Gas Hero"
  | "Easter"
  | "La Tomatina";

export type Task = {
  requirements: {
    items: Partial<Record<InventoryItemName, number>>;
    sfl: number;
  };
  reward: {
    wearables: Wardrobe;
    items: Partial<Record<InventoryItemName, number>>;
    sfl: number;
  };
  isAirdrop?: boolean;
  airdropUrl?: string;
  completedAt?: number;
};

export type SpecialEvent = {
  text: string;
  startAt: number;
  endAt: number;
  tasks: Task[];
  isEligible: boolean;
  requiresWallet: boolean;
  bonus?: Partial<Record<InventoryItemName, { saleMultiplier: number }>>;
};

export type CurrentSpecialEvents = Partial<Record<string, SpecialEvent>>;

export type SpecialEvents = {
  history: Record<number, Partial<Record<string, number>>>;
  current: CurrentSpecialEvents;
};
