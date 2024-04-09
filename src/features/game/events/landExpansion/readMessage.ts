import Decimal from "decimal.js-light";
import { Announcements } from "features/game/types/announcements";
import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type MessageRead = {
  id: string;
  type: "message.read";
};

type Options = {
  state: Readonly<GameState>;
  action: MessageRead;
  announcements?: Announcements;
  createdAt?: number;
};

const clone = (state: GameState): GameState => {
  return cloneDeep(state);
};

export function readMessage({
  state,
  action,
  announcements,
  createdAt = Date.now(),
}: Options): GameState {
  const game = clone(state);

  const message = state.mailbox.read.find((mail) => mail.id === action.id);
  if (message) {
    throw new Error("Message already read");
  }

  game.mailbox.read.push({
    id: action.id,
    createdAt,
  });

  const announcement = announcements?.[action.id];

  const reward = announcement?.reward;
  if (reward) {
    getKeys(reward.items).forEach((name) => {
      const previous = game.inventory[name] ?? new Decimal(0);
      game.inventory[name] = previous.add(reward.items[name] ?? 0);
    });

    if (reward.coins) {
      game.coins = game.coins + reward.coins;
    }
  }

  return game;
}
