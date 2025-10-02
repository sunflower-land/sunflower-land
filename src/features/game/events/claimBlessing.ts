import { produce } from "immer";
import { GameState } from "../types/game";
import Decimal from "decimal.js-light";
import { getKeys } from "../types/decorations";

export type ClaimBlessingAction = {
  type: "blessing.claimed";
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimBlessingAction;
  createdAt?: number;
};

export function claimBlessing({ state }: Options): GameState {
  return produce(state, (game) => {
    const reward = game.blessing.reward;

    if (!reward) {
      throw new Error("No reward exists");
    }

    game.coins += reward.coins ?? 0;

    getKeys(reward.items ?? {}).forEach((itemName) => {
      const current = game.inventory[itemName] || new Decimal(0);
      const previous = game.previousInventory[itemName] || new Decimal(0);

      game.inventory[itemName] = current.add(reward.items?.[itemName] ?? 0);
      game.previousInventory[itemName] = previous.add(
        reward.items?.[itemName] ?? 0,
      );
    });

    delete game.blessing.reward;

    return game;
  });
}
