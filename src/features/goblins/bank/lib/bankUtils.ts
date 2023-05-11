import Decimal from "decimal.js-light";
import { GoblinState } from "features/game/lib/goblinMachine";
import { InventoryItemName } from "features/game/types/game";
import { WITHDRAWABLES } from "features/game/types/withdrawables";

type CanWithdrawArgs = {
  itemName: InventoryItemName;
  gameState: GoblinState;
  selectedAmont: Decimal;
};

/**
 * Checks whether the next item can be withdrawn.
 * @param itemName The item name.
 * @param gameState The goblin game state.
 * @param selectedAmont The already selected amount for withdraw for the item.
 * @returns
 */
export function canWithdraw({
  itemName,
  gameState,
  selectedAmont,
}: CanWithdrawArgs): boolean {
  // transformation has already applied to inventory to remove placed amount
  const inventoryAmount = gameState.inventory[itemName] ?? new Decimal(0);

  // does not allow players to withdraw items if they do not have any
  if (inventoryAmount.lessThanOrEqualTo(0)) return false;

  // allow players to withdraw items if they have multiple copies of it
  if (inventoryAmount.minus(selectedAmont).greaterThan(1)) return true;

  // check for the remainig 1 item
  const canWithdraw = WITHDRAWABLES[itemName];
  return typeof canWithdraw === "function"
    ? canWithdraw(gameState)
    : canWithdraw;
}
