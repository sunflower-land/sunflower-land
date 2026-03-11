import Decimal from "decimal.js-light";
import { getFactionRankBoostAmount } from "features/game/lib/factionRanks";
import {
  START_DATE,
  calculatePoints,
  getFactionWearableBoostAmount,
  getWeekKey,
  getFactionWeekday,
} from "features/game/lib/factions";
import { BoostType, BoostValue } from "features/game/types/boosts";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

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

  return [
    new Decimal(wearablesBoost).add(rankBoost).toNumber(),
    { ...wearablesLabels, ...rankLabels },
  ];
};

export type DeliverFactionKitchenAction = {
  type: "factionKitchen.delivered";
  resourceIndex: number;
  amount?: number;
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
  return produce(state, (stateCopy) => {
    const { faction, inventory } = stateCopy;

    if (!faction) {
      throw new Error(DELIVER_FACTION_KITCHEN_ERRORS.NO_FACTION);
    }

    if (createdAt < START_DATE.getTime()) {
      throw new Error(
        DELIVER_FACTION_KITCHEN_ERRORS.FACTION_KITCHEN_NOT_STARTED,
      );
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
    const { amount = 1 } = action;
    const resourceBalance = inventory[request.item] ?? new Decimal(0);
    const requestAmount = new Decimal(request.amount).mul(amount).toNumber();

    if (resourceBalance.lt(requestAmount)) {
      throw new Error(DELIVER_FACTION_KITCHEN_ERRORS.INSUFFICIENT_RESOURCES);
    }

    inventory[request.item] = resourceBalance.minus(requestAmount);

    const week = getWeekKey({ date: new Date(createdAt) });
    const day = getFactionWeekday(createdAt);
    const marksBalance = inventory["Mark"] ?? new Decimal(0);
    const fulfilledToday = request.dailyFulfilled[day] ?? 0;

    const points = calculatePoints(fulfilledToday, BASE_POINTS, amount);
    const [boostPoints] = getKingdomKitchenBoost(stateCopy, points);
    const totalPoints = new Decimal(points).add(boostPoints).toNumber();

    const leaderboard = faction.history[week] ?? {
      score: 0,
      petXP: 0,
    };

    faction.history[week] = {
      ...leaderboard,
      score: new Decimal(leaderboard.score).add(totalPoints).toNumber(),
    };
    inventory["Mark"] = marksBalance.plus(totalPoints);

    request.dailyFulfilled[day] = fulfilledToday + amount;

    return stateCopy;
  });
}
