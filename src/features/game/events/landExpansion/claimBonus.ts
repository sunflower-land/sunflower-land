import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

type Bonus = "discord-signup";

export type ClaimBonusAction = {
  type: "bonus.claimed";
  name: Bonus;
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimBonusAction;
  createdAt?: number;
};

export function claimBonus({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep(state);

  return game;
}
