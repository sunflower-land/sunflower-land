import cloneDeep from "lodash.clonedeep";
import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";

export type EnterRaffleAction = {
  type: "raffle.entered";
};

type Options = {
  state: GameState;
  action: EnterRaffleAction;
  createdAt?: number;
  randomGenerator?: () => number;
};

export function enterRaffle({
  state,
  action,
  createdAt = Date.now(),
  randomGenerator = Math.random,
}: Options): GameState {
  const game = cloneDeep(state);

  const tickets = game.inventory["Prize Ticket"] ?? new Decimal(0);

  if (!tickets.gte(1)) {
    throw new Error("Missing Treasure Key");
  }

  game.inventory["Prize Ticket"] = tickets.sub(1);

  const monthKey = new Date(createdAt).toISOString().slice(0, 7);

  const raffle = game.pumpkinPlaza.raffle ?? {
    entries: {},
  };

  game.pumpkinPlaza.raffle = {
    ...raffle,
    entries: {
      ...raffle.entries,
      [monthKey]: (raffle.entries[monthKey] ?? 0) + 1,
    },
  };

  return {
    ...game,
  };
}
