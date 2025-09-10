import Decimal from "decimal.js-light";
import { getFactionRankBoostAmount } from "features/game/lib/factionRanks";
import {
  START_DATE,
  calculatePoints,
  getFactionWearableBoostAmount,
  getWeekKey,
  getFactionWeekday,
} from "features/game/lib/factions";
import { isWearableActive } from "features/game/lib/wearables";
import { BoostType, BoostValue } from "features/game/types/boosts";
import { ConsumableName, CONSUMABLES } from "features/game/types/consumables";
import {
  BoostName,
  FactionPetRequest,
  GameState,
  InventoryItemName,
} from "features/game/types/game";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { produce } from "immer";

const isPawShieldActive = (game: GameState) =>
  isWearableActive({ game, name: "Paw Shield" });

export const getKingdomPetBoost = (
  game: GameState,
  marks: number,
): [number, Partial<Record<BoostType, BoostValue>>, BoostName[]] => {
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
  const boostUsed: BoostName[] = [];
  if (isPawShieldActive(game)) {
    pawShieldBoost = marks * 0.25;
    boosts["Paw Shield"] = `+${0.25 * 100}%`;
    boostUsed.push("Paw Shield");
  }

  return [wearablesBoost + rankBoost + pawShieldBoost, boosts, boostUsed];
};

export enum DifficultyIndex {
  EASY = 0,
  MEDIUM = 1,
  HARD = 2,
  DOLL = 3,
}

export const PET_FED_REWARDS_KEY: Record<DifficultyIndex, number> = {
  [DifficultyIndex.EASY]: 4,
  [DifficultyIndex.MEDIUM]: 8,
  [DifficultyIndex.HARD]: 12,
  [DifficultyIndex.DOLL]: 20,
};

const DOLL_XP = 5000;

export const getTotalXPForRequest = (
  game: GameState,
  request: FactionPetRequest,
  amount = 1,
) => {
  const { food, quantity } = request;

  const isEdible = (food: InventoryItemName): food is ConsumableName =>
    food in CONSUMABLES;

  let foodXP = 0;

  if (isEdible(food)) {
    foodXP = CONSUMABLES[food].experience;
  } else {
    foodXP = DOLL_XP;
  }

  if (isPawShieldActive(game)) {
    foodXP *= 1.25;
  }

  return foodXP * quantity * amount;
};

export type FeedFactionPetAction = {
  type: "factionPet.fed";
  requestIndex: DifficultyIndex;
  amount?: number;
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
  return produce(state, (stateCopy) => {
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
    const { amount = 1 } = action;
    const requestAmount = request.quantity * amount;
    const week = getWeekKey({ date: new Date(createdAt) });
    const day = getFactionWeekday(createdAt);

    if (foodBalance.lt(requestAmount)) {
      throw new Error("Insufficient food to fulfill the request");
    }

    stateCopy.inventory[request.food] = foodBalance.minus(requestAmount);

    const totalXP = getTotalXPForRequest(stateCopy, request, amount);
    const leaderboard = stateCopy.faction.history[week] ?? {
      score: 0,
      petXP: 0,
    };

    const marksBalance = stateCopy.inventory.Mark ?? new Decimal(0);
    const fulfilled = request.dailyFulfilled?.[day] ?? 0;

    const baseReward = calculatePoints(
      fulfilled,
      PET_FED_REWARDS_KEY[action.requestIndex],
      amount,
    );
    const [boostAmount, _, boostUsed] = getKingdomPetBoost(
      stateCopy,
      baseReward,
    );
    const totalAmount = baseReward + boostAmount;

    stateCopy.inventory.Mark = marksBalance.add(totalAmount);
    request.dailyFulfilled[day] = fulfilled + amount;

    stateCopy.faction.history[week] = {
      ...leaderboard,
      score: leaderboard.score + totalAmount,
      petXP: leaderboard.petXP + totalXP,
    };

    stateCopy.boostsUsedAt = updateBoostUsed({
      game: stateCopy,
      boostNames: boostUsed,
      createdAt,
    });

    return stateCopy;
  });
}
