import Decimal from "decimal.js-light";
import { canMine } from "features/game/expansion/lib/utils";
import { GOLD_MINE_STAMINA_COST } from "features/game/lib/constants";
import { trackActivity } from "features/game/types/bumpkinActivity";
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

export enum EVENT_ERRORS {
  NO_PICKAXES = "No iron pickaxes left",
  NO_GOLD = "No gold",
  STILL_RECOVERING = "Gold is still recovering",
  EXPANSION_HAS_NO_GOLD = "Expansion has no gold",
  NO_EXPANSION = "Expansion does not exist",
  NO_STAMINA = "You do not have enough stamina",
  NO_BUMPKIN = "You do not have a Bumpkin",
}

export const GOLD_RECOVERY_TIME = 24 * 60 * 60;

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
  const { index, expansionIndex } = action;
  const expansion = expansions[expansionIndex];

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

  const goldRock = gold[index];

  if (!goldRock) {
    throw new Error("No gold rock found.");
  }

  if (!canMine(goldRock, GOLD_RECOVERY_TIME, createdAt)) {
    throw new Error(EVENT_ERRORS.STILL_RECOVERING);
  }

  const toolAmount = stateCopy.inventory["Iron Pickaxe"] || new Decimal(0);

  if (toolAmount.lessThan(1)) {
    throw new Error(EVENT_ERRORS.NO_PICKAXES);
  }

  const goldMined = goldRock.stone.amount;
  const amountInInventory = stateCopy.inventory.Gold || new Decimal(0);

  goldRock.stone = {
    minedAt: createdAt,
    amount: 2,
  };
  bumpkin.stamina.value -= GOLD_MINE_STAMINA_COST;

  bumpkin.activity = trackActivity("Gold Mined", bumpkin.activity);

  stateCopy.inventory["Iron Pickaxe"] = toolAmount.sub(1);
  stateCopy.inventory.Gold = amountInInventory.add(goldMined);

  return stateCopy;
}
