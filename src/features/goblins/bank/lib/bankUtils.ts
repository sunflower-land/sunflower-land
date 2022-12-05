import { GoblinState } from "features/game/lib/goblinMachine";
import { CollectibleName } from "features/game/types/craftables";
import { InventoryItemName } from "features/game/types/game";
import { WITHDRAWABLES } from "features/game/types/withdrawables";

type CanWithdrawArgs = {
  item: InventoryItemName;
  game: GoblinState;
};

export function canWithdraw({ item, game }: CanWithdrawArgs): boolean {
  // Placed items
  if (
    item in game.collectibles &&
    game.collectibles[item as CollectibleName]?.length
  ) {
    const numberInInventory = game.inventory[item];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const numberPlaced = game.collectibles[item as CollectibleName]!.length;

    if (numberInInventory?.gt(numberPlaced)) return true;

    return false;
  }

  const canWithdraw = WITHDRAWABLES[item];

  if (typeof canWithdraw === "function") {
    return canWithdraw(game);
  }

  return canWithdraw;
}
