import { GameState } from "../types/game";

export type RevealAction = {
  type: "expansion.revealed";
};

type Options = {
  state: Readonly<GameState>;
  action: RevealAction;
  createdAt?: number;
};

/**
 * Non-state altering event at the moment
 */
export function reveal({ state, action }: Options): GameState {
  return state;
}
