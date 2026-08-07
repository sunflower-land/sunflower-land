import type { GameState, InventoryItemName } from "features/game/types/game";
import { produce } from "immer";
import { hasVipAccess } from "features/game/lib/vipAccess";
import {
  getSickAnimalRewardAmount,
  isValidDeal,
  sellAnimal,
} from "./sellAnimal";
import { generateBountyCoins, generateBountyTicket } from "./sellBounty";
import { getKeys } from "lib/object";
import { getChapterTicket } from "features/game/types/chapters";

export type BulkSellAnimalAction = {
  type: "animals.bulkSold";
  sales: { requestId: string; animalId: string }[];
};

type Options = {
  state: GameState;
  action: BulkSellAnimalAction;
  createdAt?: number;
};

export function bulkSellAnimal({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  // These checks mirror the autosave validation schema (min(1), unique ids):
  // the UI never produces these shapes, so seeing one means a bug or a
  // hostile client and we want it to throw locally rather than be quietly
  // accepted by the optimistic update.
  if (!hasVipAccess({ game: state, now: createdAt })) {
    throw new Error("VIP required");
  }

  if (action.sales.length === 0) {
    throw new Error("No animals selected");
  }

  const requestIds = action.sales.map((sale) => sale.requestId);
  if (new Set(requestIds).size !== requestIds.length) {
    throw new Error("Duplicate bounty IDs");
  }

  const requestsById = new Map(
    state.bounties.requests.map((request) => [request.id, request]),
  );
  action.sales.forEach(({ requestId }) => {
    if (!requestsById.has(requestId)) {
      throw new Error("Bounty does not exist");
    }
  });

  // Animal ids are only unique per-building (henHouse and barn both start
  // fresh animals at "0", "1", "2", ...), so the duplicate check must be
  // keyed on (building, animalId), not animalId alone — otherwise selling a
  // Chicken "0" and a Cow "0" in the same batch would be wrongly rejected.
  const animalKeys = action.sales.map(({ requestId, animalId }) => {
    const request = requestsById.get(requestId)!;
    const building = request.name === "Chicken" ? "henHouse" : "barn";
    return `${building}:${animalId}`;
  });
  if (new Set(animalKeys).size !== animalKeys.length) {
    throw new Error("Duplicate animal IDs");
  }

  let soldCount = 0;

  const nextState = produce(state, (draft) => {
    let working: GameState = draft;

    action.sales.forEach(({ requestId, animalId }) => {
      try {
        working = sellAnimal({
          state: working,
          action: { type: "animal.sold", requestId, animalId },
          createdAt,
        });
        soldCount += 1;
      } catch {
        // Skip: bounty already completed, animal no longer eligible, or
        // animal already sold earlier in this same batch — legitimate
        // races (e.g. weekly bounty reset firing mid-session), not bugs.
      }
    });

    return working;
  });

  if (soldCount === 0) {
    throw new Error("No animals could be sold");
  }

  return nextState;
}

export type BulkAnimalSaleSummary = {
  totalAnimals: number;
  coins: number;
  items: Partial<Record<InventoryItemName, number>>;
  sickAnimalCount: number;
  skipped: { requestId: string; animalId: string; reason: string }[];
};

export function getBulkAnimalSaleSummary({
  state,
  sales,
  now = Date.now(),
}: {
  state: GameState;
  sales: { requestId: string; animalId: string }[];
  now?: number;
}): BulkAnimalSaleSummary {
  const summary: BulkAnimalSaleSummary = {
    totalAnimals: 0,
    coins: 0,
    items: {},
    sickAnimalCount: 0,
    skipped: [],
  };

  sales.forEach(({ requestId, animalId }) => {
    const request = state.bounties.requests.find(
      (deal) => deal.id === requestId,
    );

    if (!request) {
      summary.skipped.push({
        requestId,
        animalId,
        reason: "Bounty does not exist",
      });
      return;
    }

    const isCompleted = state.bounties.completed.some(
      (c) => c.id === requestId,
    );
    if (isCompleted) {
      summary.skipped.push({
        requestId,
        animalId,
        reason: "Bounty already completed",
      });
      return;
    }

    const { animals } =
      request.name === "Chicken" ? state.henHouse : state.barn;
    const animal = animals[animalId];

    if (!animal) {
      summary.skipped.push({
        requestId,
        animalId,
        reason: "Animal does not exist",
      });
      return;
    }

    if (!isValidDeal({ animal, deal: request })) {
      summary.skipped.push({
        requestId,
        animalId,
        reason: "Animal no longer eligible",
      });
      return;
    }

    const isSick = animal.state === "sick";

    if (request.coins) {
      const { coins } = generateBountyCoins({ game: state, bounty: request });
      summary.coins += isSick ? getSickAnimalRewardAmount(coins) : coins;
    }

    getKeys(request.items ?? {}).forEach((name) => {
      let amount = request.items?.[name] ?? 0;

      if (name === getChapterTicket(now)) {
        amount = generateBountyTicket({ game: state, bounty: request, now });
      }

      const rewardAmount = isSick ? getSickAnimalRewardAmount(amount) : amount;
      summary.items[name] = (summary.items[name] ?? 0) + rewardAmount;
    });

    summary.totalAnimals += 1;
    if (isSick) {
      summary.sickAnimalCount += 1;
    }
  });

  return summary;
}
