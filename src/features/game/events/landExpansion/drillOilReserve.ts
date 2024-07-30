import Decimal from "decimal.js-light";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { isWearableActive } from "features/game/lib/wearables";
import { GameState, OilReserve } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

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

function getNextOilDropAmount(game: GameState, reserve: OilReserve) {
  let amount = new Decimal(BASE_OIL_DROP_AMOUNT);

  if ((reserve.drilled + 1) % 3 === 0) {
    amount = amount.add(OIL_BONUS_DROP_AMOUNT);
  }

  if (isCollectibleBuilt({ name: "Battle Fish", game })) {
    amount = amount.add(0.05);
  }

  if (isCollectibleBuilt({ name: "Knight Chicken", game })) {
    amount = amount.add(0.1);
  }

  if (isWearableActive({ name: "Oil Can", game })) {
    amount = amount.add(2);
  }

  if (isWearableActive({ game, name: "Oil Overalls" })) {
    amount = amount.add(10);
  }

  return amount.toDecimalPlaces(4).toNumber();
}

export function canDrillOilReserve(
  reserve: OilReserve,
  now: number = Date.now(),
) {
  return now - reserve.oil.drilledAt > OIL_RESERVE_RECOVERY_TIME * 1000;
}

export function getRequiredOilDrillAmount(gameState: GameState) {
  if (isWearableActive({ name: "Infernal Drill", game: gameState })) {
    return new Decimal(0);
  }
  return new Decimal(1);
}

type getDrilledAtArgs = {
  createdAt: number;
  game: GameState;
};

export function getDrilledAt({ createdAt, game }: getDrilledAtArgs): number {
  let time = createdAt;

  if (isWearableActive({ game, name: "Dev Wrench" })) {
    time -= OIL_RESERVE_RECOVERY_TIME * 0.5 * 1000;
  }
  return time;
}

export function drillOilReserve({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game: GameState = cloneDeep(state);

  const oilReserve = game.oilReserves[action.id];
  const requiredDrills = getRequiredOilDrillAmount(state);
  const drillAmount = game.inventory["Oil Drill"] || new Decimal(0);

  if (!oilReserve) {
    throw new Error(`Oil reserve #${action.id} not found`);
  }

  if (drillAmount.lessThan(requiredDrills)) {
    throw new Error("No oil drills available");
  }

  if (!canDrillOilReserve(oilReserve, createdAt)) {
    throw new Error("Oil reserve is still recovering");
  }

  // Add oil amount from last mine
  game.inventory.Oil = (game.inventory.Oil ?? new Decimal(0)).add(
    oilReserve.oil.amount,
  );
  // Take away one drill
  game.inventory["Oil Drill"] = drillAmount.sub(requiredDrills);
  // Update drilled at time
  oilReserve.oil.drilledAt = getDrilledAt({ createdAt, game: game });
  // Increment drilled count
  oilReserve.drilled += 1;
  // Set next drill drop amount
  oilReserve.oil.amount = getNextOilDropAmount(game, oilReserve);

  return game;
}
