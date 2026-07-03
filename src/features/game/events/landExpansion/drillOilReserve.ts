import Decimal from "decimal.js-light";
import {
  isTemporaryCollectibleActive,
  isCollectibleBuilt,
} from "features/game/lib/collectibleBuilt";
import { isWearableActive } from "features/game/lib/wearables";
import { trackFarmActivity } from "features/game/types/farmActivity";
import type {
  BoostName,
  GameState,
  OilReserve,
} from "features/game/types/game";
import { produce } from "immer";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { hasFeatureAccess } from "lib/flags";
import {
  computeReadyAt,
  getOilBoostWindows,
} from "features/game/lib/boostWindows";

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

  if (isNextDrillHasBonus(reserve)) {
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

export function isNextDrillHasBonus(reserve: OilReserve): boolean {
  return (reserve.drilled + 1) % 3 === 0;
}

/**
 * When a drilled reserve is ready to drill again, across both boost models.
 * Reserves drilled under the speed-rate model (with `oil.baseDurationMs`) derive
 * their ready time live from the oil boost windows; legacy reserves use their
 * back-dated `drilledAt` + base recovery time.
 *
 * `baseDurationMs` is a PERMANENT per-reserve migration marker: the read path keys
 * off its presence, NOT the `SPEED_BOOSTS` flag (matching `getTreeReadyAt`). A
 * reserve drilled while the flag was on therefore keeps windowed timing even if the
 * flag is later disabled — windowed reserves store the real `drilledAt` + a
 * permanent-boost-only `baseDurationMs`, so falling back to `drilledAt + base
 * recovery` would drop their baked permanent-boost credit and wrongly lengthen
 * recovery on rollback.
 */
export function getOilReserveReadyAt(
  reserve: OilReserve,
  game: GameState,
): number {
  const { baseDurationMs, drilledAt } = reserve.oil;

  if (baseDurationMs !== undefined) {
    return computeReadyAt({
      startedAt: drilledAt,
      baseDurationMs,
      windows: getOilBoostWindows(game),
    });
  }

  return drilledAt + OIL_RESERVE_RECOVERY_TIME * 1000;
}

export function canDrillOilReserve(
  reserve: OilReserve,
  game: GameState,
  now: number = Date.now(),
) {
  // Strict `>` preserves the legacy `now - drilledAt > RECOVERY * 1000` boundary.
  return now > getOilReserveReadyAt(reserve, game);
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

  // Under SPEED_BOOSTS the temporary Stag Shrine recovery boost is a retroactive
  // speed-rate window (see boostWindows), so it's excluded from the baked recovery
  // here — what remains is the permanent-boost-only base duration. Flag-off keeps
  // the legacy discount-at-start.
  const boostsWindowed = hasFeatureAccess(game, "SPEED_BOOSTS");

  if (isWearableActive({ game, name: "Dev Wrench" })) {
    totalSeconds = totalSeconds * 0.5;
    boostsUsed.push({ name: "Dev Wrench", value: "x0.5" });
  }
  if (game.bumpkin.skills["Oil Be Back"]) {
    totalSeconds = totalSeconds * 0.8;
    boostsUsed.push({ name: "Oil Be Back", value: "x0.8" });
  }

  if (
    !boostsWindowed &&
    isTemporaryCollectibleActive({ name: "Stag Shrine", game })
  ) {
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
 * The drilled-at time to persist, plus (under SPEED_BOOSTS) the base recovery
 * duration.
 *
 * Legacy model: back-date `drilledAt` into the past so the reserve replenishes
 * faster. Speed-rate model (SPEED_BOOSTS): store the REAL drill time and a
 * `baseDurationMs` carrying only the permanent boosts; the temporary Stag Shrine
 * boost is derived live from windows. Uses getOilRecoveryTimeForDisplay for boost
 * logic. Mirrors `getMinedAt`. Returns no `baseDurationMs` flag-off, so a
 * flag-off re-drill reverts the reserve to legacy (see the reducer).
 */
export function getDrilledAt({ createdAt, game }: getDrilledAtArgs): {
  time: number;
  baseDurationMs?: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  const { baseTimeMs, recoveryTimeMs, boostsUsed } =
    getOilRecoveryTimeForDisplay({ game });

  if (hasFeatureAccess(game, "SPEED_BOOSTS")) {
    return { time: createdAt, baseDurationMs: recoveryTimeMs, boostsUsed };
  }

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

    if (!canDrillOilReserve(oilReserve, game, createdAt)) {
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
    // Update drilled at time. A fresh drill rebuilds the timer from scratch, so a
    // flag-off re-drill clears any prior windowed marker and reverts to legacy —
    // mirrors stoneMine (`rock.stone = { minedAt }`) / chop (`delete baseDurationMs`),
    // the resource-node family oil belongs to. (Without the clear, a stale marker —
    // e.g. Grease Lightning's 0 — would mis-time the next recovery.)
    const {
      time,
      baseDurationMs,
      boostsUsed: drilledAtBoostsUsed,
    } = getDrilledAt({
      createdAt,
      game,
    });
    oilReserve.oil.drilledAt = time;
    if (baseDurationMs !== undefined) {
      oilReserve.oil.baseDurationMs = baseDurationMs;
    } else {
      delete oilReserve.oil.baseDurationMs;
    }
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
