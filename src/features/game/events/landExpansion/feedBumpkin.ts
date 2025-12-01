import Decimal from "decimal.js-light";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { ConsumableName, CONSUMABLES } from "features/game/types/consumables";
import { GameState } from "features/game/types/game";
import { getFoodExpBoost } from "features/game/expansion/lib/boosts";
import { produce } from "immer";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";

export enum FEED_BUMPKIN_ERRORS {
  MISSING_BUMPKIN = "You do not have a Bumpkin",
  INVALID_AMOUNT = "Invalid amount",
  NOT_ENOUGH_FOOD = "Insufficient quantity to feed bumpkin",
}

export type FeedBumpkinAction = {
  type: "bumpkin.feed";
  food: ConsumableName;
  amount: number;
};

type Options = {
  state: Readonly<GameState>;
  action: FeedBumpkinAction;
  createdAt?: number;
};

export function feedBumpkin({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const bumpkin = stateCopy.bumpkin;
    const inventory = stateCopy.inventory;

    // throws error when player does not have a bumpkin
    if (bumpkin === undefined) {
      throw new Error(FEED_BUMPKIN_ERRORS.MISSING_BUMPKIN);
    }

    // throws error when feeding invalid amount of food (undefined or negative number)
    const feedAmount = new Decimal(action.amount ?? 1);
    if (feedAmount.lessThanOrEqualTo(0)) {
      throw new Error(FEED_BUMPKIN_ERRORS.INVALID_AMOUNT);
    }

    // throws error if there are not enough in the inventory to feed the bumpkin
    const inventoryFoodCount = inventory[action.food] ?? new Decimal(0);
    if (inventoryFoodCount.lessThan(feedAmount)) {
      throw new Error(FEED_BUMPKIN_ERRORS.NOT_ENOUGH_FOOD);
    }

    // reduce inventory food amount
    inventory[action.food] = inventoryFoodCount.sub(feedAmount);

    // increase bumpkin experience
    const { boostedExp: foodExperience, boostsUsed } = getFoodExpBoost({
      food: CONSUMABLES[action.food],
      game: stateCopy,
      createdAt,
    });

    bumpkin.experience += Number(foodExperience.mul(feedAmount));

    // tracks activity
    stateCopy.farmActivity = trackFarmActivity(
      `${action.food} Fed`,
      stateCopy.farmActivity,
      feedAmount,
    );
    stateCopy.boostsUsedAt = updateBoostUsed({
      game: stateCopy,
      boostNames: boostsUsed,
      createdAt,
    });
    // return new state
    return stateCopy;
  });
}
