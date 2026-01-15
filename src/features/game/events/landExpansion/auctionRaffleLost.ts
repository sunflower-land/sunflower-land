import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type AuctionRaffleLostAction = {
  type: "auctionRaffle.lost";
};

type Options = {
  state: GameState;
  action: AuctionRaffleLostAction;
};

export function auctionRaffleLost({ state }: Options): GameState {
  return produce(state, (game) => {
    delete game.raffle;

    return game;
  });
}
