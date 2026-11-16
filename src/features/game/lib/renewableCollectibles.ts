import type { CollectibleName } from "features/game/types/craftables";
import type { PlacedItem } from "features/game/types/game";
import { getCollectibleExpiry, EXPIRY_COOLDOWNS } from "./collectibleBuilt";

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
  // Routed through getCollectibleExpiry so renewal eligibility uses the same
  // (possibly rebalanced) duration as the boost window / active check, and
  // honours any time bought via `collectible.extended`.
  if (!EXPIRY_COOLDOWNS[name]) {
    return false;
  }

  return getCollectibleExpiry({ name, collectible }) <= now;
};
