import Decimal from "decimal.js-light";
import { getFactionRankBoostAmount } from "features/game/lib/factionRanks";
import {
  START_DATE,
  calculatePoints,
  getFactionWearableBoostAmount,
  getFactionWeek,
  getFactionWeekday,
} from "features/game/lib/factions";
import { BoostType, BoostValue } from "features/game/types/boosts";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export enum DELIVER_FACTION_KITCHEN_ERRORS {
  NO_FACTION = "Player has not joined a faction",
  FACTION_KITCHEN_NOT_STARTED = "Faction kitchen has not started yet",
  NO_KITCHEN_DATA = "No kitchen data available",
  NO_RESOURCE_FOUND = "No requested resource found at index",
  INSUFFICIENT_RESOURCES = "Insufficient resources",
}

export const BASE_POINTS = 20;

export const getKingdomKitchenBoost = (
  game: GameState,
  marks: number,
): [number, Partial<Record<BoostType, BoostValue>>] => {
  const [wearablesBoost, wearablesLabels] = getFactionWearableBoostAmount(
    game,
    marks,
  );
  const [rankBoost, rankLabels] = getFactionRankBoostAmount(game, marks);

  return [wearablesBoost + rankBoost, { ...wearablesLabels, ...rankLabels }];
};

export type DeliverFactionKitchenAction = {
  type: "factionKitchen.delivered";
  resourceIndex: number;
};

type Options = {
  state: Readonly<GameState>;
  action: DeliverFactionKitchenAction;
  createdAt?: number;
};

export function deliverFactionKitchen({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);
  const { faction, inventory } = stateCopy;

  if (!faction) {
    throw new Error(DELIVER_FACTION_KITCHEN_ERRORS.NO_FACTION);
  }

  if (createdAt < START_DATE.getTime()) {
    throw new Error(DELIVER_FACTION_KITCHEN_ERRORS.FACTION_KITCHEN_NOT_STARTED);
  }

  const { kitchen } = faction;

  if (!kitchen) {
    throw new Error(DELIVER_FACTION_KITCHEN_ERRORS.NO_KITCHEN_DATA);
  }

  const { requests: resources } = kitchen;

  if (!resources[action.resourceIndex]) {
    throw new Error(DELIVER_FACTION_KITCHEN_ERRORS.NO_RESOURCE_FOUND);
  }

  const request = resources[action.resourceIndex];
  const resourceBalance = inventory[request.item] ?? new Decimal(0);

  if (resourceBalance.lt(request.amount)) {
    throw new Error(DELIVER_FACTION_KITCHEN_ERRORS.INSUFFICIENT_RESOURCES);
  }

  inventory[request.item] = resourceBalance.minus(request.amount);

  const week = getFactionWeek({ date: new Date(createdAt) });
  const day = getFactionWeekday(createdAt);
  const marksBalance = inventory["Mark"] ?? new Decimal(0);
  const fulfilledToday = request.dailyFulfilled[day] ?? 0;

  const points = calculatePoints(fulfilledToday, BASE_POINTS);
  const boostPoints = getKingdomKitchenBoost(stateCopy, points)[0];
  const totalPoints = points + boostPoints;

  const leaderboard = faction.history[week] ?? {
    score: 0,
    petXP: 0,
  };

  faction.history[week] = {
    ...leaderboard,
    score: leaderboard.score + totalPoints,
  };
  inventory["Mark"] = marksBalance.plus(totalPoints);

  request.dailyFulfilled[day] = fulfilledToday + 1;

  return stateCopy;
}
