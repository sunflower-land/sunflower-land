import { GameState } from "../types/game";

export type MineAction = {
  type: "rock.mined";
  index: number;
};

type Options = {
  state: GameState;
  action: MineAction;
  createdAt?: number;
};

export function mine({ state, action, createdAt = Date.now() }: Options) {
  throw new Error("Coming soon!");
  return state;
}
