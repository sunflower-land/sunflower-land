import { GameState, InventoryItemName } from "../types/game";

export type Blessing = {
  offering: {
    item: InventoryItemName;
    prize: InventoryItemName;
  };
  offered?: {
    items: Partial<Record<InventoryItemName, number>>;
    offeredAt: number;
  };
  reward?: {
    createdAt: number;
    coins: number;
    items?: Partial<Record<InventoryItemName, number>>;
  };
};

// 5 minutes after the end of day
export const GUARDIAN_PENDING_MS = 5 * 60 * 1000 + 24 * 60 * 60 * 1000;

export function blessingIsReady({ game }: { game: GameState }) {
  const offered = game.blessing.offered;

  if (!offered) return false;

  const offeredDate = new Date(offered.offeredAt).toISOString().slice(0, 10);
  const isReady =
    Date.now() > new Date(offeredDate).getTime() + GUARDIAN_PENDING_MS;

  return isReady;
}
