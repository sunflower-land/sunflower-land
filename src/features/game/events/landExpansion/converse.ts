import Decimal from "decimal.js-light";
import {
  CONVERSATIONS,
  ConversationName,
} from "features/game/types/conversations";
import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type ConversationEnded = {
  id: ConversationName;
  type: "conversation.ended";
};

type Options = {
  state: Readonly<GameState>;
  action: ConversationEnded;
  createdAt?: number;
};

const clone = (state: GameState): GameState => {
  return cloneDeep(state);
};

export function endConversation({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = clone(state);

  // Add to mailbox history
  const conversation = game.conversations.find((id) => id === action.id);

  if (!conversation) {
    throw new Error("Conversation does not exist");
  }

  const reward = CONVERSATIONS[conversation].reward;
  if (reward) {
    getKeys(reward.items).forEach((name) => {
      const previous = game.inventory[name] ?? new Decimal(0);
      game.inventory[name] = previous.add(reward.items[name] ?? 0);
    });
  }

  game.mailbox.read.push({
    id: conversation,
    createdAt,
  });

  // Remove it
  game.conversations = game.conversations.filter((id) => id !== action.id);

  return game;
}
