import Decimal from "decimal.js-light";
import { trackFarmActivity } from "features/game/types/farmActivity";
import type { GameState } from "features/game/types/game";
import { produce } from "immer";

/** Shards yielded by mining a single-use Ascension Crystal. */
export const ASCENSION_SHARDS_PER_MINE = 3;

export type MineAscensionCrystalAction = {
  type: "ascensionCrystal.mined";
  index: string;
};

type Options = {
  state: Readonly<GameState>;
  action: MineAscensionCrystalAction;
  createdAt?: number;
};

export enum EVENT_ERRORS {
  NO_PICKAXES = "No gold pickaxes left",
  NO_BUMPKIN = "You do not have a Bumpkin",
  NO_ASCENSION_CRYSTAL = "No ascension crystal found.",
  NOT_PLACED = "Ascension crystal is not placed",
}

export function mineAscensionCrystal({ state, action }: Options): GameState {
  return produce(state, (stateCopy) => {
    const { bumpkin } = stateCopy;
    const { index } = action;

    if (!bumpkin) {
      throw new Error(EVENT_ERRORS.NO_BUMPKIN);
    }

    const ascensionCrystal = stateCopy.ascensionCrystals[index];

    if (!ascensionCrystal) {
      throw new Error(EVENT_ERRORS.NO_ASCENSION_CRYSTAL);
    }

    if (ascensionCrystal.x === undefined || ascensionCrystal.y === undefined) {
      throw new Error(EVENT_ERRORS.NOT_PLACED);
    }

    const toolAmount = stateCopy.inventory["Gold Pickaxe"] || new Decimal(0);

    if (toolAmount.lessThan(1)) {
      throw new Error(EVENT_ERRORS.NO_PICKAXES);
    }

    const amountInInventory =
      stateCopy.inventory["Ascension Shard"] || new Decimal(0);

    stateCopy.inventory["Gold Pickaxe"] = toolAmount.sub(1);
    stateCopy.inventory["Ascension Shard"] = amountInInventory.add(
      ASCENSION_SHARDS_PER_MINE,
    );

    // Single-use: mining destroys the rock.
    delete stateCopy.ascensionCrystals[index];
    stateCopy.inventory["Ascension Crystal"] =
      stateCopy.inventory["Ascension Crystal"]?.sub(1);

    stateCopy.farmActivity = trackFarmActivity(
      "Ascension Crystal Mined",
      stateCopy.farmActivity,
    );

    return stateCopy;
  });
}
