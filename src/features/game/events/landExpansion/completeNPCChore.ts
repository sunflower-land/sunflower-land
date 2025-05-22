import Decimal from "decimal.js-light";
import { GameState, InventoryItemName } from "features/game/types/game";
import {
  getChoreProgress,
  NPC_CHORES,
  NpcChore,
} from "features/game/types/choreBoard";
import { produce } from "immer";
import { NPCName } from "lib/npcs";
import {
  getCurrentSeason,
  getSeasonalTicket,
  SeasonName,
} from "features/game/types/seasons";
import { isWearableActive } from "features/game/lib/wearables";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import {
  SeasonalTierItemName,
  MegastoreKeys,
} from "features/game/types/megastore";
import { isCollectible } from "./garbageSold";

export type CompleteNPCChoreAction = {
  type: "chore.fulfilled";
  npcName: NPCName;
};

type Options = {
  state: Readonly<GameState>;
  action: CompleteNPCChoreAction;
  createdAt?: number;
};

export const CHAPTER_TICKET_BOOST_ITEMS: Record<
  SeasonName,
  {
    basic: Exclude<SeasonalTierItemName, MegastoreKeys>;
    rare: Exclude<SeasonalTierItemName, MegastoreKeys>;
    epic: Exclude<SeasonalTierItemName, MegastoreKeys>;
  }
> = {
  "Solar Flare": {
    basic: "Cow Scratcher",
    rare: "Cow Scratcher",
    epic: "Cow Scratcher",
  },
  "Dawn Breaker": {
    basic: "Cow Scratcher",
    rare: "Cow Scratcher",
    epic: "Cow Scratcher",
  },
  "Witches' Eve": {
    basic: "Cow Scratcher",
    rare: "Cow Scratcher",
    epic: "Cow Scratcher",
  },
  "Catch the Kraken": {
    basic: "Cow Scratcher",
    rare: "Cow Scratcher",
    epic: "Cow Scratcher",
  },
  "Spring Blossom": {
    basic: "Cow Scratcher",
    rare: "Cow Scratcher",
    epic: "Cow Scratcher",
  },
  "Clash of Factions": {
    basic: "Cow Scratcher",
    rare: "Cow Scratcher",
    epic: "Cow Scratcher",
  },
  "Pharaoh's Treasure": {
    basic: "Cow Scratcher",
    rare: "Cow Scratcher",
    epic: "Cow Scratcher",
  },
  "Bull Run": {
    basic: "Cowboy Hat",
    rare: "Cowboy Shirt",
    epic: "Cowboy Trouser",
  },
  "Winds of Change": {
    basic: "Acorn Hat",
    rare: "Igloo",
    epic: "Hammock",
  },
  "Great Bloom": {
    basic: "Flower Mask",
    rare: "Love Charm Shirt",
    epic: "Heart Air Balloon",
  },
};

export function completeNPCChore({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (draft) => {
    const { npcName } = action;
    const { choreBoard } = draft;

    if (!choreBoard.chores[npcName]) {
      throw new Error("No chore exists for this NPC");
    }

    const chore = choreBoard.chores[npcName] as NpcChore;

    if (chore.completedAt) {
      throw new Error("Chore is already completed");
    }

    const progress = getChoreProgress({ chore, game: draft });

    if (progress < NPC_CHORES[chore.name].requirement) {
      throw new Error("Chore requirements not met");
    }

    // Mark chore as completed
    chore.completedAt = createdAt;

    const items = generateChoreRewards({
      game: draft,
      chore,
      now: new Date(createdAt),
    });

    // Add rewards to inventory
    Object.entries(items).forEach(([itemName, amount]) => {
      draft.inventory[itemName as InventoryItemName] = (
        draft.inventory[itemName as InventoryItemName] || new Decimal(0)
      ).add(amount);
    });

    if (chore.reward.coins) {
      draft.coins += chore.reward.coins;
    }

    // Increase NPC friendship points
    if (!draft.npcs) {
      draft.npcs = {};
    }
    if (!draft.npcs[npcName]) {
      draft.npcs[npcName] = { deliveryCount: 0 };
    }
    if (!draft.npcs[npcName].friendship) {
      draft.npcs[npcName].friendship = { points: 0, updatedAt: createdAt };
    }

    draft.npcs[npcName].friendship.points += 1;
    draft.npcs[npcName].friendship.updatedAt = createdAt;

    return draft;
  });
}

export function generateChoreRewards({
  game,
  chore,
  now = new Date(),
}: {
  game: GameState;
  chore: NpcChore;
  now: Date;
}) {
  const items = Object.assign({}, chore.reward.items) ?? {};

  if (!items[getSeasonalTicket(now)]) return items;
  let amount = items[getSeasonalTicket(now)] ?? 0;

  if (hasVipAccess({ game, now: now.getTime() })) {
    amount += 2;
  }
  const chapter = getCurrentSeason(now);
  const chapterBoost = CHAPTER_TICKET_BOOST_ITEMS[chapter];

  Object.values(chapterBoost).forEach((item) => {
    if (isCollectible(item)) {
      if (isCollectibleBuilt({ game, name: item })) {
        amount += 1;
      }
    } else {
      if (isWearableActive({ game, name: item })) {
        amount += 1;
      }
    }
  });

  items[getSeasonalTicket(now)] = amount;

  return items;
}
