import Decimal from "decimal.js-light";
import { getFactionRankBoostAmount } from "features/game/lib/factionRanks";
import {
  START_DATE,
  calculatePoints,
  getFactionWearableBoostAmount,
  getFactionWeek,
  getFactionWeekday,
} from "features/game/lib/factions";
import { isWearableActive } from "features/game/lib/wearables";
import { BoostType, BoostValue } from "features/game/types/boosts";
import { CONSUMABLES } from "features/game/types/consumables";
import { FactionPetRequest, GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

const isPawShieldActive = (game: GameState) =>
  isWearableActive({ game, name: "Paw Shield" });

export const getKingdomPetBoost = (
  game: GameState,
  marks: number,
): [number, Partial<Record<BoostType, BoostValue>>] => {
  const [wearablesBoost, wearablesLabels] = getFactionWearableBoostAmount(
    game,
    marks,
  );
  const [rankBoost, factionLabels] = getFactionRankBoostAmount(game, marks);

  const boosts: Partial<Record<BoostType, BoostValue>> = {
    ...wearablesLabels,
    ...factionLabels,
  };

  let pawShieldBoost = 0;
  if (isPawShieldActive(game)) {
    pawShieldBoost = marks * 0.25;
    boosts["Paw Shield"] = `+${0.25 * 100}%`;
  }

  return [wearablesBoost + rankBoost + pawShieldBoost, boosts];
};

export enum DifficultyIndex {
  EASY = 0,
  MEDIUM = 1,
  HARD = 2,
}

export const PET_FED_REWARDS_KEY: Record<DifficultyIndex, number> = {
  [DifficultyIndex.EASY]: 4,
  [DifficultyIndex.MEDIUM]: 8,
  [DifficultyIndex.HARD]: 12,
};

export const getTotalXPForRequest = (
  game: GameState,
  request: FactionPetRequest,
) => {
  const { food, quantity } = request;

  let foodXP = CONSUMABLES[food].experience;

  if (isPawShieldActive(game)) {
    foodXP += foodXP * 0.25;
  }

  return foodXP * quantity;
};

export type FeedFactionPetAction = {
  type: "factionPet.fed";
  requestIndex: DifficultyIndex;
};

type Options = {
  state: Readonly<GameState>;
  action: FeedFactionPetAction;
  createdAt?: number;
};

export function feedFactionPet({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);

  if (createdAt < START_DATE.getTime()) {
    throw new Error("Faction pet feature is not active yet");
  }

  if (!stateCopy.faction) {
    throw new Error("Player has not joined a faction");
  }

  if (!stateCopy.faction.pet) {
    throw new Error("No pet data available");
  }

  const { requests } = stateCopy.faction.pet;

  if (!requests[action.requestIndex]) {
    throw new Error("No requested food found at index");
  }

  const request = requests[action.requestIndex];
  const foodBalance = stateCopy.inventory[request.food] ?? new Decimal(0);
  const week = getFactionWeek({ date: new Date(createdAt) });
  const day = getFactionWeekday(createdAt);

  if (foodBalance.lt(request.quantity)) {
    throw new Error("Insufficient food to fulfill the request");
  }

  stateCopy.inventory[request.food] = foodBalance.minus(request.quantity);

  const totalXP = getTotalXPForRequest(stateCopy, request);
  const leaderboard = stateCopy.faction.history[week] ?? {
    score: 0,
    petXP: 0,
  };

  const marksBalance = stateCopy.inventory.Mark ?? new Decimal(0);
  const fulfilled = request.dailyFulfilled?.[day] ?? 0;

  const baseReward = calculatePoints(
    fulfilled,
    PET_FED_REWARDS_KEY[action.requestIndex],
  );
  const boostAmount = getKingdomPetBoost(stateCopy, baseReward)[0];
  const totalAmount = baseReward + boostAmount;

  stateCopy.inventory.Mark = marksBalance.add(totalAmount);
  request.dailyFulfilled[day] = fulfilled + 1;

  stateCopy.faction.history[week] = {
    ...leaderboard,
    score: leaderboard.score + totalAmount,
    petXP: leaderboard.petXP + totalXP,
  };

  return stateCopy;
}
