import type { CollectibleName } from "features/game/types/craftables";
import type { GameState, PlacedItem } from "features/game/types/game";
import { getExpiryCooldown } from "./collectibleBuilt";

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
  game,
  now = Date.now(),
}: {
  name: InventoryRenewableCollectibleName;
  collectible: PlacedItem;
  game: GameState;
  now?: number;
}) => {
  // Flag-gated so renewal eligibility uses the same (possibly rebalanced)
  // duration as the boost window / active check under SPEED_BOOSTS.
  const cooldown = getExpiryCooldown(name, game);

  if (!cooldown) {
    return false;
  }

  return (collectible.createdAt ?? 0) + cooldown <= now;
};
