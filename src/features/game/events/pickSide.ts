import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";
import { GameState } from "../types/game";

export enum WarSide {
  Goblin = "goblin",
  Human = "human",
}

export type PickSide = {
  type: "side.picked";
  side: WarSide;
};

type Options = {
  state: Readonly<GameState>;
  action: PickSide;
  createdAt?: number;
};

export function pickSide({ state, action }: Options): GameState {
  const stateCopy = cloneDeep(state);
  const { inventory } = stateCopy;

  if (
    inventory["Goblin War Banner"]?.gt(0) ||
    inventory["Human War Banner"]?.gt(0)
  ) {
    throw Error("You have already picked a side");
  }

  const warBanner =
    action.side === WarSide.Goblin ? "Goblin War Banner" : "Human War Banner";

  return {
    ...stateCopy,
    inventory: {
      ...inventory,
      [warBanner]: new Decimal(1),
    },
  };
}
