import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";
import { GameState, LandExpansionRock } from "../../types/game";

export type LandExpansionStoneMineAction = {
  type: "rock.mined";
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
  const stateCopy = cloneDeep(state);
  const { expansions } = stateCopy;
  const expansion = expansions[action.expansionIndex];

  if (!expansion) {
    throw new Error("Expansion does not exist");
  }

  const { stones } = expansion;

  if (!stones) {
    throw new Error("Expansion has no stones");
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

  return {
    ...stateCopy,
    expansions,
    inventory: {
      ...stateCopy.inventory,
      Pickaxe: toolAmount.sub(1),
      Stone: amountInInventory.add(stoneMined),
    },
  };
}
