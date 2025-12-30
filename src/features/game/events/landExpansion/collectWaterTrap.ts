import { produce } from "immer";
import Decimal from "decimal.js-light";
import { GameState, InventoryItemName } from "../../types/game";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { getObjectEntries } from "features/game/expansion/lib/utils";

export type CollectWaterTrapAction = {
  type: "waterTrap.collected";
  trapId: string;
};

type Options = {
  state: Readonly<GameState>;
  action: CollectWaterTrapAction;
  createdAt?: number;
};

export function collectWaterTrap({ state, action }: Options): GameState {
  return produce(state, (game) => {
    const trapSpots = game.crabTraps.trapSpots || {};
    const waterTrap = trapSpots[action.trapId]?.waterTrap;

    if (!waterTrap) {
      throw new Error("No water trap placed at this spot");
    }

    if (!waterTrap.caught) {
      throw new Error("Trap has not been picked up yet");
    }

    const caught = waterTrap.caught;
    getObjectEntries(caught).forEach(([item, amount]) => {
      if (amount) {
        const currentAmount =
          game.inventory[item as InventoryItemName] ?? new Decimal(0);
        game.inventory[item as InventoryItemName] = currentAmount.add(amount);
      }
    });

    getObjectEntries(caught).forEach(([itemName, amount]) => {
      if (amount) {
        game.farmActivity = trackFarmActivity(
          `${itemName} Caught`,
          game.farmActivity,
          new Decimal(amount),
        );
      }
    });

    delete trapSpots[action.trapId].waterTrap;

    return game;
  });
}
