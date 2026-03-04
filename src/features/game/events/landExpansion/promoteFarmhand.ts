import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type PromoteFarmhandAction = {
  type: "farmhand.promoted";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: PromoteFarmhandAction;
  createdAt?: number;
};

export function promoteFarmhand({ state, action }: Options): GameState {
  return produce(state, (game) => {
    const farmHand = game.farmHands.bumpkins[action.id];

    if (!farmHand) {
      throw new Error("Farm hand does not exist");
    }

    if (!game.bumpkin) {
      throw new Error("No bumpkin");
    }

    const bumpkinEquipped = game.bumpkin.equipped;
    game.bumpkin.equipped = farmHand.equipped;
    farmHand.equipped = bumpkinEquipped;

    const bumpkinCoords = game.bumpkin.coordinates;
    const bumpkinLocation = game.bumpkin.location;
    game.bumpkin.coordinates = farmHand.coordinates;
    game.bumpkin.location = farmHand.location;
    farmHand.coordinates = bumpkinCoords;
    farmHand.location = bumpkinLocation;
  });
}
