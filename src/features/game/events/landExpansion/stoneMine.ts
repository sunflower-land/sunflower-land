import Decimal from "decimal.js-light";
import { STONE_MINE_STAMINA_COST } from "features/game/lib/constants";
import { trackActivity } from "features/game/types/bumpkinActivity";
import cloneDeep from "lodash.clonedeep";
import { GameState, LandExpansionRock } from "../../types/game";
import { replenishStamina } from "./replenishStamina";

export type LandExpansionStoneMineAction = {
  type: "stoneRock.mined";
  expansionIndex: number;
  index: number;
};

type Options = {
  state: Readonly<GameState>;
  action: LandExpansionStoneMineAction;
  createdAt?: number;
};

// 4 hours
export const STONE_RECOVERY_TIME = 4 * 60 * 60;

export function canMine(rock: LandExpansionRock, now: number = Date.now()) {
  const recoveryTime = STONE_RECOVERY_TIME;
  return now - rock.stone.minedAt > recoveryTime * 1000;
}

export function mineStone({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const replenishState = replenishStamina({
    state,
    action: { type: "bumpkin.replenishStamina" },
    createdAt,
  });

  const stateCopy = cloneDeep(replenishState);
  const { expansions, bumpkin } = stateCopy;
  const expansion = expansions[action.expansionIndex];

  if (!expansion) {
    throw new Error("Expansion does not exist");
  }

  const { stones } = expansion;

  if (!stones) {
    throw new Error("Expansion has no stones");
  }

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin");
  }

  if (bumpkin.stamina.value < STONE_MINE_STAMINA_COST) {
    throw new Error("You do not have enough stamina");
  }

  const rock = stones[action.index];

  if (!rock) {
    throw new Error("No rock");
  }

  if (!canMine(rock, createdAt)) {
    throw new Error("Rock is still recovering");
  }

  const toolAmount = stateCopy.inventory["Pickaxe"] || new Decimal(0);

  if (toolAmount.lessThan(1)) {
    throw new Error("No pickaxes left");
  }

  const stoneMined = rock.stone.amount;
  const amountInInventory = stateCopy.inventory.Stone || new Decimal(0);

  rock.stone = {
    minedAt: Date.now(),
    amount: 2,
  };

  bumpkin.stamina.value -= STONE_MINE_STAMINA_COST;

  stateCopy.inventory.Pickaxe = toolAmount.sub(1);
  stateCopy.inventory.Stone = amountInInventory.add(stoneMined);

  bumpkin.activity = trackActivity("Stone Mined", bumpkin.activity);

  return stateCopy;
}
