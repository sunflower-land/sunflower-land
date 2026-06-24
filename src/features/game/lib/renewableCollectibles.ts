import type { CollectibleName } from "features/game/types/craftables";
import type { PlacedItem } from "features/game/types/game";
import { EXPIRY_COOLDOWNS } from "./collectibleBuilt";

export const INVENTORY_RENEWABLE_COLLECTIBLES = [
  "Time Warp Totem",
  "Super Totem",
  "Gourmet Hourglass",
  "Harvest Hourglass",
  "Timber Hourglass",
  "Orchard Hourglass",
  "Blossom Hourglass",
  "Fisher's Hourglass",
  "Ore Hourglass",
] as const;

export type InventoryRenewableCollectibleName =
  (typeof INVENTORY_RENEWABLE_COLLECTIBLES)[number];

export const isInventoryRenewableCollectible = (
  name: CollectibleName,
): name is InventoryRenewableCollectibleName =>
  INVENTORY_RENEWABLE_COLLECTIBLES.includes(
    name as InventoryRenewableCollectibleName,
  );

export const hasCollectibleExpired = ({
  name,
  collectible,
  now = Date.now(),
}: {
  name: InventoryRenewableCollectibleName;
  collectible: PlacedItem;
  now?: number;
}) => {
  const cooldown = EXPIRY_COOLDOWNS[name];

  if (!cooldown) {
    return false;
  }

  return (collectible.createdAt ?? 0) + cooldown <= now;
};
