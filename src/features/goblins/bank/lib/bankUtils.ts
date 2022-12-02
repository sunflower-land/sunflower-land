import { GoblinState } from "features/game/lib/goblinMachine";
import { InventoryItemName } from "features/game/types/game";
import { WITHDRAWABLES } from "features/game/types/withdrawables";

type CanWithdrawArgs = {
  item: InventoryItemName;
  game: GoblinState;
};

export function canWithdraw({ item, game }: CanWithdrawArgs): boolean {
  const canWithdraw = WITHDRAWABLES[item];

  if (typeof canWithdraw === "function") {
    return canWithdraw(game);
  }

  return canWithdraw;
}
