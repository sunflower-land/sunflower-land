import { EVENT_ERRORS } from "features/game/expansion/lib/errorMessages";
import { GOLD_MINE_STAMINA_COST } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";
import { replenishStamina } from "./replenishStamina";

export type LandExpansionMineGoldAction = {
  type: "goldRock.mined";
  expansionIndex: number;
  index: number;
};

type Options = {
  state: Readonly<GameState>;
  action: LandExpansionMineGoldAction;
  createdAt?: number;
};

export function mineGold({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const replenishedState = replenishStamina({
    state,
    action: { type: "bumpkin.replenishStamina" },
    createdAt,
  });
  const stateCopy = cloneDeep(replenishedState);
  const { expansions, bumpkin } = stateCopy;
  const expansion = expansions[action.expansionIndex];

  if (!bumpkin) {
    throw new Error(EVENT_ERRORS.NO_BUMPKIN);
  }

  if (bumpkin.stamina.value < GOLD_MINE_STAMINA_COST) {
    throw new Error(EVENT_ERRORS.NO_STAMINA);
  }

  if (!expansion) {
    throw new Error(EVENT_ERRORS.NO_EXPANSION);
  }

  const { gold } = expansion;

  if (!gold) {
    throw new Error(EVENT_ERRORS.EXPANSION_HAS_NO_GOLD);
  }

  return stateCopy;
}
