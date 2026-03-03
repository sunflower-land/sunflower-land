import Decimal from "decimal.js-light";
import { SUNSTONE_RECOVERY_TIME } from "features/game/lib/constants";
import { canMine } from "features/game/lib/resourceNodes";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { BoostName, GameState } from "features/game/types/game";
import { produce } from "immer";

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
  return produce(state, (stateCopy) => {
    const { bumpkin } = stateCopy;
    const { index } = action;

    if (!bumpkin) {
      throw new Error(EVENT_ERRORS.NO_BUMPKIN);
    }

    const sunstoneRock = stateCopy.sunstones[index];

    if (!sunstoneRock) {
      throw new Error(EVENT_ERRORS.NO_SUNSTONE);
    }

    if (sunstoneRock.x === undefined && sunstoneRock.y === undefined) {
      throw new Error("Sunstone rock is not placed");
    }

    if (!canMine(sunstoneRock, "Sunstone Rock", createdAt)) {
      throw new Error(EVENT_ERRORS.STILL_RECOVERING);
    }

    const toolAmount = stateCopy.inventory["Gold Pickaxe"] || new Decimal(0);

    if (toolAmount.lessThan(1)) {
      throw new Error(EVENT_ERRORS.NO_PICKAXES);
    }

    const sunstoneMined = 1;
    const amountInInventory = stateCopy.inventory.Sunstone || new Decimal(0);

    sunstoneRock.stone = {
      minedAt: createdAt,
    };

    stateCopy.inventory["Gold Pickaxe"] = toolAmount.sub(1);
    stateCopy.inventory.Sunstone = amountInInventory.add(sunstoneMined);

    stateCopy.sunstones[index].minesLeft = sunstoneRock.minesLeft - 1;

    if (stateCopy.sunstones[index].minesLeft === 0) {
      delete stateCopy.sunstones[index];
      stateCopy.inventory["Sunstone Rock"] =
        stateCopy.inventory["Sunstone Rock"]?.sub(1);
    }

    stateCopy.farmActivity = trackFarmActivity(
      "Sunstone Mined",
      stateCopy.farmActivity,
    );

    return stateCopy;
  });
}

export function getSunstoneRecoveryTimeForDisplay(_game: GameState): {
  baseTimeMs: number;
  recoveryTimeMs: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  const baseTimeMs = SUNSTONE_RECOVERY_TIME * 1000;
  return {
    baseTimeMs,
    recoveryTimeMs: baseTimeMs,
    boostsUsed: [],
  };
}
