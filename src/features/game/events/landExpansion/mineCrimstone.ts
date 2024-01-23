import Decimal from "decimal.js-light";
import { CRIMSTONE_RECOVERY_TIME } from "features/game/lib/constants";
import { trackActivity } from "features/game/types/bumpkinActivity";
import cloneDeep from "lodash.clonedeep";
import { GameState, Rock } from "../../types/game";

export type MineCrimstoneAction = {
  type: "crimstoneRock.mined";
  index: number;
};

type Options = {
  state: Readonly<GameState>;
  action: MineCrimstoneAction;
  createdAt?: number;
};

export function canMine(rock: Rock, now: number = Date.now()) {
  const recoveryTime = CRIMSTONE_RECOVERY_TIME;
  return now - rock.stone.minedAt > recoveryTime * 1000;
}

export function mineCrimstone({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);
  const { crimstones, bumpkin } = stateCopy;
  const rock = crimstones?.[action.index];

  if (!rock) {
    throw new Error("Crimstone does not exist");
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
  const amountInInventory = stateCopy.inventory.Crimstone || new Decimal(0);

  rock.stone = {
    minedAt: createdAt,
    amount: 1,
  };

  stateCopy.inventory["Gold Pickaxe"] = toolAmount.sub(1);
  stateCopy.inventory.Crimstone = amountInInventory.add(stoneMined);

  bumpkin.activity = trackActivity("Crimstone Mined", bumpkin.activity);

  return stateCopy;
}
