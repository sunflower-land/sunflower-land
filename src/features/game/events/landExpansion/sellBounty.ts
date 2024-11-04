import Decimal from "decimal.js-light";
import { isWearableActive } from "features/game/lib/wearables";
import { getKeys } from "features/game/types/decorations";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { BountyRequest, GameState } from "features/game/types/game";
import {
  getCurrentSeason,
  getSeasonalTicket,
} from "features/game/types/seasons";
import { produce } from "immer";
import { getSeasonChangeover } from "lib/utils/getSeasonWeek";

export type SellBountyAction = {
  type: "bounty.sold";
  requestId: string;
};

type Options = {
  state: GameState;
  action: SellBountyAction;
  createdAt?: number;
  farmId?: number;
};

export function generateBountyTicket({
  game,
  bounty,
}: {
  game: GameState;
  bounty: BountyRequest;
}) {
  let amount = bounty.items?.[getSeasonalTicket()] ?? 0;

  if (!amount) {
    return 0;
  }

  if (
    getCurrentSeason() === "Bull Run" &&
    isWearableActive({ game, name: "Cowboy Hat" })
  ) {
    amount += 1;
  }

  if (
    getCurrentSeason() === "Bull Run" &&
    isWearableActive({ game, name: "Cowboy Shirt" })
  ) {
    amount += 1;
  }

  if (
    getCurrentSeason() === "Bull Run" &&
    isWearableActive({ game, name: "Cowboy Trouser" })
  ) {
    amount += 1;
  }

  return amount;
}

export function sellBounty({
  state,
  action,
  createdAt = Date.now(),
  farmId = 0,
}: Options): GameState {
  return produce(state, (draft) => {
    const request = draft.bounties.requests.find(
      (deal) => deal.id === action.requestId,
    );

    if (!request) {
      throw new Error("Bounty does not exist");
    }

    const completed = draft.bounties.completed.find(
      (c) => c.id === action.requestId,
    );
    if (completed) {
      throw new Error("Bounty already completed");
    }

    const { ticketTasksAreFrozen } = getSeasonChangeover({
      now: createdAt,
      id: farmId as number,
    });

    const tickets = generateBountyTicket({
      game: draft,
      bounty: request,
    });

    const isTicketOrder = tickets > 0;

    if (isTicketOrder && ticketTasksAreFrozen) {
      throw new Error("Ticket tasks are frozen");
    }

    // Remove the item from the inventory
    const item = draft.inventory[request.name];
    if (!item || item.lte(0)) {
      throw new Error("Item does not exist in inventory");
    }
    draft.inventory[request.name] = item.minus(1);

    // Add rewards
    if (request.coins) {
      draft.coins += request.coins;
    }

    getKeys(request.items ?? {}).forEach((name) => {
      const previous = draft.inventory[name] ?? new Decimal(0);
      const seasonalTicket = getSeasonalTicket();
      if (tickets > 0 && seasonalTicket === name) {
        draft.inventory[name] = previous.add(tickets ?? 0);
      } else draft.inventory[name] = previous.add(request.items?.[name] ?? 0);
    });

    // Mark bounty as completed
    draft.bounties.completed.push({
      id: request.id,
      soldAt: createdAt,
    });

    // Track farm activity
    draft.farmActivity = trackFarmActivity(
      `${request.name} Bountied`,
      draft.farmActivity,
    );

    return draft;
  });
}
