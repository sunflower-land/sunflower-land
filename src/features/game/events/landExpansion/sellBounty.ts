import Decimal from "decimal.js-light";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { RECIPE_CRAFTABLES } from "features/game/lib/crafting";
import { isWearableActive } from "features/game/lib/wearables";
import { ANIMALS } from "features/game/types/animals";
import { EXOTIC_CROPS, ExoticCropName } from "features/game/types/beans";
import { getKeys } from "features/game/types/decorations";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { FISH, FishName } from "features/game/types/fishing";
import { FLOWERS, FlowerName } from "features/game/types/flowers";
import { FULL_MOON_FRUITS, FullMoonFruit } from "features/game/types/fruits";
import {
  BountyRequest,
  ExoticBounty,
  FishBounty,
  FlowerBounty,
  GameState,
  MarkBounty,
  ObsidianBounty,
} from "features/game/types/game";
import {
  getCurrentSeason,
  getSeasonalTicket,
} from "features/game/types/seasons";
import {
  SELLABLE_TREASURE,
  BeachBountyTreasure,
} from "features/game/types/treasure";
import { produce } from "immer";
import { getSeasonChangeover } from "lib/utils/getSeasonWeek";

export const BOUNTY_CATEGORIES = {
  "Flower Bounties": (bounty: BountyRequest): bounty is FlowerBounty =>
    getKeys(FLOWERS).includes(bounty.name as FlowerName),
  "Fish Bounties": (bounty: BountyRequest): bounty is FishBounty =>
    getKeys(FISH).includes(bounty.name as FishName),
  "Exotic Bounties": (bounty: BountyRequest): bounty is ExoticBounty =>
    getKeys(EXOTIC_CROPS).includes(bounty.name as ExoticCropName) ||
    getKeys(SELLABLE_TREASURE).includes(bounty.name as BeachBountyTreasure) ||
    FULL_MOON_FRUITS.includes(bounty.name as FullMoonFruit) ||
    bounty.name in RECIPE_CRAFTABLES,
  "Mark Bounties": (bounty: BountyRequest): bounty is MarkBounty =>
    bounty.name === "Mark",
  "Obsidian Bounties": (bounty: BountyRequest): bounty is ObsidianBounty =>
    bounty.name === "Obsidian",
};

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
  let amount = bounty.items?.[getSeasonalTicket(new Date(now))] ?? 0;

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

  if (
    getCurrentSeason() === "Winds of Change" &&
    isWearableActive({ game, name: "Acorn Hat" })
  ) {
    amount += 1;
  }

  if (
    getCurrentSeason() === "Winds of Change" &&
    isCollectibleBuilt({ game, name: "Igloo" })
  ) {
    amount += 1;
  }

  if (
    getCurrentSeason() === "Winds of Change" &&
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
    if (BOUNTY_CATEGORIES["Mark Bounties"](request)) {
      draft.inventory[request.name] = item.minus(request.quantity);
    } else {
      draft.inventory[request.name] = item.minus(1);
    }

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
      const seasonalTicket = getSeasonalTicket();
      if (tickets > 0 && seasonalTicket === name) {
        draft.inventory[name] = previous.add(tickets ?? 0);
      } else draft.inventory[name] = previous.add(request.items?.[name] ?? 0);
    });

    if ((request as ObsidianBounty).sfl) {
      draft.balance = draft.balance.add((request as ObsidianBounty).sfl ?? 0);
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
