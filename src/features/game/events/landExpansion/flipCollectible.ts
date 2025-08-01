import { produce } from "immer";
import { CollectibleName } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";

export interface FlipCollectibleAction {
  type: "collectible.flipped";
  name: CollectibleName;
  id: string;
}

type Options = {
  state: Readonly<GameState>;
  action: FlipCollectibleAction;
  createdAt?: number;
};

export function flipCollectible({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (game) => {
    const { name, id } = action;

    if (!game.collectibles[name]) {
      throw new Error(`Collectible ${name} not found`);
    }
    const collectible = game.collectibles[name].find(
      (collectible) => collectible.id === id,
    );

    if (!collectible) {
      throw new Error(`Collectible ${name} with id ${id} not found`);
    }

    collectible.flipped = !collectible.flipped;

    return game;
  });
}
