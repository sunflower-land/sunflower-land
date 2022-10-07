import { GameState } from "features/game/types/game";

export type FulFillGrubOrderAction = {
  type: "grubOrder.fulfilled";
  index: number;
};

type Options = {
  state: Readonly<GameState>;
  action: FulFillGrubOrderAction;
  createdAt?: number;
};

export function fulfillGrubOrder({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return state;
}
