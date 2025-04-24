import { BumpkinItem } from "./bumpkin";
import { GameState, InventoryItemName } from "./game";

export function getActiveFloatingIsland({ state }: { state: GameState }) {
  const schedule = state.floatingIsland.schedule;
  const now = Date.now();
  return schedule.find(
    (schedule) => now >= schedule.startAt && now <= schedule.endAt,
  );
}

type FloatingShopBase = {
  cost: { items: Partial<Record<InventoryItemName, number>> };
  type: "wearable" | "collectible";
};

export type FloatingShopWearable = FloatingShopBase & {
  name: BumpkinItem;
};
export type FloatingShopCollectible = FloatingShopBase & {
  name: InventoryItemName;
};

export type FloatingShopItem = FloatingShopWearable | FloatingShopCollectible;

export type FloatingIslandShop = Partial<
  Record<InventoryItemName | BumpkinItem, FloatingShopItem>
>;
