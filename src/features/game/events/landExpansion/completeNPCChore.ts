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
} from "features/game/types/seasons";
import { isWearableActive } from "features/game/lib/wearables";
import { hasVipAccess } from "features/game/lib/vipAccess";

export type CompleteNPCChoreAction = {
  type: "chore.fulfilled";
  npcName: NPCName;
};

type Options = {
  state: Readonly<GameState>;
  action: CompleteNPCChoreAction;
  createdAt?: number;
};

export function completeNPCChore({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (draft) => {
    const { npcName } = action;
    const { choreBoard, bumpkin, npcs } = draft;

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

  if (hasVipAccess({ game, now: now.getTime() })) {
    items[getSeasonalTicket(now)] = (items[getSeasonalTicket(now)] ?? 0) + 2;
  }

  if (
    getCurrentSeason() === "Bull Run" &&
    isWearableActive({ game, name: "Cowboy Hat" })
  ) {
    items[getSeasonalTicket(now)] = (items[getSeasonalTicket(now)] ?? 0) + 1;
  }

  if (
    getCurrentSeason() === "Bull Run" &&
    isWearableActive({ game, name: "Cowboy Shirt" })
  ) {
    items[getSeasonalTicket(now)] = (items[getSeasonalTicket(now)] ?? 0) + 1;
  }

  if (
    getCurrentSeason() === "Bull Run" &&
    isWearableActive({ game, name: "Cowboy Trouser" })
  ) {
    items[getSeasonalTicket(now)] = (items[getSeasonalTicket(now)] ?? 0) + 1;
  }

  return items;
}
