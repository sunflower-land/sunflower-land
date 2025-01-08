import Decimal from "decimal.js-light";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { isWearableActive } from "features/game/lib/wearables";
import { ChoreV2Name, GameState } from "features/game/types/game";
import {
  getCurrentSeason,
  getSeasonalTicket,
} from "features/game/types/seasons";
import { produce } from "immer";

const CHORE_TICKETS: Record<ChoreV2Name, number> = {
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
};

export function generateChoreTickets({
  game,
  id,
  now = new Date(),
}: {
  game: GameState;
  id: ChoreV2Name;
  now?: Date;
}) {
  let amount = CHORE_TICKETS[id];

  if (!amount) {
    return 0;
  }

  if (hasVipAccess({ game, now: now.getTime() })) {
    amount += 2;
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

export type CompleteChoreAction = {
  type: "chore.completed";
  id?: number;
};

type Options = {
  state: Readonly<GameState>;
  action: CompleteChoreAction;
  createdAt?: number;
  farmId?: number;
};

export const isChoreId = (id: number): id is ChoreV2Name => id in ChoreV2Name;

export function completeChore({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const { id } = action;
    const { chores, bumpkin } = game;

    if (id === undefined) {
      throw new Error("Chore ID not supplied");
    }

    if (!chores) {
      throw new Error("No chores found");
    }

    if (!bumpkin) {
      throw new Error("No bumpkin found");
    }

    if (!isChoreId(id)) {
      throw new Error("Invalid chore ID");
    }

    const chore = chores.chores[id];

    if ((chore.completedAt ?? 0) > 0) {
      throw new Error("Chore is already completed");
    }

    if (bumpkin.id !== chore.bumpkinId) {
      throw new Error("Not the same bumpkin");
    }

    const progress =
      bumpkin?.activity?.[chore.activity] ?? 0 - chore.startCount;

    if (progress < chore.requirement) {
      throw new Error("Chore is not completed");
    }

    const tickets = generateChoreTickets({
      game,
      id,
      now: new Date(createdAt),
    });

    if (!tickets) {
      throw new Error("No tickets exist for this chore");
    }

    const ticket = getSeasonalTicket(new Date(createdAt));
    const previous = game.inventory[ticket] ?? new Decimal(0);
    game.inventory[ticket] = previous.add(tickets);

    chore.completedAt = createdAt;
    chores.choresCompleted += 1;

    return game;
  });
}
