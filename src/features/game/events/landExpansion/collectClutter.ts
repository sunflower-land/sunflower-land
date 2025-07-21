import Decimal from "decimal.js-light";
import { GameState } from "../../types/game";
import { produce } from "immer";

export type CollectClutterAction = {
  type: "clutter.collected";
  id: string;
  visitorId: number;
};

type Options = {
  state: Readonly<GameState>;
  action: CollectClutterAction;
  createdAt?: number;
};

export function collectClutter({ state, action }: Options) {
  return produce(state, (game) => {
    const clutters = game.socialFarming?.clutter?.locations;

    if (!clutters || !clutters[action.id]) {
      throw new Error("No clutter found");
    }

    const clutter = clutters[action.id];
    delete clutters[action.id];

    const inventoryClutter = game.inventory[clutter.type] ?? new Decimal(0);
    game.inventory[clutter.type] = inventoryClutter.add(1);

    return game;
  });
}
