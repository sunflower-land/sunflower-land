import Decimal from "decimal.js-light";
import { produce } from "immer";
import type { GameState } from "features/game/types/game";
import { getAnimalReadyAt, getPigBristles } from "features/game/lib/animals";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { hasFeatureAccess } from "lib/flags";

export enum TRADE_IN_PIG_ERRORS {
  NO_FEATURE_ACCESS = "You do not have access to Pig trade-ins",
  NOT_FOUND = "Pig does not exist",
  ASLEEP = "Pig is asleep",
  NO_BRISTLES = "Pig pays no Bristles yet",
}

export type TradeInPigAction = {
  type: "pig.tradedIn";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: TradeInPigAction;
  createdAt?: number;
};

/**
 * Trades a Pig in for its level's Pig Bristles (#7721). Always available in
 * the Pigpen under the bounty rules: the Pig must be awake (sick or ready is
 * fine) and its level must pay something - levels 0-2 pay nothing, so they are
 * rejected rather than taken for free.
 */
export function tradeInPig({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    if (!hasFeatureAccess(copy, "PIGPEN")) {
      throw new Error(TRADE_IN_PIG_ERRORS.NO_FEATURE_ACCESS);
    }

    if (!copy.buildings.Pigpen?.some((building) => !!building.coordinates)) {
      throw new Error("Building does not exist");
    }

    const pig = copy.pigpen.animals[action.id];

    if (!pig) {
      throw new Error(TRADE_IN_PIG_ERRORS.NOT_FOUND);
    }

    // Keep the truthiness guard: an animal that has never slept carries
    // `awakeAt: 0` and no marker, and must stay tradeable.
    const readyAt = getAnimalReadyAt(pig, copy);
    if (readyAt && readyAt > createdAt) {
      throw new Error(TRADE_IN_PIG_ERRORS.ASLEEP);
    }

    const { amount, boostsUsed } = getPigBristles({ game: copy, pig });

    if (amount <= 0) {
      throw new Error(TRADE_IN_PIG_ERRORS.NO_BRISTLES);
    }

    delete copy.pigpen.animals[action.id];

    copy.inventory["Pig Bristles"] = (
      copy.inventory["Pig Bristles"] ?? new Decimal(0)
    ).add(amount);

    copy.farmActivity = trackFarmActivity(
      "Pig Bristles Collected",
      copy.farmActivity,
    );

    copy.boostsUsedAt = updateBoostUsed({
      game: copy,
      boostNames: boostsUsed,
      createdAt,
    });

    return copy;
  });
}
