import cloneDeep from "lodash.clonedeep";
import { GameState } from "../types/game";

export type FulfillGoblinGrubOrder = {
  type: "goblinGrubOrder.fulfilled";
  index: number;
  orderId: number;
};

type Options = {
  state: Readonly<GameState>;
  action: FulfillGoblinGrubOrder;
  createdAt?: number;
};

export function fulfillGoblinGrubOrder({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep(state);

  // Check if order exists

  // Subtract meal

  // Give rewards

  // Remove order

  return game;
}
