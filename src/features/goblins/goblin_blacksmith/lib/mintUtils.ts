import { MintedAt } from "features/game/actions/loadSession";
import { InventoryItemName } from "features/game/types/game";

type CanMintArgs = {
  itemsMintedAt?: MintedAt;
  item: InventoryItemName;
};

/**
 * How many seconds until a user can mint again
 */
export function mintCooldown({ item, itemsMintedAt }: CanMintArgs) {
  const mintedItems: MintedAt = itemsMintedAt || {};
  const lastMintedAt = mintedItems[item];

  if (!lastMintedAt) {
    return 0;
  }

  // 7 day period between minting items enforced on backend
  const diff = lastMintedAt + 7 * 24 * 60 * 60 * 1000 - Date.now();

  if (diff < 0) {
    return 0;
  }

  return diff / 1000;
}
