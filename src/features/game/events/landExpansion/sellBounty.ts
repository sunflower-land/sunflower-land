import Decimal from "decimal.js-light";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { isWearableActive } from "features/game/lib/wearables";
import { ANIMALS } from "features/game/types/animals";
import { getKeys } from "features/game/types/decorations";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { BountyRequest, GameState, SFLBounty } from "features/game/types/game";
import {
  getCurrentChapter,
  getChapterTicket,
} from "features/game/types/chapters";
import { produce } from "immer";
import { getChapterChangeover } from "lib/utils/getSeasonWeek";

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
  now = Date.now(),
}: {
  game: GameState;
  bounty: BountyRequest;
  now?: number;
}) {
  let amount = bounty.items?.[getChapterTicket(new Date(now))] ?? 0;

  if (!amount) {
    return 0;
  }

  if (
    getCurrentChapter() === "Bull Run" &&
    isWearableActive({ game, name: "Cowboy Hat" })
  ) {
    amount += 1;
  }

  if (
    getCurrentChapter() === "Bull Run" &&
    isWearableActive({ game, name: "Cowboy Shirt" })
  ) {
    amount += 1;
  }

  if (
    getCurrentChapter() === "Bull Run" &&
    isWearableActive({ game, name: "Cowboy Trouser" })
  ) {
    amount += 1;
  }

  if (
    getCurrentChapter() === "Winds of Change" &&
    isWearableActive({ game, name: "Acorn Hat" })
  ) {
    amount += 1;
  }

  if (
    getCurrentChapter() === "Winds of Change" &&
    isCollectibleBuilt({ game, name: "Igloo" })
  ) {
    amount += 1;
  }

  if (
    getCurrentChapter() === "Winds of Change" &&
    isCollectibleBuilt({ game, name: "Hammock" })
  ) {
    amount += 1;
  }

  return amount;
}

export function generateBountyCoins({
  game,
  bounty,
}: {
  game: GameState;
  bounty: BountyRequest;
}) {
  let { coins = 0 } = bounty;
  let multiplier = 1;

  const isAnimalBounty = bounty.name in ANIMALS;

  if (game.bumpkin.skills["Bountiful Bounties"] && isAnimalBounty) {
    multiplier += 0.5;
  }

  coins *= multiplier;
  return { coins };
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

    const { ticketTasksAreFrozen } = getChapterChangeover({
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

    const { coins } = generateBountyCoins({
      game: draft,
      bounty: request,
    });

    // Add rewards
    if (request.coins) {
      draft.coins += coins;
    }

    getKeys(request.items ?? {}).forEach((name) => {
      const previous = draft.inventory[name] ?? new Decimal(0);
      const chapterTicket = getChapterTicket();
      if (tickets > 0 && chapterTicket === name) {
        draft.inventory[name] = previous.add(tickets ?? 0);
      } else draft.inventory[name] = previous.add(request.items?.[name] ?? 0);
    });

    if ((request as SFLBounty).sfl) {
      draft.balance = draft.balance.add((request as SFLBounty).sfl);
    }

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
