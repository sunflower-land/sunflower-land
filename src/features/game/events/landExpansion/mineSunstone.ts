import Decimal from "decimal.js-light";
import { canMine } from "features/game/expansion/lib/utils";
import { SUNSTONE_RECOVERY_TIME } from "features/game/lib/constants";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type MineSunstoneAction = {
  type: "sunstoneRock.mined";
  index: string;
};

type Options = {
  state: Readonly<GameState>;
  action: MineSunstoneAction;
  createdAt?: number;
};

export enum EVENT_ERRORS {
  NO_PICKAXES = "No gold pickaxes left",
  NO_BUMPKIN = "You do not have a Bumpkin",
  NO_SUNSTONE = "No sunstone rock found.",
  STILL_RECOVERING = "Sunstone is still recovering",
}

export function mineSunstone({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);
  const { bumpkin } = stateCopy;
  const { index } = action;

  if (!bumpkin) {
    throw new Error(EVENT_ERRORS.NO_BUMPKIN);
  }

  const sunstoneRock = stateCopy.sunstones[index];

  if (!sunstoneRock) {
    throw new Error(EVENT_ERRORS.NO_SUNSTONE);
  }

  if (!canMine(sunstoneRock, SUNSTONE_RECOVERY_TIME, createdAt)) {
    throw new Error(EVENT_ERRORS.STILL_RECOVERING);
  }

  const toolAmount = stateCopy.inventory["Gold Pickaxe"] || new Decimal(0);

  if (toolAmount.lessThan(1)) {
    throw new Error(EVENT_ERRORS.NO_PICKAXES);
  }

  const sunstoneMined = sunstoneRock.stone.amount;
  const amountInInventory = stateCopy.inventory.Sunstone || new Decimal(0);

  sunstoneRock.stone = {
    minedAt: createdAt,
    amount: 1,
  };

  stateCopy.inventory["Gold Pickaxe"] = toolAmount.sub(1);
  stateCopy.inventory.Sunstone = amountInInventory.add(sunstoneMined);

  stateCopy.sunstones[index].minesLeft = sunstoneRock.minesLeft - 1;

  if (stateCopy.sunstones[index].minesLeft === 0) {
    delete stateCopy.sunstones[index];
  }

  bumpkin.activity = trackActivity("Sunstone Mined", bumpkin.activity);

  return stateCopy;
}
