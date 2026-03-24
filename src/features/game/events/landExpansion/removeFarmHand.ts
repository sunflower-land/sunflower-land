import { GameState } from "features/game/types/game";
import { populateSaltFarm } from "features/game/types/salt";
import { produce } from "immer";
import { PlaceableLocation } from "features/game/types/collectibles";

export type RemoveFarmHandAction = {
  type: "farmHand.removed";
  location: PlaceableLocation;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveFarmHandAction;
  createdAt?: number;
};

export function removeFarmHand({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const farmHand = game.farmHands.bumpkins[action.id];

    if (!farmHand) {
      throw new Error("Farm hand does not exist");
    }

    game = populateSaltFarm({ game, now: createdAt });

    delete farmHand.coordinates;
    delete farmHand.location;
  });
}
