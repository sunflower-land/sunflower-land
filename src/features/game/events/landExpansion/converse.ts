import { ConversationName } from "features/game/types/conversations";
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

  game.mailbox.read.push(conversation);

  // Remove it
  game.conversations = game.conversations.filter((id) => id !== action.id);

  if (action.id === "hank-intro") {
    game.conversations.push("betty-intro");
  }

  return game;
}
