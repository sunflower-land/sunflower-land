import Decimal from "decimal.js-light";
import { RUBY_RECOVERY_TIME } from "features/game/lib/constants";
import { trackActivity } from "features/game/types/bumpkinActivity";
import cloneDeep from "lodash.clonedeep";
import { GameState, Rock } from "../../types/game";

export type MineRubyAction = {
  type: "rubyRock.mined";
  index: number;
};

type Options = {
  state: Readonly<GameState>;
  action: MineRubyAction;
  createdAt?: number;
};

export function canMine(rock: Rock, now: number = Date.now()) {
  const recoveryTime = RUBY_RECOVERY_TIME;
  return now - rock.stone.minedAt > recoveryTime * 1000;
}

export function mineRuby({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);
  const { rubies, bumpkin } = stateCopy;
  const rock = rubies?.[action.index];

  if (!rock) {
    throw new Error("Ruby does not exist");
  }

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin");
  }

  if (!canMine(rock, createdAt)) {
    throw new Error("Rock is still recovering");
  }

  const toolAmount = stateCopy.inventory["Gold Pickaxe"] || new Decimal(0);

  if (toolAmount.lessThan(1)) {
    throw new Error("No gold pickaxes left");
  }

  const stoneMined = rock.stone.amount;
  const amountInInventory = stateCopy.inventory.Ruby || new Decimal(0);

  rock.stone = {
    minedAt: createdAt,
    amount: 1,
  };

  stateCopy.inventory["Gold Pickaxe"] = toolAmount.sub(1);
  stateCopy.inventory.Ruby = amountInInventory.add(stoneMined);

  bumpkin.activity = trackActivity("Ruby Mined", bumpkin.activity);

  return stateCopy;
}
