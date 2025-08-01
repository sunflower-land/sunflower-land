import { produce } from "immer";
import { CollectibleName } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import { PlaceableLocation } from "features/game/types/collectibles";

export interface FlipCollectibleAction {
  type: "collectible.flipped";
  name: CollectibleName;
  id: string;
  location: PlaceableLocation;
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
    const { name, id, location } = action;

    const collectibles =
      location === "home" ? game.home.collectibles : game.collectibles;

    if (!collectibles[name]) {
      throw new Error(`Collectible ${name} not found`);
    }
    const collectible = collectibles[name].find(
      (collectible) => collectible.id === id,
    );

    if (!collectible) {
      throw new Error(`Collectible ${name} with id ${id} not found`);
    }

    collectible.flipped = !collectible.flipped;

    return game;
  });
}
