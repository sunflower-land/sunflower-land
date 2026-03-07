import Decimal from "decimal.js-light";
import {
  isTemporaryCollectibleActive,
  isCollectibleBuilt,
} from "features/game/lib/collectibleBuilt";
import { isWearableActive } from "features/game/lib/wearables";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { BoostName, GameState, OilReserve } from "features/game/types/game";
import { produce } from "immer";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";

export type DrillOilReserveAction = {
  type: "oilReserve.drilled";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: DrillOilReserveAction;
  createdAt?: number;
};

export const BASE_OIL_DROP_AMOUNT = 10;
export const OIL_BONUS_DROP_AMOUNT = 20;
export const OIL_RESERVE_RECOVERY_TIME = 20 * 60 * 60;

export function getOilDropAmount(game: GameState, reserve: OilReserve) {
  let amount = new Decimal(BASE_OIL_DROP_AMOUNT);
  const boostsUsed: { name: BoostName; value: string }[] = [];

  if ((reserve.drilled + 1) % 3 === 0) {
    amount = amount.add(OIL_BONUS_DROP_AMOUNT);

    if (isTemporaryCollectibleActive({ name: "Stag Shrine", game })) {
      amount = amount.add(15);
      boostsUsed.push({ name: "Stag Shrine", value: "+15" });
    }
  }

  if (isCollectibleBuilt({ name: "Battle Fish", game })) {
    amount = amount.add(0.05);
    boostsUsed.push({ name: "Battle Fish", value: "+0.05" });
  }

  if (isCollectibleBuilt({ name: "Knight Chicken", game })) {
    amount = amount.add(0.1);
    boostsUsed.push({ name: "Knight Chicken", value: "+0.1" });
  }

  if (isWearableActive({ name: "Oil Can", game })) {
    amount = amount.add(2);
    boostsUsed.push({ name: "Oil Can", value: "+2" });
  }

  if (isWearableActive({ game, name: "Oil Overalls" })) {
    amount = amount.add(10);
    boostsUsed.push({ name: "Oil Overalls", value: "+10" });
  }

  if (game.bumpkin.skills["Oil Extraction"]) {
    amount = amount.add(1);
    boostsUsed.push({ name: "Oil Extraction", value: "+1" });
  }

  if (isWearableActive({ game, name: "Oil Gallon" })) {
    amount = amount.add(5);
    boostsUsed.push({ name: "Oil Gallon", value: "+5" });
  }

  return { amount: amount.toDecimalPlaces(4).toNumber(), boostsUsed };
}

export function canDrillOilReserve(
  reserve: OilReserve,
  now: number = Date.now(),
) {
  return now - reserve.oil.drilledAt > OIL_RESERVE_RECOVERY_TIME * 1000;
}

export function getRequiredOilDrillAmount(gameState: GameState): {
  amount: Decimal;
  boostsUsed: { name: BoostName; value: string }[];
} {
  let amount = new Decimal(1);
  const boostsUsed: { name: BoostName; value: string }[] = [];
  if (isWearableActive({ name: "Infernal Drill", game: gameState })) {
    amount = new Decimal(0);
    boostsUsed.push({ name: "Infernal Drill", value: "Free" });

    // Early return
    return { amount, boostsUsed };
  }
  return { amount, boostsUsed };
}

type getDrilledAtArgs = {
  createdAt: number;
  game: GameState;
};

/**
 * Single source of truth for oil recovery boosts. Used by both getDrilledAt (game) and UI.
 */
export function getOilRecoveryTimeForDisplay({ game }: { game: GameState }): {
  baseTimeMs: number;
  recoveryTimeMs: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  const baseTimeMs = OIL_RESERVE_RECOVERY_TIME * 1000;
  let totalSeconds = OIL_RESERVE_RECOVERY_TIME;
  const boostsUsed: { name: BoostName; value: string }[] = [];

  if (isWearableActive({ game, name: "Dev Wrench" })) {
    totalSeconds = totalSeconds * 0.5;
    boostsUsed.push({ name: "Dev Wrench", value: "x0.5" });
  }
  if (game.bumpkin.skills["Oil Be Back"]) {
    totalSeconds = totalSeconds * 0.8;
    boostsUsed.push({ name: "Oil Be Back", value: "x0.8" });
  }

  if (isTemporaryCollectibleActive({ name: "Stag Shrine", game })) {
    totalSeconds = totalSeconds * 0.75;
    boostsUsed.push({ name: "Stag Shrine", value: "x0.75" });
  }

  return {
    baseTimeMs,
    recoveryTimeMs: totalSeconds * 1000,
    boostsUsed,
  };
}

/**
 * Set a drilled in the past to make it replenish faster. Uses getOilRecoveryTimeForDisplay for boost logic.
 */
export function getDrilledAt({ createdAt, game }: getDrilledAtArgs): {
  time: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  const { baseTimeMs, recoveryTimeMs, boostsUsed } =
    getOilRecoveryTimeForDisplay({ game });
  const buffMs = baseTimeMs - recoveryTimeMs;
  return { time: createdAt - buffMs, boostsUsed };
}

export function drillOilReserve({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const oilReserve = game.oilReserves[action.id];
    const { amount: requiredDrills, boostsUsed: requiredDrillsBoostsUsed } =
      getRequiredOilDrillAmount(state);
    const drillAmount = game.inventory["Oil Drill"] || new Decimal(0);

    if (!oilReserve) {
      throw new Error(`Oil reserve #${action.id} not found`);
    }

    if (oilReserve.x === undefined && oilReserve.y === undefined) {
      throw new Error("Oil reserve is not placed");
    }

    if (drillAmount.lessThan(requiredDrills)) {
      throw new Error("No oil drills available");
    }

    if (!canDrillOilReserve(oilReserve, createdAt)) {
      throw new Error("Oil reserve is still recovering");
    }

    const { amount: oilDropAmount, boostsUsed } = getOilDropAmount(
      game,
      oilReserve,
    );

    game.inventory.Oil = (game.inventory.Oil ?? new Decimal(0)).add(
      oilDropAmount,
    );
    // Take away one drill
    game.inventory["Oil Drill"] = drillAmount.sub(requiredDrills);
    // Update drilled at time
    const { time, boostsUsed: drilledAtBoostsUsed } = getDrilledAt({
      createdAt,
      game: game,
    });
    oilReserve.oil.drilledAt = time;
    // Increment drilled count
    oilReserve.drilled += 1;

    game.farmActivity = trackFarmActivity("Oil Drilled", game.farmActivity);

    game.boostsUsedAt = updateBoostUsed({
      game,
      boostNames: [
        ...requiredDrillsBoostsUsed,
        ...drilledAtBoostsUsed,
        ...boostsUsed,
      ],
      createdAt,
    });

    return game;
  });
}
