import { produce } from "immer";
import { CollectibleName } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import { PlaceableLocation } from "features/game/types/collectibles";
import { isPetCollectible } from "./placeCollectible";

export interface FlipCollectibleAction {
  type: "collectible.flipped";
  name: CollectibleName;
  id: string;
  location: PlaceableLocation;
}

type Options = {
  state: Readonly<GameState>;
  action: FlipCollectibleAction;
};

export function flipCollectible({ state, action }: Options) {
  return produce(state, (game) => {
    const { name, id, location } = action;

    const getCollectibleGroup = (
      location: PlaceableLocation,
      name: CollectibleName,
    ) => {
      if (location === "home") {
        return game.home.collectibles[name];
      } else if (location === "petHouse") {
        if (!isPetCollectible(name)) {
          throw new Error(
            "Only pet collectibles can be placed in the pet house",
          );
        }
        return game.petHouse.pets[name];
      } else {
        return game.collectibles[name];
      }
    };

    const collectibleItems = getCollectibleGroup(location, name);

    if (!collectibleItems) {
      throw new Error(`Collectible ${name} not found`);
    }
    const collectible = collectibleItems.find(
      (collectible) => collectible.id === id,
    );

    if (!collectible) {
      throw new Error(`Collectible ${name} with id ${id} not found`);
    }

    collectible.flipped = !collectible.flipped;

    return game;
  });
}
