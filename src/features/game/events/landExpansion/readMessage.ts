import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type MessageRead = {
  id: string;
  type: "message.read";
};

type Options = {
  state: Readonly<GameState>;
  action: MessageRead;
  createdAt?: number;
};

const clone = (state: GameState): GameState => {
  return cloneDeep(state);
};

export function readMessage({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = clone(state);

  game.mailbox.read.push({
    id: action.id,
    createdAt,
  });

  return game;
}
