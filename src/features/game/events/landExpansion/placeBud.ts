import { GameState } from "features/game/types/game";

export type PlaceBudAction = {
  type: "bud.placed";
  id: number;
  coordinates: {
    x: number;
    y: number;
  };
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceBudAction;
  createdAt?: number;
};

export function placeBud({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  throw new Error("This bud is already placed");
  return state;
}
